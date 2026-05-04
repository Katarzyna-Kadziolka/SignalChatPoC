import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChatMessage} from '../chat-message';
import {ChatMessageType} from '../chat-message-type';

@Component({
  selector: 'app-message',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class Message {
  @Input() message: string = "";
  @Output() messageSent = new EventEmitter<ChatMessage>();
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  protected async sendMessage() {
    if (this.message.trim() === '') {
      return;
    }

    let sendMessage : ChatMessage = {
      content: this.message,
      sentAt: new Date(),
      type: ChatMessageType.Send
    }

    this.messageSent.emit(sendMessage);

    this.message = '';
    this.messageInput.nativeElement.blur();
    this.messageInput.nativeElement.focus();
  }
}
