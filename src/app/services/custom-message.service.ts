import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class CustomMessageService {
  constructor(private messageService: MessageService) {}

  showSuccess(summary: string, detail?: string) {
    this.messageService.clear();
    return this.messageService.add({
      summary,
      detail,
      severity: 'success',
      icon: 'pi pi-check-circle',
    });
  }

  showError(summary: string, detail?: string) {
    this.messageService.clear();
    return this.messageService.add({
      summary,
      detail,
      severity: 'error',
      icon: 'pi pi-times-circle',
    });
  }
}
