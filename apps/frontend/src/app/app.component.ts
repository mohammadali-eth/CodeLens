import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './core/components/sidebar.component';
import { TopHeaderComponent } from './core/components/top-header.component';
import { PublicHeaderComponent } from './core/components/public-header.component';
import { PublicFooterComponent } from './core/components/public-footer.component';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    TopHeaderComponent,
    PublicHeaderComponent,
    PublicFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public isAuthPage = signal<boolean>(false);
  public isPublicPage = signal<boolean>(true);

  private readonly authRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ];

  private readonly publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/pricing',
    '/features',
    '/security',
    '/privacy',
    '/terms',
  ];

  constructor(
    private router: Router,
    public authService: AuthService,
    public themeService: ThemeService
  ) {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects.split('?')[0];

        const isAuth = this.authRoutes.some((path) => url === path || url.startsWith(path + '/'));
        const isPublic = this.publicRoutes.some((path) => path === '/' ? url === '/' : url === path || url.startsWith(path + '/'));

        this.isAuthPage.set(isAuth);
        this.isPublicPage.set(isPublic && !isAuth);
      });
  }
}
