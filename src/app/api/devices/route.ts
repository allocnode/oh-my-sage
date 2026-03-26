import {NextRequest, NextResponse} from 'next/server';
import {getGateway, isGatewayConnected} from '@/server/gateway/shared';

export const runtime = 'nodejs';

/**
 * GET /api/devices
 * 获取设备列表（需要先登录）
 */
export async function GET(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const roomFilter = searchParams.get('room');
        const onlineOnly = searchParams.get('online') === 'true';

        // 检查是否有可用的网关连接
        if (!isGatewayConnected()) {
            return NextResponse.json({
                success: false,
                error: '未连接到网关',
                message: '请先登录连接网关',
                devices: [],
                rooms: [],
            }, {status: 400});
        }

        const gateway = getGateway()!;
        const result = await gateway.callApi('getDevList', {}, 10000);
        const devList = result.devList || {};

        let deviceList = Object.entries(devList).map(([did, device]: [string, any]) => ({
            did,
            name: device.name,
            model: device.model,
            modelName: device.modelName,
            online: device.online,
            roomId: device.roomId,
            roomName: device.roomName || '未分组',
            icon: device.icon,
        }));

        if (onlineOnly) {
            deviceList = deviceList.filter((d: any) => d.online);
        }
        if (roomFilter) {
            deviceList = deviceList.filter((d: any) => d.roomName === roomFilter || d.roomId === roomFilter);
        }

        const rooms: Record<string, any[]> = {};
        deviceList.forEach((d: any) => {
            const roomName = d.roomName || '未分组';
            if (!rooms[roomName]) rooms[roomName] = [];
            rooms[roomName].push(d);
        });

        const stats = {
            total: deviceList.length,
            online: deviceList.filter((d: any) => d.online).length,
            offline: deviceList.filter((d: any) => !d.online).length,
            rooms: Object.keys(rooms).length,
        };

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            stats,
            devices: deviceList,
            rooms: Object.entries(rooms).map(([name, devices]) => ({
                name,
                deviceCount: devices.length,
                devices,
            })),
        });
    } catch (error) {
        console.error('设备 API 错误:', error);
        return NextResponse.json({
            success: false,
            error: '获取设备列表失败',
            message: error instanceof Error ? error.message : '未知错误',
            devices: [],
            rooms: [],
        }, {status: 500});
    }
}
