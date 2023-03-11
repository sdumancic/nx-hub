import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';
import { CdkStepper } from "@angular/cdk/stepper";
import { materialModules } from "../material";


@Component({
  selector: 'shared-ui-stepper-sideboard',
  standalone: true,
  imports: [CommonModule,materialModules],
  templateUrl: './stepper-sideboard.component.html',
  styleUrls: ['./stepper-sideboard.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: StepperSideboardComponent }]
})
export class StepperSideboardComponent extends CdkStepper {
  @Input() title: string | undefined

  selectStepByIndex (index: number): void {
    this.selectedIndex = index
  }
}
