import { INavData } from '@coreui/angular';


export const navItemsAchat: INavData[] = [
  {
    title: true,
    name: 'Achat'
  },
  {
    name: 'Fournisseur',
    url: '/achat/fournisseur',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Commande fournisseur',
    url: '/achat/commande',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Nouvelle commande',
    url: '/achat/commande/saisie',
    iconComponent: { name: 'cil-plus' }
  },
];

export const navItemsStock: INavData[] = [
  {
    title: true,
    name: 'Gestion stock'
  },
  {
    name: 'Produit',
    url: '/stock/produit',
    iconComponent: { name: 'cil-tags' }
  },
  {
    name: 'Entrepôt',
    url: '/stock/entrepot',
    iconComponent: { name: 'cil-tags' }
  },
  
  {
    name: 'Référentiels',
    url: '/stock/referenciel',
    iconComponent: { name: 'cil-cog' },
  },
];

export const navItemsAcces: INavData[] = [
  {
    title: true,
    name: 'Utilisateurs'
  },
  {
    name: 'Tous les utilisateurs',
    url: '/acces/utilisateur/liste',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Rôles',
    title: true
  },
  {
    name: 'Tous les rôles',
    url: '/acces/role',
    iconComponent: { name: 'cil-list' }
  },
];



export const navItemsClient: INavData[] = [
  {
    title: true,
    name: 'Client'
  },
  {
    name: 'Liste client',
    url: '/client/liste',
    iconComponent: { name: 'cil-user' }
  },
];


