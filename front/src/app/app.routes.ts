import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'stock',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    canActivate: [authGuard] ,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'client',
        data: {
          title: $localize`Client`
        },
        loadChildren: () => import('./views/client/routes').then((m) => m.routes),
        
      },
      {
        path: 'acces',
        data: {
          title: $localize`Acces`
        },
        loadChildren: () => import('./views/acces/routes').then((m) => m.routes),
        
      },
      {
        path: 'achat',
        data: {
          title: $localize`Fournisseur`
        },
        loadChildren: () => import('./views/achat/routes').then((m) => m.routes),
        
      },
      {
        path: 'stock',
        data: {
          title: $localize`Gestion stock`
        },
        loadChildren: () => import('./views/stock/routes').then((m) => m.routes),
        
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
