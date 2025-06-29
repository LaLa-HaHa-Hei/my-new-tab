export interface SearchBoxConfig {
    id: string,
    isUsed: boolean,
    placeholder?: string,
    icon: string, // 图片URL
    searchUrl: string
}

export interface SearchBoxContainerConfig {
    columns: number,
    items: SearchBoxConfig[],
}