import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChatMessage} from '../chat-message';
import {ChatMessageType} from '../chat-message-type';
import {BaseInput} from '../../base/base-input/base-input';

@Component({
  selector: 'app-message',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BaseInput
  ],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class Message {
  @Output() messageSent = new EventEmitter<ChatMessage>();

  protected async sendMessage(message: string) {
    let sendMessage : ChatMessage = {
      content: message,
      sentAt: new Date(),
      type: ChatMessageType.Sent
    }

    this.messageSent.emit(sendMessage);
  }
}
