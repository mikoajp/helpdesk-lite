import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { ColorTokens, SpacingTokens, ShadowTokens } from '../design-tokens';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="goHome()">
        <mat-icon>confirmation_number</mat-icon>
      </button>
      <span class="app-name">{{ authService.isAuthenticated() ? 'Helpdesk Lite' : '' }}</span>
      <span class="spacer"></span>
      
      @if (authService.isAuthenticated()) {
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          <span>{{ authService.currentUser()?.name }}</span>
        </button>
        <mat-menu #userMenu="matMenu">
          <div class="user-info">
            <p><strong>{{ authService.currentUser()?.name }}</strong></p>
            <p class="email">{{ authService.currentUser()?.email }}</p>
            <p class="role">Role: {{ authService.currentUser()?.role?.name }}</p>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      }
    </mat-toolbar>
  `,
  styles: [`
    :host ::ng-deep mat-toolbar {
      background: ${ColorTokens.primary.main} !important;
      color: white !important;
      box-shadow: ${ShadowTokens.md};
      padding: 0 ${SpacingTokens[6]};
      height: 64px;
    }
    
    .app-name {
      font-size: 20px;
      font-weight: 600;
      margin-left: ${SpacingTokens[3]};
      letter-spacing: -0.025em;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-info {
      padding: ${SpacingTokens[4]};
      min-width: 200px;
      
      p {
        margin: ${SpacingTokens[1]} 0;
      }
      
      strong {
        color: ${ColorTokens.text.primary};
        font-size: 14px;
      }
      
      .email {
        font-size: 12px;
        color: ${ColorTokens.text.tertiary};
      }
      
      .role {
        font-size: 12px;
        color: ${ColorTokens.text.secondary};
        text-transform: capitalize;
        font-weight: 500;
      }
    }
    
    :host ::ng-deep .mat-mdc-menu-panel {
      border-radius: ${SpacingTokens[2]};
      box-shadow: ${ShadowTokens.lg};
    }
  `]
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  goHome(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tickets']);
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Clear local storage even if API call fails
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
