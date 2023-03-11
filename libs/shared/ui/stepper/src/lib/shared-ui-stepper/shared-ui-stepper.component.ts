import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialModules } from "../material";

@Component({
  selector: 'hub-shared-ui-stepper',
  standalone: true,
  imports: [CommonModule, materialModules],
  templateUrl: './shared-ui-stepper.component.html',
  styleUrls: ['./shared-ui-stepper.component.scss'],
})
export class SharedUiStepperComponent {}
