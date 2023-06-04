import { NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';

const modules = [
  TabViewModule,
  ButtonModule,
  AutoCompleteModule,
  InputNumberModule,
  MessagesModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class PrimeNgSharedModule {}
