import {User} from './user';

export interface Message {
  id: string;
  content: string;
  sentAt: Date;

  senderId: string;
  sender: User;
}
