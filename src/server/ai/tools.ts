/**
 * oh-my-sage - AI 工具定义
 * 所有 Agent 能力都通过工具实现
 */

import { z } from 'zod';
import { tool } from 'ai';
import { GatewayClient } from '../gateway/client';
import { SuggestionGenerator } from '../agent/suggestions';
import { Device, Intent } from '../../shared/types';
import { ModelConfig, getModelConfigFromEnv } from './model';
import { getSkillByName, formatSkillContent, readSkillFile, getSkillCatalog } from '../skills/loader';

/**
 * 创建工具定义
 * 
 * @param gatewayClient 网关客户端实例
 * @param modelConfig 模型配置（可选）
 * @returns 工具定义对象
 */
export function createTools(gatewayClient: GatewayClient, modelConfig?: ModelConfig) {
  const config = modelConfig || getModelConfigFromEnv();
  const suggestionGenerator = new SuggestionGenerator(config);
  
  return {
    // ==================== 思考工具 ====================
    
    /**
     * 思考工具
     * 仅用于复杂任务（如创建规则），简单任务不要使用
     */
    'think': tool({
      description: '仅用于复杂任务的思考（如创建规则）。简单任务（查询设备、查看规则等）不要使用此工具，直接调用相应工具即可。',
      parameters: z.object({
        thought: z.string().describe('思考内容'),
        nextAction: z.string().optional().describe('下一步行动'),
      }),
      execute: async ({ thought, nextAction }) => {
        return {
          success: true,
          thought,
          nextAction,
        };
      },
    }),
    
    /**
     * 向用户提问
     * 仅用于需要用户选择或确认时
     */
    'ask_user': tool({
      description: '仅用于需要用户选择或确认时。简单任务不要使用。',
      parameters: z.object({
        question: z.string().describe('问题内容'),
        options: z.array(z.string()).describe('选项列表，必须是字符串数组，例如: ["选项1", "选项2"]'),
        needConfirm: z.boolean().optional().describe('是否需要确认（是/否）'),
      }),
      execute: async ({ question, options, needConfirm }) => {
        return {
          success: true,
          needsUserInput: true,
          question,
          options,
          needConfirm,
        };
      },
    }),
    
    // ==================== 设备相关工具 ====================
    
    /**
     * 获取设备列表
     */
    'get_devices': tool({
      description: '获取所有智能家居设备列表，包括设备名称、型号、在线状态等信息',
      parameters: z.object({
        refresh: z.boolean().optional().describe('是否强制刷新缓存'),
      }),
      execute: async ({ refresh = false }) => {
        try {
          const response = await gatewayClient.callApi('getDevList', {}, 10000);
          const devList = response.devList || {};
          const devices = Object.entries(devList).map(([did, device]: [string, any]) => ({
            did,
            name: device.name,
            model: device.model,
            modelName: device.modelName,
            online: device.online,
            roomName: device.roomName,
            icon: device.icon,
          }));
          return {
            success: true,
            devices,
            count: devices.length,
          };
        } catch (error) {
          return {
            success: false,
            error: `获取设备列表失败: ${error}`,
          };
        }
      },
    }),
    
    /**
     * 搜索设备
     */
    'search_devices': tool({
      description: '根据名称、房间或类型搜索设备',
      parameters: z.object({
        query: z.string().describe('搜索关键词（设备名称、房间名称）'),
      }),
      execute: async ({ query }) => {
        try {
          const response = await gatewayClient.callApi('getDevList', {}, 10000);
          const devList = response.devList || {};
          const lowerQuery = query.toLowerCase();
          
          const matchedDevices = Object.entries(devList)
            .filter(([did, device]: [string, any]) => {
              const nameMatch = device.name?.toLowerCase().includes(lowerQuery);
              const roomMatch = device.roomName?.toLowerCase().includes(lowerQuery);
              const modelMatch = device.modelName?.toLowerCase().includes(lowerQuery);
              return nameMatch || roomMatch || modelMatch;
            })
            .map(([did, device]: [string, any]) => ({
              did,
              name: device.name,
              model: device.model,
              modelName: device.modelName,
              online: device.online,
              roomName: device.roomName,
            }));
          
          return {
            success: true,
            devices: matchedDevices,
            count: matchedDevices.length,
          };
        } catch (error) {
          return {
            success: false,
            error: `搜索设备失败: ${error}`,
          };
        }
      },
    }),
    
    /**
     * 获取设备详情
     */
    'get_device': tool({
      description: '获取指定设备的详细信息',
      parameters: z.object({
        did: z.string().describe('设备ID'),
      }),
      execute: async ({ did }) => {
        try {
          const response = await gatewayClient.callApi('getDevList', {}, 10000);
          const devList = response.devList || {};
          const device = devList[did];
          
          if (!device) {
            return {
              success: false,
              error: `设备不存在: ${did}`,
            };
          }
          
          return {
            success: true,
            device: {
              did,
              name: device.name,
              model: device.model,
              modelName: device.modelName,
              online: device.online,
              roomName: device.roomName,
              urn: device.urn,
              icon: device.icon,
              specV2Access: device.specV2Access,
              specV3Access: device.specV3Access,
              pushAvailable: device.pushAvailable,
            },
          };
        } catch (error) {
          return {
            success: false,
            error: `获取设备详情失败: ${error}`,
          };
        }
      },
    }),
    
    // ==================== 规则相关工具 ====================
    
    /**
     * 获取规则列表
     */
    'get_graphs': tool({
      description: '获取所有自动化规则列表',
      parameters: z.object({}),
      execute: async () => {
        try {
          const graphs = await gatewayClient.callApi('getGraphList', {}, 10000);
          const graphList = Array.isArray(graphs) ? graphs : [];
          return {
            success: true,
            graphs: graphList.map((graph: any) => ({
              id: graph.id,
              name: graph.userData?.name || graph.id,
              enable: graph.enable,
              lastUpdateTime: graph.userData?.lastUpdateTime,
            })),
            count: graphList.length,
          };
        } catch (error) {
          return {
            success: false,
            error: `获取规则列表失败: ${error}`,
          };
        }
      },
    }),
    
    /**
     * 获取规则详情
     */
    'get_graph': tool({
      description: '获取指定规则的详细信息，包括所有节点和连接',
      parameters: z.object({
        id: z.string().describe('规则ID'),
      }),
      execute: async ({ id }) => {
        try {
          const graph = await gatewayClient.callApi('getGraph', { id }, 10000);
          return {
            success: true,
            graph,
          };
        } catch (error) {
          return {
            success: false,
            error: `获取规则详情失败: ${error}`,
          };
        }
      },
    }),
    
    /**
     * 创建规则
     */
    'create_graph': tool({
      description: '创建新的自动化规则。创建前请先使用 generate_suggestions 生成方案并获得用户确认。',
      parameters: z.object({
        name: z.string().describe('规则名称'),
        nodes: z.array(z.any()).describe('节点列表'),
        enable: z.boolean().optional().describe('是否启用'),
      }),
      execute: async ({ name, nodes, enable = true }) => {
        try {
          const graphId = `graph_${Date.now()}`;
          const graph: any = {
            id: graphId,
            nodes: nodes,
            cfg: {
              id: graphId,
              enable,
              uiType: 'automation',
              userData: {
                name,
                lastUpdateTime: Date.now(),
                transform: { x: 0, y: 0, scale: 1, rotate: 0 },
              },
            },
          };
          
          await gatewayClient.callApi('setGraph', graph, 10000);
          
          return {
            success: true,
            graphId,
            message: `规则 "${name}" 创建成功`,
          };
        } catch (error) {
          return {
            success: false,
            error: `创建规则失败: ${error}`,
          };
        }
      },
    }),
    
    /**
     * 更新规则
     */
    'update_graph': tool({
      description: '更新现有规则。更新前请先获取规则详情并获得用户确认。',
      parameters: z.object({
        id: z.string().describe('规则ID'),
        name: z.string().optional().describe('新规则名称'),
        nodes: z.array(z.any()).optional().describe('新节点列表'),
        enable: z.boolean().optional().describe('是否启用'),
      }),
      execute: async ({ id, name, nodes, enable }) => {
        try {
          // 获取现有规则的节点
          const existing = await gatewayClient.callApi('getGraph', { id }, 10000);

          // 从 getGraphList 获取规则名称（getGraph 只返回 nodes，不包含 userData）
          const graphList = await gatewayClient.callApi('getGraphList', {}, 10000);
          const graphInfo = Array.isArray(graphList)
            ? graphList.find((g: any) => g.id === id)
            : null;

          const graph: any = {
            id,
            nodes: nodes || existing.nodes,
            cfg: {
              id,
              enable: enable !== undefined ? enable : true,
              uiType: 'automation',
              userData: {
                name: name || graphInfo?.userData?.name || '规则',
                lastUpdateTime: Date.now(),
                transform: graphInfo?.userData?.transform || { x: 0, y: 0, scale: 1, rotate: 0 },
              },
            },
          };

          await gatewayClient.callApi('setGraph', graph, 10000);

          return {
            success: true,
            message: `规则 ${id} 更新成功`,
          };
        } catch (error) {
          return {
            success: false,
            error: `更新规则失败: ${error}`,
          };
        }
      },
    }),
    
    /**
     * 删除规则
     */
    'delete_graph': tool({
      description: '删除指定的自动化规则。删除前请获得用户确认。',
      parameters: z.object({
        id: z.string().describe('规则ID'),
      }),
      execute: async ({ id }) => {
        try {
          await gatewayClient.callApi('deleteGraph', { id }, 10000);
          return {
            success: true,
            message: `规则 ${id} 删除成功`,
          };
        } catch (error) {
          return {
            success: false,
            error: `删除规则失败: ${error}`,
          };
        }
      },
    }),
    
    /**
     * 启用/禁用规则
     */
    'toggle_graph': tool({
      description: '启用或禁用指定的自动化规则',
      parameters: z.object({
        id: z.string().describe('规则ID'),
        enable: z.boolean().describe('是否启用'),
      }),
      execute: async ({ id, enable }) => {
        try {
          // 先从 getGraphList 获取规则信息（包含 userData.name）
          const graphList = await gatewayClient.callApi('getGraphList', {}, 10000);
          const graphInfo = Array.isArray(graphList)
            ? graphList.find((g: any) => g.id === id)
            : null;

          if (!graphInfo) {
            return {
              success: false,
              error: `规则 ${id} 不存在`,
            };
          }

          // 调用 changeGraphConfig 需要传递完整的 userData，否则会丢失规则名称
          await gatewayClient.callApi('changeGraphConfig', {
            id,
            enable,
            userData: {
              name: graphInfo.userData?.name || '未命名规则',
              lastUpdateTime: Date.now(),
              transform: graphInfo.userData?.transform || { x: 0, y: 0, scale: 1, rotate: 0 },
            },
          }, 10000);

          return {
            success: true,
            message: `规则 ${id} 已${enable ? '启用' : '禁用'}`,
          };
        } catch (error) {
          return {
            success: false,
            error: `切换规则状态失败: ${error}`,
          };
        }
      },
    }),
    
    // ==================== 建议生成工具 ====================
    
    /**
     * 生成建议方案
     * 为用户的自动化需求生成多个实现方案
     * 
     * 重要：只调用一次，生成完整方案
     */
    'generate_suggestions': tool({
      description: `为用户的自动化需求生成多个实现方案。
重要规则：
1. **只调用一次**，不要多次调用
2. 方案必须按推荐度从高到低排序（最推荐的方案放在第一个）
3. 第一个方案是最简单直接、最符合用户需求的方案
4. 后续方案是更复杂但可能更有特色的方案
5. 方案数量3个，不要太多
6. 用户选择后直接执行，不再询问确认`,
      parameters: z.object({
        intent: z.object({
          type: z.string().describe('意图类型，如 create_graph'),
          ruleName: z.string().optional().describe('规则名称'),
          trigger: z.object({
            type: z.string(),
            deviceName: z.string().optional(),
            property: z.string().optional(),
            operator: z.string().optional(),
            value: z.any().optional(),
            time: z.object({
              hour: z.number(),
              minute: z.number(),
            }).optional(),
          }).optional(),
          actions: z.array(z.object({
            type: z.string(),
            deviceName: z.string().optional(),
            action: z.string().optional(),
            value: z.any().optional(),
          })).optional(),
        }).describe('用户意图'),
      }),
      execute: async ({ intent }) => {
        try {
          // 获取设备列表
          const deviceResponse = await gatewayClient.getDeviceList();
          const devices = Object.values(deviceResponse.devList);
          
          // 使用 SuggestionGenerator 生成建议
          const suggestions = await suggestionGenerator.generate(intent as Intent, devices);
          
          return {
            success: true,
            suggestions,
            count: suggestions.length,
          };
        } catch (error) {
          return {
            success: false,
            error: `生成建议失败: ${error}`,
          };
        }
      },
    }),
    
    // ==================== 变量相关工具 ====================
    
    /**
     * 获取变量列表
     */
    'get_variables': tool({
      description: '获取全局变量列表',
      parameters: z.object({}),
      execute: async () => {
        try {
          const variables = await gatewayClient.callApi('getVarList', { scope: 'global' }, 10000);
          return {
            success: true,
            variables,
          };
        } catch (error) {
          return {
            success: false,
            error: `获取变量列表失败: ${error}`,
          };
        }
      },
    }),
    
    /**
     * 设置变量值
     */
    'set_variable': tool({
      description: '设置变量的值',
      parameters: z.object({
        id: z.string().describe('变量ID'),
        value: z.union([z.string(), z.number()]).describe('变量值'),
      }),
      execute: async ({ id, value }) => {
        try {
          await gatewayClient.callApi('setVarValue', { scope: 'global', id, value }, 10000);
          return {
            success: true,
            message: `变量 ${id} 已更新为 ${value}`,
          };
        } catch (error) {
          return {
            success: false,
            error: `设置变量值失败: ${error}`,
          };
        }
      },
    }),

    // ==================== Skill 工具 ====================

    /**
     * 激活 Skill（渐进式披露第二层）
     * 当任务匹配某个 skill 的描述时，使用此工具加载其完整内容
     */
    'activate_skill': tool({
      description: '激活指定的 skill，加载其完整指导内容。当任务匹配某个 skill 的描述时使用此工具。',
      parameters: z.object({
        name: z.string().describe('skill 名称'),
      }),
      execute: async ({ name }) => {
        const skill = getSkillByName(name);
        if (!skill) {
          const catalog = getSkillCatalog();
          const available = catalog.map(s => s.name).join(', ');
          return {
            success: false,
            error: `Skill "${name}" 不存在。可用的 skills: ${available}`,
          };
        }

        return {
          success: true,
          skill: skill.name,
          content: formatSkillContent(skill),
          resources: skill.resources,
          message: `已激活 skill: ${skill.name}`,
        };
      },
    }),

    /**
     * 读取 Skill 资源文件（渐进式披露第三层）
     * 读取 skill 目录中的 references/, scripts/, assets/ 等文件
     */
    'read_skill_file': tool({
      description: '读取 skill 目录中的资源文件（如 references/ 中的详细文档）。需要先使用 activate_skill 激活 skill。',
      parameters: z.object({
        skillName: z.string().describe('skill 名称'),
        filePath: z.string().describe('相对于 skill 目录的文件路径，如 references/node-types.md'),
      }),
      execute: async ({ skillName, filePath }) => {
        const content = readSkillFile(skillName, filePath);
        if (content === null) {
          return {
            success: false,
            error: `无法读取文件: ${filePath}`,
          };
        }

        return {
          success: true,
          skillName,
          filePath,
          content,
        };
      },
    }),
  };
}


