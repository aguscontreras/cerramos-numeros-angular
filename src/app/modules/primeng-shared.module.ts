import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { InplaceModule } from 'primeng/inplace';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

const initializeAppFactory = (primeConfig: PrimeNGConfig) => () => {
  primeConfig.ripple = true;
};

const modules = [
  TabViewModule,
  ButtonModule,
  InputTextModule,
  AutoCompleteModule,
  InputNumberModule,
  MessagesModule,
  ToastModule,
  DropdownModule,
  DynamicDialogModule,
  RippleModule,
  InplaceModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  providers: [
    MessageService,
    DialogService,
    DynamicDialogRef,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [PrimeNGConfig],
      multi: true,
    },
  ],
})
export class PrimeNgSharedModule {}
