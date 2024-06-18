export enum MessageType {
  GameAction = "GameAction",
  GameStatus = "GameStatus",
  Chat = "Chat",
}

export enum ActionType {
  X = "X",
  O = "O",
}

export enum ChatType {
  User = "User",
  Admin = "Admin",
}

export interface BaseMessage {
  type: keyof typeof MessageType;
}

export interface GameActionMessage extends BaseMessage {
  type: MessageType.GameAction;
  payload: {
    userId: string;
    timestamp: number;
    location: string;
    type: keyof typeof ActionType;
  };
}

interface BaseChatPayload {
  type: keyof typeof ChatType;
  timestamp: number;
  message: string;
}

interface AdminChatPayload extends BaseChatPayload {
  type: "Admin";
}

interface UserChatPayload extends BaseChatPayload {
  type: "User";
  userId: string;
}

type ChatPayload = AdminChatPayload | UserChatPayload;

export interface ChatMessage extends BaseMessage {
  type: MessageType.Chat;
  payload: ChatPayload;
}

export type Message = GameActionMessage | ChatMessage;
