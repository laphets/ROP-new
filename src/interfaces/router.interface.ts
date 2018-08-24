import { RouteConfig } from 'vue-router';

export interface MyRouteConfig extends RouteConfig {
    hidden?: boolean;
    children?: MyRouteConfig[];
    meta?: {
        title?: string;
        access?: string[];
        icon?: string;
        iconfont?: string;
    };
}