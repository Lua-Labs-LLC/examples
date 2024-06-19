"use client"

import { GameActionMessage } from "@/models/message"
import { markSpot } from "@/server-actions/games/mark-spot"
import React, { useContext, useEffect, useState } from "react"
import { GameContext } from "../../game-provider"

// Define a type for the board cells, which can be 'X', 'O', or null
type Cell = "X" | "O" | null

// Define the component as a functional React component
export const TicTacToe: React.FC = () => {
  const { game } = useContext(GameContext)
  // Define state for the board, turn indicator, and winner using the Cell type
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState<boolean>(true)
  const [winner, setWinner] = useState<string | null>(null)

  // Helper function to determine the winner
  const calculateWinner = (squares: Cell[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a]
      }
    }
    return null
  }

  const initializeBoard = (gameHistory: GameActionMessage[]) => {
    const newBoard = Array(9).fill(null)
    let xNext = true
    gameHistory.forEach((action) => {
      newBoard[action.payload.location] = xNext ? "X" : "O"
      xNext = !xNext
    })
    setBoard(newBoard)
    setIsXNext(xNext)
  }

  useEffect(() => {
    initializeBoard(game.gameHistory)
  }, [game])

  // Effect to check for a winner after every move
  useEffect(() => {
    const currentWinner = calculateWinner(board)
    if (currentWinner) {
      setWinner(currentWinner)
    } else if (board.every((cell) => cell !== null)) {
      setWinner("Tie")
    }
  }, [board, game])

  // Handle cell click
  const handleClick = async (index: number) => {
    if (board[index] !== null || winner) {
      return // Ignore the click if the cell is already filled or the game is over
    }

    const newBoard = [...board]
    const player = isXNext ? "X" : "O"
    newBoard[index] = player
    setBoard(newBoard)
    setIsXNext(!isXNext) // Switch turns

    // Call to save the move
    try {
      await markSpot(game.gameId, { index, player })
    } catch (error) {
      console.error("Failed to save move:", error)
    }
  }

  // Reset game
  const resetGame = (): void => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {board.map((cell, index) => (
          <div
            key={index}
            style={{
              width: "100px",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid black",
            }}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div>
          {winner === "Tie" ? "Game is a Tie!" : `Winner is: ${winner}`}
          <button onClick={resetGame}>Restart Game</button>
        </div>
      )}
    </div>
  )
}
