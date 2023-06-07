import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HomeComponent } from './pages/home/home.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { PrimeNgSharedModule } from './modules/primeng-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './modules/shared/shared.module';
import { ErrorComponent } from './pages/error/error.component';
import { MessageCardComponent } from './components/message-card/message-card.component';
import { StatePreviewComponent } from './components/state-preview/state-preview.component';
import { NavComponent } from './components/nav/nav.component';
import { DetailsComponent } from './components/details/details.component';
import { DetailCardComponent } from './components/detail-card/detail-card.component';
import { ExpenseEditComponent } from './components/expense-edit/expense-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddMemberComponent,
    ErrorComponent,
    MessageCardComponent,
    StatePreviewComponent,
    NavComponent,
    DetailsComponent,
    DetailCardComponent,
    ExpenseEditComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ReactiveFormsModule,
    PrimeNgSharedModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
