/**
 * 规则 API 路由
 * 从网关获取米家自动化规则 (Graph)
 */

import {NextRequest, NextResponse} from 'next/server';
import {getGateway, isGatewayConnected} from '@/server/gateway/shared';

export const runtime = 'nodejs';

/**
 * GET 请求处理
 * 从网关获取规则列表
 */
export async function GET() {
    try {
        // 检查网关连接
        if (!isGatewayConnected()) {
            return NextResponse.json({
                success: false,
                error: '未连接到网关',
                message: '请先登录连接网关',
                graphs: [],
            }, {status: 400});
        }

        const gateway = getGateway()!;

        // 获取规则列表
        const result = await gateway.callApi('getGraphList', {}, 10000);

        // 根据实际返回的数据结构，getGraphList 返回数组
        // 每个元素包含: id, userData.name, userData.lastUpdateTime, enable, uiType
        const graphList = Array.isArray(result) ? result : [];

        // 转换为摘要格式
        const graphSummaries = graphList.map((graph: any) => ({
            id: graph.id,
            name: graph.userData?.name || '未命名规则',
            enable: graph.enable !== false,  // 注意是 enable 不是 enabled
            lastUpdateTime: graph.userData?.lastUpdateTime,
        }));

        return NextResponse.json({
            success: true,
            count: graphSummaries.length,
            graphs: graphSummaries,
        });
    } catch (error) {
        console.error('获取规则列表错误:', error);

        return NextResponse.json({
            success: false,
            error: '获取规则列表失败',
            message: error instanceof Error ? error.message : '未知错误',
            graphs: [],
        }, {status: 500});
    }
}

/**
 * PATCH 请求处理
 * 启用/禁用规则
 */
export async function PATCH(request: NextRequest) {
    try {
        // 检查网关连接
        if (!isGatewayConnected()) {
            return NextResponse.json({
                success: false,
                error: '未连接到网关',
            }, {status: 400});
        }

        const body = await request.json();
        const {id, enable} = body;

        if (!id) {
            return NextResponse.json({
                success: false,
                error: '缺少规则 ID',
            }, {status: 400});
        }

        if (typeof enable !== 'boolean') {
            return NextResponse.json({
                success: false,
                error: 'enable 参数必须为布尔值',
            }, {status: 400});
        }

        const gateway = getGateway()!;

        // 先从 getGraphList 获取规则信息
        const graphList = await gateway.callApi('getGraphList', {}, 10000);

        const graphInfo = Array.isArray(graphList)
            ? graphList.find((g: any) => g.id === id)
            : null;

        if (!graphInfo) {
            return NextResponse.json({
                success: false,
                error: '规则不存在',
            }, {status: 404});
        }

        // 构建完整的 changeGraphConfig 参数
        // 保留原有的 userData（name, transform, lastUpdateTime）
        const changeConfigParams = {
            id,
            enable,
            userData: {
                name: graphInfo.userData?.name || '未命名规则',
                lastUpdateTime: Date.now(),
                transform: graphInfo.userData?.transform || {x: 0, y: 0, scale: 1, rotate: 0},
            },
        };

        await gateway.callApi('changeGraphConfig', changeConfigParams, 10000);

        return NextResponse.json({
            success: true,
            message: enable ? '规则已启用' : '规则已禁用',
        });
    } catch (error) {
        console.error('修改规则状态错误:', error);

        return NextResponse.json({
            success: false,
            error: '修改规则状态失败',
            message: error instanceof Error ? error.message : '未知错误',
        }, {status: 500});
    }
}

/**
 * DELETE 请求处理
 * 删除规则
 */
export async function DELETE(request: NextRequest) {
    try {
        // 检查网关连接
        if (!isGatewayConnected()) {
            return NextResponse.json({
                success: false,
                error: '未连接到网关',
            }, {status: 400});
        }

        const {searchParams} = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                error: '缺少规则 ID',
            }, {status: 400});
        }

        const gateway = getGateway()!;

        // 调用网关 API 删除规则
        await gateway.callApi('deleteGraph', {id}, 10000);

        return NextResponse.json({
            success: true,
            message: '规则已删除',
        });
    } catch (error) {
        console.error('删除规则错误:', error);

        return NextResponse.json({
            success: false,
            error: '删除规则失败',
            message: error instanceof Error ? error.message : '未知错误',
        }, {status: 500});
    }
}
