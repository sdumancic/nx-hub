import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hub-shared-testlib',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-testlib.component.html',
  styleUrls: ['./shared-testlib.component.scss'],
})
export class SharedTestlibComponent {}
