import { Component, Input } from '@angular/core';
import { Severities } from '../../models';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss'],
})
export class MessageCardComponent {
  @Input() severity: keyof typeof Severities = 'error';

  @Input() title?: string;

  @Input() message?: string;

  getIcon(): string {
    switch (this.severity) {
      case Severities.info:
        return 'pi-info-circle';

      case Severities.success:
        return 'pi-check-circle';

      case Severities.warning:
        return 'pi-exclamation-circle';

      case Severities.error:
        return 'pi-times-circle';

      default:
        return 'pi-info-circle';
    }
  }

  getDefaultTitle(): string {
    switch (this.severity) {
      case Severities.info:
        return 'Información';

      case Severities.success:
        return 'Éxito';

      case Severities.warning:
        return 'Atención';

      case Severities.error:
        return 'Error';

      default:
        return 'Información';
    }
  }
}
