import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Rôle'
    },
    children: [
      {
        path: '',
        redirectTo: 'liste',
        pathMatch: 'full'
      },
      {
        path: 'liste',
        loadComponent: () => import('./liste/liste.component').then(m => m.ListeComponent),
        data: {
          title: 'Tout les rôles'
        }
      },
      {
        path: 'saisie',
        loadComponent: () => import('./saisie/saisie.component').then(m => m.SaisieComponent),
        data: {
          title: 'Ajouter un rôle'
        }
      },
      {
        path: 'fiche/:id',
        loadComponent: () => import('./fiche/fiche.component').then(m => m.FicheComponent),
        data: {
          title: 'Fiche rôle'
        }
      },
      {
        path: 'modif/:id',
        loadComponent: () => import('./modif/modif.component').then(m => m.ModifComponent),
        data: {
          title: 'Modification d’un rôle'
        }
      },
    ]
  }
];