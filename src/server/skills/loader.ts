/**
 * Skills Loader
 * 动态加载 .agents/skills/ 目录下的 SKILL.md 文件
 *
 * 支持渐进式披露（Progressive Disclosure）：
 * - 第一层（Catalog）：name + description（~50-100 tokens per skill）
 * - 第二层（Instructions）：完整 SKILL.md body（<5000 tokens）
 * - 第三层（Resources）：references/, scripts/, assets/ 中的文件
 */

import fs from 'fs';
import path from 'path';

/**
 * Skill 元数据（渐进式披露第一层）
 * 只包含 name 和 description，用于 catalog 展示
 */
export interface SkillMeta {
    name: string;
    description: string;
}

/**
 * Skill 完整定义（渐进式披露第二层）
 */
export interface Skill extends SkillMeta {
    location: string;     // SKILL.md 文件绝对路径
    content: string;      // SKILL.md body 内容（不含 frontmatter）
    baseDir: string;      // skill 目录路径
    resources: string[];  // 可用资源文件列表
}

/**
 * 解析 SKILL.md 文件的 frontmatter
 */
function parseSkillFile(filePath: string): Skill | null {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // 解析 frontmatter
        const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        if (!frontmatterMatch) {
            console.warn(`[Skill] 无法解析 frontmatter: ${filePath}`);
            return null;
        }

        const [, frontmatter, body] = frontmatterMatch;

        // 解析 name 和 description
        const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
        const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

        if (!nameMatch || !descMatch) {
            console.warn(`[Skill] 缺少 name 或 description: ${filePath}`);
            return null;
        }

        const name = nameMatch[1].trim();
        const description = descMatch[1].trim();

        // 验证 name 格式
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
            console.warn(`[Skill] name 格式无效: ${name}`);
        }

        const baseDir = path.dirname(filePath);

        // 列出资源文件
        const resources = listResources(baseDir);

        return {
            name,
            description,
            location: filePath,
            content: body.trim(),
            baseDir,
            resources,
        };
    } catch (error) {
        console.error(`[Skill] 加载失败: ${filePath}`, error);
        return null;
    }
}

/**
 * 列出目录下的资源文件
 */
function listResources(baseDir: string): string[] {
    const resources: string[] = [];

    try {
        const entries = fs.readdirSync(baseDir, {withFileTypes: true});
        for (const entry of entries) {
            if (entry.isFile() && entry.name !== 'SKILL.md') {
                resources.push(entry.name);
            } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
                // 递归列出子目录中的文件
                const subDir = path.join(baseDir, entry.name);
                try {
                    const subEntries = fs.readdirSync(subDir, {withFileTypes: true});
                    for (const subEntry of subEntries) {
                        if (subEntry.isFile()) {
                            resources.push(`${entry.name}/${subEntry.name}`);
                        }
                    }
                } catch {
                    resources.push(`${entry.name}/`);
                }
            }
        }
    } catch (error) {
        console.error(`[Skill] 列出资源失败: ${baseDir}`, error);
    }

    return resources;
}

/**
 * 扫描目录下的所有 skills
 */
function scanSkillsDirectory(baseDir: string): Skill[] {
    const skills: Skill[] = [];

    if (!fs.existsSync(baseDir)) {
        return skills;
    }

    try {
        const entries = fs.readdirSync(baseDir, {withFileTypes: true});

        for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('.')) {
                const skillFile = path.join(baseDir, entry.name, 'SKILL.md');
                if (fs.existsSync(skillFile)) {
                    const skill = parseSkillFile(skillFile);
                    if (skill) {
                        skills.push(skill);
                    }
                }
            }
        }
    } catch (error) {
        console.error(`[Skill] 扫描目录失败: ${baseDir}`, error);
    }

    return skills;
}

/**
 * 加载所有 skills
 */
