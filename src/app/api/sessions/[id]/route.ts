/**
 * Session 详情 API
 * 获取和更新单个 session
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionStore } from '@/server/session/store';

export const runtime = 'nodejs';

/**
 * GET /api/sessions/[id]
 * 获取 session 详情和消息历史
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const store = getSessionStore();

    const session = await store.getSessionMeta(id);
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Session 不存在',
      }, { status: 404 });
    }

    const messages = await store.getMessages(id);

    return NextResponse.json({
      success: true,
      session,
      messages,
    });
  } catch (error) {
    console.error('获取 session 详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取 session 详情失败',
      message: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
}

/**
 * PATCH /api/sessions/[id]
 * 更新 session（如修改标题）
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const text = await request.text();
    if (!text) {
      return NextResponse.json({ success: false, error: '请求体为空' }, { status: 400 });
    }
    let body: any;
    try { body = JSON.parse(text); } catch {
      return NextResponse.json({ success: false, error: '无效的 JSON' }, { status: 400 });
    }
    const { title, isActive } = body;

    const store = getSessionStore();
    const session = await store.getSessionMeta(id);

    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Session 不存在',
      }, { status: 404 });
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (isActive !== undefined) updates.isActive = isActive;

    await store.updateSessionMeta(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Session 已更新',
    });
  } catch (error) {
    console.error('更新 session 失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新 session 失败',
      message: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
}

/**
 * POST /api/sessions/[id]
 * 支持 action: truncate - 截断 session 消息到指定位置
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const text = await request.text();
    if (!text) {
      return NextResponse.json({
        success: false,
        error: '请求体为空',
      }, { status: 400 });
    }
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({
        success: false,
        error: '请求体不是有效的 JSON',
      }, { status: 400 });
    }
    const { action, seq } = body;

    if (action === 'truncate') {
      if (typeof seq !== 'number' || seq < 0) {
        return NextResponse.json({
          success: false,
          error: '缺少有效的 seq 参数',
        }, { status: 400 });
      }

      const store = getSessionStore();
      await store.truncateSession(id, seq);

      // 返回截断后的消息
      const messages = await store.getMessages(id);
      return NextResponse.json({
        success: true,
        messages,
      });
    }

    return NextResponse.json({
      success: false,
      error: `未知的 action: ${action}`,
    }, { status: 400 });
  } catch (error) {
    console.error('Session POST 操作失败:', error);
    return NextResponse.json({
      success: false,
      error: '操作失败',
      message: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/sessions/[id]
 * 删除 session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const store = getSessionStore();

    await store.deleteSession(id);

    return NextResponse.json({
      success: true,
      message: 'Session 已删除',
    });
  } catch (error) {
    console.error('删除 session 失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除 session 失败',
      message: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
}
