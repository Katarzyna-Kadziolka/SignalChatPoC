import {Component, ElementRef, inject, Input, NgZone, OnInit, signal, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RealtimeClient} from '../../features/messages/realtimeClient/realtime-client';
import {MessageRequest} from '../../features/messages/message-request';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit{
  @Input() message: string = "";
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  public receivedMessages = signal<string[]>([]);
  public sendMessages = signal<MessageRequest[]>([]);

  private ngZone = inject(NgZone);
  private realtimeClient = inject(RealtimeClient)
  ngOnInit(): void {
    this.realtimeClient.newMessageSent.subscribe(message => {
      this.ngZone.run(() => {
        this.receivedMessages.update(messages => [...messages, message.content]);
      });
    });
  }

  protected async sendMessage() {
    let newMessage : MessageRequest = {
      sentAt: new Date(),
      content: this.message,
    }
    await this.realtimeClient.send(newMessage)
    this.sendMessages.update(messages => [...messages, newMessage.content]);

    this.message = '';
    this.messageInput.nativeElement.blur();
    this.messageInput.nativeElement.focus();
  }
}
