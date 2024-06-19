import { GameStatus } from "./game"

export enum MessageType {
  GameAction = "GameAction",
  GameStatus = "GameStatus",
  User = "User",
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
  type: keyof typeof MessageType
}

export interface GameActionMessage extends BaseMessage {
  type: "GameAction"
  payload: {
    userId: string
    timestamp: number
    location: number
    type: keyof typeof ActionType
  }
}

export interface GameStatusMessage extends BaseMessage {
  type: "GameStatus"
  payload: {
    status: keyof typeof GameStatus
    timestamp: number
    message: string
  }
}

export interface UserMessage extends BaseMessage {
  type: "User"
  payload: {
    timestamp: number
    message: string
    userId: string
  }
}

export type ChatMessage = UserMessage | GameStatusMessage

export type Message = GameActionMessage | UserMessage | GameStatusMessage
