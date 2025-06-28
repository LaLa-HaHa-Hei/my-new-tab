export interface BackgroundConfig {
    useOnlineImage: boolean,
    onlineImageConfig: {
        url: string,
        imageUrl: string,
        mode: string,
        lastFetchTime: number,
        corsShKey: ''
    },
    localImageConfig: {
        imageUrl: string
    }
}
