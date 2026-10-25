import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.css'
})
export class ConfirmationPopupComponent {

  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Input() confirmText: string = 'Yes';
  @Input() cancelText: string = 'No';
  @Output() confirmed = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  onCancel(): void{
    this.confirmed.emit(false);
  }

  onConfirm(): void{
    this.confirmed.emit(true);
  }

}
