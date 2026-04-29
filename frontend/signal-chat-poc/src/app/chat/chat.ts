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

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgClass],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit{
  @Input() message: string = "";
  @Input() groupName: string = "";
  @Input() removeGroupName: string = "";
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('groupNameInput') groupNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('removeGroupNameInput') removeGroupNameInput!: ElementRef<HTMLInputElement>;
  public groups = signal<string[]>([]);
  public activeGroup = signal<string>('all');
  public receivedMessages = signal<ChatMessage[]>([]);
  public sendMessages = signal<ChatMessage[]>([]);
  public messages = computed(() => this.receivedMessages()
      .concat(this.sendMessages())
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
  )
  public modes = computed(() => [...this.groups(), 'all'])

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
    if (this.activeGroup() == 'all') {
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
        groupName: this.activeGroup(),
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

  protected async joinGroup() {
    if (this.groupName.trim() === '') {
      return;
    }

    let newUserJoinedToGroupMessage : NewUserJoinedToGroupMessage = {
      groupName: this.groupName,
    }

    await this.realtimeClient.addToGroup(newUserJoinedToGroupMessage);
    this.groups.update(groups => [...groups, this.groupName]);
    this.groupName = '';
    this.groupNameInput.nativeElement.blur();
    this.groupNameInput.nativeElement.focus();
  }

  protected async removeFromGroup() {
    if (this.removeGroupName.trim() === '') {
      return;
    }

    let removedFromGroupMessage : UserRemovedFromGroupMessage = {
      groupName: this.removeGroupName,
    }

    await this.realtimeClient.removeFromGroup(removedFromGroupMessage);
    this.groups.update(groups => groups.filter(group => group !== this.removeGroupName));
    this.removeGroupName = '';
    this.removeGroupNameInput.nativeElement.blur();
    this.removeGroupNameInput.nativeElement.focus();
  }

  protected readonly ChatMessageType = ChatMessageType;
}
