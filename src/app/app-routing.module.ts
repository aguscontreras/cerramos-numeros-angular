import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';
import { CreationComponent } from './pages/creation/creation.component';
import { currentPartyGuard } from './guards/current-party.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'create',
    component: CreationComponent,
    canActivate: [currentPartyGuard],
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
