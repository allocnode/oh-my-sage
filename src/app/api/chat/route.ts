/**
 * Chat API
 * 使用已建立的 WebSocket 连接进行对话
 */

import {NextRequest} from 'next/server';
import {getGateway, isGatewayConnected} from '@/server/gateway/shared';
import {Agent} from '@/server/agent/agent';
import {getModelConfigFromEnv} from '@/server/ai/model';
import {getSessionStore} from '@/server/session/store';

export const runtime = 'nodejs';

/**
 * POST /api/chat
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {message, modelConfig, sessionId} = body;

        if (!message) {
            return new Response(
                JSON.stringify({error: '缺少消息内容'}),
                {status: 400, headers: {'Content-Type': 'application/json'}}
            );
        }

        // 检查网关连接
        if (!isGatewayConnected()) {
            return new Response(
                JSON.stringify({error: '请先登录连接网关'}),
                {status: 400, headers: {'Content-Type': 'application/json'}}
            );
        }

        // 使用已建立的连接
        const gateway = getGateway()!;
        const config = modelConfig || getModelConfigFromEnv();
        const agent = new Agent(gateway, config);

        // 如果有 sessionId，加载历史
        if (sessionId) {
            await agent.loadSession(sessionId);
        } else {
            // 如果没有 sessionId，创建一个新的
            const store = getSessionStore();
            const newSession = await store.createSession();
            agent.setSession(newSession.id);
        }

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const output of agent.run(message)) {
                        const data = JSON.stringify(output);
                        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    const errorOutput = {type: 'error', error: String(error)};
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorOutput)}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(
            JSON.stringify({error: String(error)}),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
}

/**
 * GET /api/chat
 */
export async function GET() {
    return new Response(
        JSON.stringify({
            status: 'ok',
            connected: isGatewayConnected(),
        }),
        {headers: {'Content-Type': 'application/json'}}
    );
}
