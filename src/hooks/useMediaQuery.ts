'use client';

import {useEffect, useState} from 'react';

/**
 * 订阅媒体查询，SSR 首帧返回 false，挂载后由 effect 校正（移动端可能有一帧桌面布局闪现，可接受）。
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(query);
        setMatches(mql.matches);
        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 767px)');
}
