import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'hub-orders-overview-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './orders-overview-header.component.html',
  styleUrls: ['./orders-overview-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersOverviewHeaderComponent {
  @Output() actionsClick = new EventEmitter<void>()
  @Output() createNewOrderClick = new EventEmitter<void>()

  createNewOrder (): void {
    this.createNewOrderClick.next()
  }
}
