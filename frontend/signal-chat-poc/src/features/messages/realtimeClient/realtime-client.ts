import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Message} from '../../../domain/entities/message';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {MessageRequest} from '../message-request';

@Injectable({
  providedIn: 'root',
})
export class RealtimeClient {
  private hubConnection: HubConnection;
  private newMessageSentSubject = new Subject<Message>();
  newMessageSent: Observable<Message> = this.newMessageSentSubject.asObservable();

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
  }

  async send(message: MessageRequest) {
    console.log("send");
    await this.hubConnection.invoke('Send', message);
  }
}
