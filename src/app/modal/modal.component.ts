import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  delete() {
    this.deleteItem.emit();
  }
}