export function loadSkills(): Skill[] {
    const skillsMap = new Map<string, Skill>();

    // 1. 项目级 skills
    const projectSkillsDir = path.join(process.cwd(), '.agents', 'skills');
    const projectSkills = scanSkillsDirectory(projectSkillsDir);
    for (const skill of projectSkills) {
        skillsMap.set(skill.name, skill);
        console.log(`[Skill] 已加载（项目级）: ${skill.name}`);
    }

    // 2. 用户级 skills
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    if (homeDir) {
        const userSkillsDir = path.join(homeDir, '.agents', 'skills');
        const userSkills = scanSkillsDirectory(userSkillsDir);
        for (const skill of userSkills) {
            if (!skillsMap.has(skill.name)) {
                skillsMap.set(skill.name, skill);
                console.log(`[Skill] 已加载（用户级）: ${skill.name}`);
            } else {
                console.log(`[Skill] 跳过（项目级优先）: ${skill.name}`);
            }
        }
    }

    const skills = Array.from(skillsMap.values());
    console.log(`[Skill] 共加载 ${skills.length} 个 skills`);
    return skills;
}

// 全局缓存
let cachedSkills: Skill[] | null = null;

/**
 * 获取 skills（带缓存）
 */
export function getSkills(): Skill[] {
    if (cachedSkills === null) {
        cachedSkills = loadSkills();
    }
    return cachedSkills;
}

/**
 * 获取 skill 元数据列表（渐进式披露第一层）
 * 只返回 name 和 description
 */
export function getSkillCatalog(): SkillMeta[] {
    return getSkills().map(s => ({
        name: s.name,
        description: s.description,
    }));
}

/**
 * 根据名称获取 skill
 */
export function getSkillByName(name: string): Skill | null {
    return getSkills().find(s => s.name === name) || null;
}

/**
 * 格式化 skill catalog 为系统提示（渐进式披露第一层）
 * 只包含 name 和 description
 */
export function formatSkillCatalogForPrompt(): string {
    const catalog = getSkillCatalog();

    if (catalog.length === 0) {
        return '';
    }

    let prompt = '\n\n## 可用的 Skills\n\n';
    prompt += '以下 skills 提供了特定任务的专业指导。\n';
    prompt += '当任务匹配某个 skill 的描述时，使用 activate_skill 工具加载其完整内容。\n\n';

    for (const skill of catalog) {
        prompt += `- **${skill.name}**: ${skill.description}\n`;
    }

    return prompt;
}

/**
 * 格式化 skill 完整内容（渐进式披露第二层）
 * 包含 SKILL.md body 和可用资源列表
 */
export function formatSkillContent(skill: Skill): string {
    let content = `# Skill: ${skill.name}\n\n`;
    content += skill.content;

    // 添加资源列表
    if (skill.resources.length > 0) {
        content += '\n\n## 可用资源文件\n\n';
        for (const resource of skill.resources) {
            content += `- ${resource}\n`;
        }
        content += '\n使用 read_skill_file 工具读取这些文件。';
    }

    return content;
}

/**
 * 读取 skill 目录中的文件（渐进式披露第三层）
 */
export function readSkillFile(skillName: string, filePath: string): string | null {
    const skill = getSkillByName(skillName);
    if (!skill) {
        console.error(`[Skill] Skill 不存在: ${skillName}`);
        return null;
    }

    const absolutePath = path.resolve(skill.baseDir, filePath);

    // 安全检查：确保引用在 skill 目录内
    if (!absolutePath.startsWith(skill.baseDir)) {
        console.warn(`[Skill] 引用路径超出 skill 目录: ${filePath}`);
        return null;
    }

    try {
        if (fs.existsSync(absolutePath)) {
            return fs.readFileSync(absolutePath, 'utf8');
        } else {
            console.warn(`[Skill] 文件不存在: ${absolutePath}`);
        }
    } catch (error) {
        console.error(`[Skill] 读取文件失败: ${absolutePath}`, error);
    }

    return null;
}

/**
 * 清除缓存
 */
export function clearSkillsCache(): void {
    cachedSkills = null;
}
