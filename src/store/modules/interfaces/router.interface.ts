/*
 * @Author: Laphets
 * @Date: 2018-07-13 14:04:59
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-08-24 11:01:33
 */

import { MyRouteConfig } from '@/interfaces/router.interface';

export interface RouterState {
    routers: MyRouteConfig[],
    generatedRouters: MyRouteConfig[]
}
