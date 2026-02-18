import { INavData } from '@coreui/angular';
import { navItemsAcces,navItemsAchat,navItemsClient,navItemsStock } from './rightMenuItem';

export class TopMenuItem  {
    routerLink!: string ;
    label!: string;
    routerLinkActivate: boolean= false;
    rightMenuItem: INavData[]=[];
}

export const TOP_MENUS: TopMenuItem[] = [
    {
        routerLink:"client",
        label:"Client",
        routerLinkActivate:true,
        rightMenuItem:navItemsClient
    },

]