import {Component, inject, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RealtimeClient} from '../../features/messages/realtimeClient/realtime-client';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit{
  private realtimeClient = inject(RealtimeClient)
  @Input() message: string = "";
  ngOnInit(): void {
    this.realtimeClient.newMessageSent.subscribe(message => {
      console.log('New message received:', message);
    });
  }

  protected async sendMessage() {
    console.log("send message");

    await this.realtimeClient.send({
      sentAt: new Date(),
      content: this.message,
    })
  }
}
