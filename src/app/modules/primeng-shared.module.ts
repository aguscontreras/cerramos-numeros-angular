import { NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';

const modules = [
  TabViewModule,
  ButtonModule,
  AutoCompleteModule,
  InputNumberModule,
  MessagesModule,
  ToastModule,
  DropdownModule,
  DynamicDialogModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  providers: [MessageService, DialogService, DynamicDialogRef],
})
export class PrimeNgSharedModule {}
