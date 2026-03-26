/**
 * Session 存储实现
 * 使用 JSONL 格式保存对话历史
 */

import fs from 'fs';
import path from 'path';

/**
 * Session 元数据
 */
export interface SessionMeta {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  isActive: boolean;
}

/**
 * Session 消息
 */
export interface SessionMessage {
  seq: number;
  role: 'user' | 'assistant' | 'compressed';
  content: string;
  timestamp: string;
  thinking?: string;
  toolCalls?: ToolCall[];
}

/**
 * 工具调用记录
 */
export interface ToolCall {
  toolCallId?: string;  // Vercel AI SDK 的工具调用 ID
  tool: string;
  args: any;
  result: any;
  success: boolean;
}

/**
 * Session 索引
 */
interface SessionIndex {
  sessions: SessionMeta[];
}

/**
 * Session Store 类
 */
export class SessionStore {
  private baseDir: string;

  constructor(baseDir: string = '.sessionstore') {
    this.baseDir = path.resolve(process.cwd(), baseDir);
    this.ensureDir();
  }

  /**
   * 确保存储目录存在
   */
  private ensureDir(): void {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * 获取索引文件路径
   */
  private getIndexPath(): string {
    return path.join(this.baseDir, 'index.json');
  }

  /**
   * 获取 session 文件路径
   */
  private getSessionPath(sessionId: string): string {
    return path.join(this.baseDir, `${sessionId}.jsonl`);
  }

  /**
   * 读取索引
   */
  private readIndex(): SessionIndex {
    const indexPath = this.getIndexPath();
    if (!fs.existsSync(indexPath)) {
      return { sessions: [] };
    }
    try {
      return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    } catch {
      return { sessions: [] };
    }
  }

  /**
   * 写入索引
   */
  private writeIndex(index: SessionIndex): void {
    fs.writeFileSync(this.getIndexPath(), JSON.stringify(index, null, 2));
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 创建新 session
   */
  async createSession(title?: string): Promise<SessionMeta> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const meta: SessionMeta = {
      id,
      title: title || '新对话',
      summary: '',
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      isActive: true,
    };

    // 创建空的 session 文件
    fs.writeFileSync(this.getSessionPath(id), '');

    // 更新索引
    const index = this.readIndex();
    index.sessions.unshift(meta);
    this.writeIndex(index);

    return meta;
  }

  /**
   * 获取 session 列表
   */
  async listSessions(): Promise<SessionMeta[]> {
    const index = this.readIndex();
    return index.sessions.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  /**
   * 获取 session 元数据
   */
  async getSessionMeta(sessionId: string): Promise<SessionMeta | null> {
    const index = this.readIndex();
    return index.sessions.find(s => s.id === sessionId) || null;
  }

  /**
   * 获取 session 消息历史
   */
  async getMessages(sessionId: string): Promise<SessionMessage[]> {
    const sessionPath = this.getSessionPath(sessionId);
    if (!fs.existsSync(sessionPath)) {
      return [];
    }

    const content = fs.readFileSync(sessionPath, 'utf8');
    if (!content.trim()) {
      return [];
    }

    return content.trim().split('\n').map(line => {
      try {
        return JSON.parse(line) as SessionMessage;
      } catch {
        return null;
      }
    }).filter((msg): msg is SessionMessage => msg !== null);
  }

  /**
   * 追加消息
   */
  async appendMessage(sessionId: string, message: Omit<SessionMessage, 'seq'>): Promise<SessionMessage> {
    const messages = await this.getMessages(sessionId);
    const seq = messages.length;

    const fullMessage: SessionMessage = {
      ...message,
      seq,
    };

    // 追加到 JSONL 文件
    const sessionPath = this.getSessionPath(sessionId);
    fs.appendFileSync(sessionPath, JSON.stringify(fullMessage) + '\n');

    // 更新索引
    const index = this.readIndex();
    const sessionIndex = index.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex >= 0) {
      index.sessions[sessionIndex].messageCount = seq + 1;
      index.sessions[sessionIndex].updatedAt = new Date().toISOString();

      // 更新摘要（最后一条用户消息）
      if (message.role === 'user') {
        index.sessions[sessionIndex].summary = message.content.substring(0, 100);
      }

      // 自动生成标题（基于前两条消息）
      if (seq <= 1 && message.role === 'user') {
        index.sessions[sessionIndex].title = this.generateTitle(message.content);
      }

      this.writeIndex(index);
    }

    return fullMessage;
  }

  /**
   * 生成标题
   */
  private generateTitle(content: string): string {
    // 简单的标题生成逻辑
    let title = content.trim();

    // 移除常见的前缀
    const prefixes = ['帮我', '请', '我想', '我要', '能否', '可以'];
    for (const prefix of prefixes) {
      if (title.startsWith(prefix)) {
        title = title.substring(prefix.length);
      }
    }

    // 截断到合理长度
    if (title.length > 20) {
      title = title.substring(0, 20) + '...';
    }

    return title || '新对话';
  }

  /**
   * 插入压缩摘要消息
   * 将当前 session 从最后一条 compressed 消息之后的内容压缩为一条 compressed 消息
   * 原始消息保留在文件中，compressed 消息追加在末尾
   * reloadMessages 读取时会找到最后一条 compressed 并截断其前面的历史
   */
  async insertCompressedSummary(sessionId: string, summary: string): Promise<SessionMessage> {
    return this.appendMessage(sessionId, {
      role: 'compressed',
      content: summary,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 截断 session 消息
   * 保留 seq <= keepSeq 的消息，删除之后的所有消息
   * 用于"重做"功能：回到指定用户消息位置
   */
  async truncateSession(sessionId: string, keepSeq: number): Promise<void> {
    const allMessages = await this.getMessages(sessionId);
    const keptMessages = allMessages.filter(m => m.seq <= keepSeq);

    // 重写 JSONL 文件
    const sessionPath = this.getSessionPath(sessionId);
    const content = keptMessages.map(m => JSON.stringify(m)).join('\n') + (keptMessages.length > 0 ? '\n' : '');
    fs.writeFileSync(sessionPath, content);

    // 更新索引
    const index = this.readIndex();
    const sessionIndex = index.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex >= 0) {
      index.sessions[sessionIndex].messageCount = keptMessages.length;
      index.sessions[sessionIndex].updatedAt = new Date().toISOString();
      // 更新摘要为最后一条用户消息
      const lastUserMsg = [...keptMessages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) {
        index.sessions[sessionIndex].summary = lastUserMsg.content.substring(0, 100);
      }
      this.writeIndex(index);
    }
  }

  /**
   * 更新 session 元数据
   */
  async updateSessionMeta(sessionId: string, updates: Partial<SessionMeta>): Promise<void> {
    const index = this.readIndex();
    const sessionIndex = index.sessions.findIndex(s => s.id === sessionId);

    if (sessionIndex >= 0) {
      index.sessions[sessionIndex] = {
        ...index.sessions[sessionIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.writeIndex(index);
    }
  }

  /**
   * 删除 session
   */
  async deleteSession(sessionId: string): Promise<void> {
    // 删除 session 文件
    const sessionPath = this.getSessionPath(sessionId);
    if (fs.existsSync(sessionPath)) {
      fs.unlinkSync(sessionPath);
    }

    // 从索引中移除
    const index = this.readIndex();
    index.sessions = index.sessions.filter(s => s.id !== sessionId);
    this.writeIndex(index);
  }

  /**
   * 清空所有 session
   */
  async clearAll(): Promise<void> {
    const index = this.readIndex();

    // 删除所有 session 文件
    for (const session of index.sessions) {
      const sessionPath = this.getSessionPath(session.id);
      if (fs.existsSync(sessionPath)) {
        fs.unlinkSync(sessionPath);
      }
    }

    // 清空索引
    this.writeIndex({ sessions: [] });
  }
}

// 全局单例
let storeInstance: SessionStore | null = null;

/**
 * 获取 Session Store 实例
 */
export function getSessionStore(): SessionStore {
  if (!storeInstance) {
    storeInstance = new SessionStore();
  }
  return storeInstance;
}
