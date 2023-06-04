import { NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';

const modules = [
  TabViewModule,
  ButtonModule,
  AutoCompleteModule,
  InputNumberModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class PrimeNgSharedModule {}
