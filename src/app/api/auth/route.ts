/**
 * 认证 API
 * 只负责网关认证，不获取设备
 */

import {NextRequest, NextResponse} from 'next/server';
import {connectGateway} from '@/server/gateway/shared';

export const runtime = 'nodejs';

/**
 * POST /api/auth
 * 登录并建立网关连接
 */
export async function POST(request: NextRequest) {
    try {
        const {passcode, gatewayUrl} = await request.json();

        if (!passcode || passcode.length !== 6) {
            return NextResponse.json({
                success: false,
                error: '登录码格式错误',
                message: '请提供6位数字登录码',
            }, {status: 400});
        }

        // 登录并建立 WebSocket 连接
        await connectGateway(passcode, gatewayUrl);

        return NextResponse.json({
            success: true,
            message: '成功连接到网关',
        });
    } catch (error) {
        console.error('认证失败:', error);
        return NextResponse.json({
            success: false,
            error: '认证失败',
            message: error instanceof Error ? error.message : '未知错误',
        }, {status: 500});
    }
}
