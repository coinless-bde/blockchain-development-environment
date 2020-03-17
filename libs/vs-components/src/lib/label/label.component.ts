import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component({
  selector: 'bde-label',
  template: `
      <ng-content></ng-content>
  `,
  styleUrls: ['./label.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelComponent {}
