import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-base-input',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './base-input.html',
  styleUrl: './base-input.scss',
})
export class BaseInput {
  @Input() placeholder: string = "";
  @Output() enterClicked = new EventEmitter<string>();
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  inputValue: string = "";

  onEnter() {
    if (this.inputValue.trim() === '') {
      return;
    }

    this.enterClicked.emit(this.inputValue);

    this.inputValue = '';
    this.messageInput.nativeElement.blur();
    this.messageInput.nativeElement.focus();
  }
}
