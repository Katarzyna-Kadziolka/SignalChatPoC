import {ChatMessageType} from './chat-message-type';

export interface ChatMessage {
  content: string,
  sentAt: Date,
  type: ChatMessageType
}
