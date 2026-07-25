/**
 * 会话 API
 * 管理会话列表
 */

import {NextRequest, NextResponse} from 'next/server';
import {getSessionStore} from '@/server/session/store';

export const runtime = 'nodejs';

/**
 * GET /api/sessions
 * 获取会话列表
 */
export async function GET() {
    try {
        const store = getSessionStore();
        const sessions = await store.listSessions();

        return NextResponse.json({
            success: true,
            sessions,
        });
    } catch (error) {
        console.error('获取会话列表失败：', error);
        return NextResponse.json({
            success: false,
            error: '获取会话列表失败',
            message: error instanceof Error ? error.message : '未知错误',
            sessions: [],
        }, {status: 500});
    }
}

/**
 * POST /api/sessions
 * 创建新会话
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const {title} = body;

        const store = getSessionStore();
        const session = await store.createSession(title);

        return NextResponse.json({
            success: true,
            session,
        });
    } catch (error) {
        console.error('创建会话失败：', error);
        return NextResponse.json({
            success: false,
            error: '创建会话失败',
            message: error instanceof Error ? error.message : '未知错误',
        }, {status: 500});
    }
}

/**
 * DELETE /api/sessions?id=xxx
 * 删除会话
 */
export async function DELETE(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                error: '缺少会话 ID',
            }, {status: 400});
        }

        const store = getSessionStore();
        await store.deleteSession(id);

        return NextResponse.json({
            success: true,
            message: '会话已删除',
        });
    } catch (error) {
        console.error('删除会话失败：', error);
        return NextResponse.json({
            success: false,
            error: '删除会话失败',
            message: error instanceof Error ? error.message : '未知错误',
        }, {status: 500});
    }
}
