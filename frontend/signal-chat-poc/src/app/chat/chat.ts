import {Component, computed, ElementRef, inject, Input, NgZone, OnInit, signal, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RealtimeClient} from '../../features/messages/realtimeClient/realtime-client';
import {MessageRequest} from '../../features/messages/message-request';
import {ChatMessage} from './chat-message';
import {ChatMessageType} from './chat-message-type';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgClass],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit{
  @Input() message: string = "";
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  public receivedMessages = signal<ChatMessage[]>([]);
  public sendMessages = signal<ChatMessage[]>([]);
  public messages = computed(() => this.receivedMessages()
      .concat(this.sendMessages())
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
  )

  private ngZone = inject(NgZone);
  private realtimeClient = inject(RealtimeClient)
  ngOnInit(): void {
    this.realtimeClient.newMessageSent.subscribe(message => {
      let receivedMessage: ChatMessage = {
        content: message.content,
        sentAt: new Date(message.sentAt),
        type: ChatMessageType.Received
      }

      this.ngZone.run(() => {
        this.receivedMessages.update(messages => [...messages, receivedMessage]);
      });
    });
  }

  protected async sendMessage() {
    if (this.message.trim() === '') {
      return;
    }

    let newMessage : MessageRequest = {
      sentAt: new Date(),
      content: this.message,
    }
    await this.realtimeClient.send(newMessage)

    let sendMessage : ChatMessage = {
      content: newMessage.content,
      sentAt: newMessage.sentAt,
      type: ChatMessageType.Send
    }

    this.sendMessages.update(messages => [...messages, sendMessage]);

    this.message = '';
    this.messageInput.nativeElement.blur();
    this.messageInput.nativeElement.focus();
  }

  protected readonly ChatMessageType = ChatMessageType;
}
