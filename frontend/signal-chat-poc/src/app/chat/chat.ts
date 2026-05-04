import {Component, computed, ElementRef, inject, Input, NgZone, OnInit, signal, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RealtimeClient} from '../../features/messages/realtimeClient/realtime-client';
import {MessageRequest} from '../../features/messages/message-request';
import {ChatMessage} from './chat-message';
import {ChatMessageType} from './chat-message-type';
import {NgClass} from '@angular/common';
import {NewUserJoinedToGroupMessage} from '../../domain/entities/new-user-joined-to-group-message';
import {UserRemovedFromGroupMessage} from '../../domain/entities/user-removed-from-group-message';
import {MessageToGroupRequest} from '../../features/messages/message-to-group-request';
import {Group} from './group/group';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgClass, Group],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit{
  @Input() message: string = "";
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  public activeGroupMode = 'all';
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

    let sentAt = new Date()
    if (this.activeGroupMode == 'all') {
      let newMessage : MessageRequest = {
        sentAt: sentAt,
        content: this.message,
      }
      await this.realtimeClient.send(newMessage)
    }
    else {
      let newMessageToGroup : MessageToGroupRequest = {
        sentAt: sentAt,
        content: this.message,
        groupName: this.activeGroupMode,
      }
      await this.realtimeClient.sendToGroup(newMessageToGroup)
    }

    let sendMessage : ChatMessage = {
      content: this.message,
      sentAt: sentAt,
      type: ChatMessageType.Send
    }

    this.sendMessages.update(messages => [...messages, sendMessage]);

    this.message = '';
    this.messageInput.nativeElement.blur();
    this.messageInput.nativeElement.focus();
  }

  protected async onJoinedToGroup(groupName: string) {
    let newUserJoinedToGroupMessage : NewUserJoinedToGroupMessage = {
      groupName: groupName,
    }

    await this.realtimeClient.addToGroup(newUserJoinedToGroupMessage);
  }

  protected async onRemovedFromGroup(groupName: string) {
    let removedFromGroupMessage : UserRemovedFromGroupMessage = {
      groupName: groupName,
    }

    await this.realtimeClient.removeFromGroup(removedFromGroupMessage);
  }

  protected readonly ChatMessageType = ChatMessageType;
}
