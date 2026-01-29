import { INavData } from '@coreui/angular';
import { navItemsAcces,navItemsAchat,navItemsStock } from './rightMenuItem';

export class TopMenuItem  {
    routerLink!: string ;
    label!: string;
    routerLinkActivate: boolean= false;
    rightMenuItem: INavData[]=[];
}

export const TOP_MENUS: TopMenuItem[] = [
    {
        routerLink:"stock",
        label:"Gestion stock",
        routerLinkActivate:true,
        rightMenuItem:navItemsStock
    },
    {
        routerLink:"acces",
        label:"Accès",
        routerLinkActivate:false,
        rightMenuItem:navItemsAcces
    },
    {
        routerLink:"achat",
        label:"Achat",
        routerLinkActivate:false,
        rightMenuItem:navItemsAchat
    }
]