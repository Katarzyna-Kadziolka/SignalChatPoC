import {Component, computed, inject, NgZone, OnInit, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RealtimeClient} from '../../features/messages/realtimeClient/realtime-client';
import {MessageRequest} from '../../features/messages/message-request';
import {ChatMessage} from './chat-message';
import {ChatMessageType} from './chat-message-type';
import {NgClass} from '@angular/common';
import {AddToGroupMessage} from '../../domain/entities/add-to-group-message';
import {RemoveFromGroupMessage} from '../../domain/entities/remove-from-group-message';
import {MessageToGroupRequest} from '../../features/messages/groups/message-to-group-request';
import {Group} from './group/group';
import {Message} from './message/message';
import {AddToGroupRequest} from '../../features/messages/groups/add-to-group-request';
import {RemoveFromGroupRequest} from '../../features/messages/groups/remove-from-group-request';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgClass, Group, Message],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit{
  public activeGroupMode = 'all';
  public receivedMessages = signal<ChatMessage[]>([]);
  public sentMessages = signal<ChatMessage[]>([]);
  public messages = computed(() => this.receivedMessages()
      .concat(this.sentMessages())
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
  )

  private ngZone = inject(NgZone);
  private realtimeClient = inject(RealtimeClient)
  ngOnInit(): void {
    this.realtimeClient.newMessageSent.subscribe(message => {
      let receivedMessage: ChatMessage = {
        content: message.content,
        sentAt: message.sentAt,
        type: ChatMessageType.Received
      }

      this.ngZone.run(() => {
        this.receivedMessages.update(messages => [...messages, receivedMessage]);
      });
    });
  }

  protected async onSendMessage(message: ChatMessage) {
    if (this.activeGroupMode == 'all') {
      let request : MessageRequest = {
        sentAt: message.sentAt,
        content: message.content,
      }
      await this.realtimeClient.send(request)
    }
    else {
      let groupRequest : MessageToGroupRequest = {
        sentAt: message.sentAt,
        content: message.content,
        groupName: this.activeGroupMode,
      }
      await this.realtimeClient.sendToGroup(groupRequest)
    }

    this.sentMessages.update(messages => [...messages, message]);
  }

  protected async onAddToGroup(message: AddToGroupMessage) {
    let addToGroupRequest : AddToGroupRequest = {
      groupName: message.groupName,
    }

    await this.realtimeClient.addToGroup(addToGroupRequest);
  }

  protected async onRemoveFromGroup(message: RemoveFromGroupMessage) {
    let removeFromGroupRequest : RemoveFromGroupRequest = {
      groupName: message.groupName,
    }

    await this.realtimeClient.removeFromGroup(removeFromGroupRequest);
  }

  protected readonly ChatMessageType = ChatMessageType;
}
