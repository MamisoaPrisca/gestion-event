import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Référentiels'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./referenciel.component').then(m => m.ReferencielComponent),
        data: {
          title: 'Referenciel produit'
        }
      },
    ]
  }
];