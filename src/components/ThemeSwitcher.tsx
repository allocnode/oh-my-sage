'use client';

import React from 'react';
import {Button, Dropdown} from 'antd';
import {SunOutlined, MoonOutlined, DesktopOutlined, CheckOutlined} from '@ant-design/icons';
import {useTheme, ThemeMode} from '@/components/ThemeProvider';

const themeItems = [
    {key: 'light', icon: <SunOutlined/>, label: '浅色'},
    {key: 'dark', icon: <MoonOutlined/>, label: '深色'},
    {key: 'system', icon: <DesktopOutlined/>, label: '跟随系统'},
];

export default function ThemeSwitcher() {
    const {theme, setTheme} = useTheme();
    const currentIcon = theme === 'light' ? <SunOutlined/> : theme === 'dark' ? <MoonOutlined/> : <DesktopOutlined/>;

    return (
        <Dropdown
            placement="bottomRight"
            menu={{
                selectable: true,
                selectedKeys: [theme],
                onClick: ({key}) => setTheme(key as ThemeMode),
                items: themeItems.map(item => ({
                    ...item,
                    label: (
                        <span>
                            {item.label}
                            {theme === item.key && <CheckOutlined style={{marginLeft: 8, color: '#6366f1', fontSize: 12}}/>}
                        </span>
                    ),
                })),
            }}
        >
            <Button
                type="text"
                size="small"
                style={{color: 'var(--text-secondary)'}}
                icon={currentIcon}
            />
        </Dropdown>
    );
}
