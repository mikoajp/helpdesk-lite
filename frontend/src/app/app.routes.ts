import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/components/login.component';
import { TicketListComponent } from './features/tickets/components/ticket-list.component';
import { TicketDetailComponent } from './features/tickets/components/ticket-detail.component';
import { TicketFormComponent } from './features/tickets/components/ticket-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tickets', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'tickets', 
    canActivate: [authGuard],
    children: [
      { path: '', component: TicketListComponent },
      { path: 'new', component: TicketFormComponent },
      { path: ':id', component: TicketDetailComponent },
      { path: ':id/edit', component: TicketFormComponent }
    ]
  },
  { path: '**', redirectTo: '/tickets' }
];
