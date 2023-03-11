import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialModules } from "../material";

@Component({
  selector: 'shared-ui-sideboard',
  standalone: true,
  imports: [CommonModule,materialModules],
  templateUrl: './shared-ui-sideboard.component.html',
  styleUrls: ['./shared-ui-sideboard.component.scss'],
})
export class SharedUiSideboardComponent {}
