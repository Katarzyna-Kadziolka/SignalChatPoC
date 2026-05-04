import {Component, computed, inject, NgZone, OnInit, signal} from '@angular/core';
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
import {Message} from './message/message';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgClass, Group, Message],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit{
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

  protected async sendMessage(message: ChatMessage) {
    if (this.activeGroupMode == 'all') {
      let newMessage : MessageRequest = {
        sentAt: message.sentAt,
        content: message.content,
      }
      await this.realtimeClient.send(newMessage)
    }
    else {
      let newMessageToGroup : MessageToGroupRequest = {
        sentAt: message.sentAt,
        content: message.content,
        groupName: this.activeGroupMode,
      }
      await this.realtimeClient.sendToGroup(newMessageToGroup)
    }

    this.sendMessages.update(messages => [...messages, message]);
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
