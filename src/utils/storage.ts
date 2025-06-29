// 封装 localStorage 的读写操作

const STORAGE_PREFIX = 'mnt_' // My New Tab 前缀

function withPrefix(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
}

export default {
    setItem<T = any>(key: string, value: T): void {
        localStorage.setItem(withPrefix(key), JSON.stringify(value));
    },

    getItem<T = any>(key: string): T | undefined {
        try {
            const item = localStorage.getItem(withPrefix(key));
            if (item === null) return undefined;
            return JSON.parse(item) as T;
        } catch (e) {
            console.error('localStorage get error:', e);
            return undefined;
        }
    },

    removeItem(key: string): void {
        localStorage.removeItem(withPrefix(key));
    }
}