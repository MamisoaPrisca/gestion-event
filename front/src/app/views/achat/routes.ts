import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Achat'
    },
    children: [
      {
        path: '',
        redirectTo: 'commande',
        pathMatch: 'full'
      },
      {
        path: 'fournisseur',
        loadChildren: () => import('./fournisseur/routes').then((m) => m.routes)

      },
      {
        path: 'commande',
        loadChildren: () => import('./commande/routes').then((m) => m.routes)

      },
    ]
  }
];



// import { Routes } from '@angular/router';

// export const routes: Routes = [
//     {
//         path: 'utilisateur',
//         data: {
//           title: $localize`Utilisateur`
//         },
//         children: [
//             {
//                 path: '',
//                 redirectTo: 'liste',
//                 pathMatch: 'full',
//             },
//             {
//                 path: 'liste',
//                 loadComponent: () => import('./utilisateur/liste/liste.component').then(m => m.ListeComponent),
//                 data: {
//                   title: $localize`Tous les utilisateurs`
//                 }
//             },
            
//             {
//                 path: 'saisie',
//                 loadComponent: () => import('./utilisateur/saisie/saisie.component').then(m => m.SaisieComponent),
//                 data: {
//                   itle: $localize`Ajouter un utilisateur`
//                 }
//             }
//         ]
//     }
// ]