import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Message} from '../../../domain/entities/message';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {MessageRequest} from '../message-request';
import {UserRemovedFromGroupMessage} from '../../../domain/entities/user-removed-from-group-message';
import {NewUserJoinedToGroupMessage} from '../../../domain/entities/new-user-joined-to-group-message';
import {MessageToGroupRequest} from '../message-to-group-request';
import {RemoveFromGroupRequest} from '../remove-from-group-request';
import {AddToGroupRequest} from '../add-to-group-request';

@Injectable({
  providedIn: 'root',
})
export class RealtimeClient {
  private hubConnection: HubConnection;

  private newMessageSentSubject = new Subject<Message>();
  newMessageSent: Observable<Message> = this.newMessageSentSubject.asObservable();

  private newUserJoinedToGroupSubject = new Subject<NewUserJoinedToGroupMessage>();
  NewUserJoinedToGroup: Observable<NewUserJoinedToGroupMessage> = this.newUserJoinedToGroupSubject.asObservable();

  private newUserRemovedFromGroupSubject = new Subject<UserRemovedFromGroupMessage>();
  UserRemovedFromGroup: Observable<UserRemovedFromGroupMessage> = this.newUserRemovedFromGroupSubject.asObservable();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/messagehub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connected to SignalR hub'))
      .catch(err => console.error('Error connecting to SignalR hub:', err));

    this.hubConnection.on('NewMessageSent', (messages: Message) => {
      this.newMessageSentSubject.next(messages);
    });

    this.hubConnection.on('NewUserJoinedToGroup', (messages: NewUserJoinedToGroupMessage) => {
      this.newUserJoinedToGroupSubject.next(messages);
    });

    this.hubConnection.on('UserRemovedFromGroup', (messages: UserRemovedFromGroupMessage) => {
      this.newUserRemovedFromGroupSubject.next(messages);
    });
  }

  async send(message: MessageRequest) {
    console.log("send");
    await this.hubConnection.invoke('Send', message);
  }

  async sendToGroup(message: MessageToGroupRequest) {
    console.log("sendToGroup");
    await this.hubConnection.invoke('SendToGroup', message);
  }

  async removeFromGroup(request: RemoveFromGroupRequest) {
    console.log("removeFromGroup");
    await this.hubConnection.invoke('RemoveFromGroup', request);
  }

  async addToGroup(groupName: AddToGroupRequest) {
    console.log("addToGroup");
    await this.hubConnection.invoke('AddToGroup', groupName);
  }
}
