// 封装 localStorage 的读写操作

export default {

    setItem<T = any>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getItem<T = any>(key: string): T | undefined {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return undefined;
            return JSON.parse(item) as T;
        } catch (e) {
            console.error('localStorage get error:', e);
            return undefined;
        }
    },

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}