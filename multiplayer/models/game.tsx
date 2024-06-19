import { ChatMessage, Message } from "./message";

export enum GameStatus {
  Created = "Created",
  Waiting = "Waiting",
  Started = "Started",
  Ended = "Ended",
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
