import { ChatMessage, Message } from "./message";

export enum GameStatus {
  Waiting = "Wating",
  Starting = "Starting",
  Started = "Started",
}

export interface Game {
  gameId: string;
  chatHistory: ChatMessage[];
  createdAt: number;
  expiresAt: number;
  initiatorId: string;
  status: keyof typeof GameStatus;
  secondPlayerId: string;
  timeToAccept: number;
}
