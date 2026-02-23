import {Message} from './message';

export interface User {
  id: string;
  name: string;
  messages: Message[];
}
