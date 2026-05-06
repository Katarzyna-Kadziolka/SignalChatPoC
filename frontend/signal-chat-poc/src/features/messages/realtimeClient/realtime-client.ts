import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Message} from '../../../domain/entities/message';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {MessageRequest} from '../message-request';
import {RemoveFromGroupMessage} from '../../../domain/entities/remove-from-group-message';
import {AddToGroupMessage} from '../../../domain/entities/add-to-group-message';
import {MessageToGroupRequest} from '../groups/message-to-group-request';
import {RemoveFromGroupRequest} from '../groups/remove-from-group-request';
import {AddToGroupRequest} from '../groups/add-to-group-request';

@Injectable({
  providedIn: 'root',
})
export class RealtimeClient {
  private hubConnection: HubConnection;

  private newMessageSentSubject = new Subject<Message>();
  newMessageSent: Observable<Message> = this.newMessageSentSubject.asObservable();

  private newUserJoinedToGroupSubject = new Subject<AddToGroupMessage>();
  NewUserJoinedToGroup: Observable<AddToGroupMessage> = this.newUserJoinedToGroupSubject.asObservable();

  private newUserRemovedFromGroupSubject = new Subject<RemoveFromGroupMessage>();
  UserRemovedFromGroup: Observable<RemoveFromGroupMessage> = this.newUserRemovedFromGroupSubject.asObservable();

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

    this.hubConnection.on('NewUserJoinedToGroup', (messages: AddToGroupMessage) => {
      this.newUserJoinedToGroupSubject.next(messages);
    });

    this.hubConnection.on('UserRemovedFromGroup', (messages: RemoveFromGroupMessage) => {
      this.newUserRemovedFromGroupSubject.next(messages);
    });
  }

  async send(request: MessageRequest) {
    console.log("send");
    await this.hubConnection.invoke('Send', request);
  }

  async sendToGroup(request: MessageToGroupRequest) {
    console.log("sendToGroup");
    await this.hubConnection.invoke('SendToGroup', request);
  }

  async removeFromGroup(request: RemoveFromGroupRequest) {
    console.log("removeFromGroup");
    await this.hubConnection.invoke('RemoveFromGroup', request);
  }

  async addToGroup(request: AddToGroupRequest) {
    console.log("addToGroup");
    await this.hubConnection.invoke('AddToGroup', request);
  }
}
