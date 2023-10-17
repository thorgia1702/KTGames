import React, { useState } from "react";
import "../pages.css";
import Board from "./Board";
import "./tictactoe.css";
import { calculateWinner } from "../../helpers";

export default function Tic_tac_toe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);
  const handleClick = (index) => {
    const boardCopy = [...board];
    if (winner || boardCopy[index]) return;
    boardCopy[index] = xIsNext ? "X" : "O";
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  const handleResetGame = () => {
    setBoard(Array(9).fill(null));
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <div className="game-container"></div>
      <Board cells={board} onClick={handleClick}></Board>
      {winner ? `Winner is ${winner}`:''}
      <button onClick={handleResetGame}>RESET GAME</button>
    </div>
  );
}
