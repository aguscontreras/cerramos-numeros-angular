import { NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

const modules = [
  TabViewModule,
  ButtonModule,
  AutoCompleteModule,
  InputNumberModule,
  MessagesModule,
  ToastModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  providers: [MessageService],
})
export class PrimeNgSharedModule {}
