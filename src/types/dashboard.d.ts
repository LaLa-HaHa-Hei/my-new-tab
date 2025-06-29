export interface DashboardConfig {
    width: number;
    items: DashboardItem[];
}

export interface DashboardItem {
    id: string;
    component: string;
    x: number;
    y: number;
    w: number;
    h: number;
    props: any;
}

export interface BookmarkItemProps {
    title: string;
    url: string;
    icon: string;
}