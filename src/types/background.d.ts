export interface BackgroundConfig {
    useOnlineImage: boolean,
    onlineImageConfig: {
        url: string,
        imageUrl: string,
        mode: string,
        lastFetchTime: number,
    },
    localImageConfig: {
        imageUrl: string
    }
}
