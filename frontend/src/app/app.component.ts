import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <app-header></app-header>
    }
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    main {
      flex: 1;
      overflow-y: auto;
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
