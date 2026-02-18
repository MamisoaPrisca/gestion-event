import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { filter } from 'rxjs/operators';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { LoaderComponent } from '../loader/loader.component';
import { TOP_MENUS } from '../../util/classe/topMenuItem';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
    LoaderComponent
  ]
})
export class DefaultLayoutComponent {
  public navItems = [...navItems];
  public topMenuItems=[...TOP_MENUS];
  currentMainRoute = '';

  constructor(private router: Router) {
    // 👇 On écoute les changements de route dès le constructeur
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        const firstSegment = url.split('/')[1] || '';
        this.currentMainRoute = firstSegment;
        this.updateMenuDroit(firstSegment);
      });
  }

  updateMenuDroit(module: string) {
    var menu = this.topMenuItems.find(u => u.routerLink === this.currentMainRoute);
    if(menu){
      this.navItems=menu.rightMenuItem
    }
    else{
      this.navItems=navItems
    }
  }

}
