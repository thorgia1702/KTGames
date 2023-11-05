import React, { useState } from "react";
import "./bingo.css";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import Bingo_board from "./Bingo_board";
import { calculateWinner_bingo } from "../../game_logics";

function generateRandomBoard() {
  const array = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array.map((number) => ({ number, marked: false }));
}

export default function Bingo() {
  const [board, setBoard] = useState(generateRandomBoard());
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [markedRows, setMarkedRows] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true); // New state to track game activity

  const handleMarkCell = (index) => {
    if (!isGameActive) {
      // If the game is not active, ignore clicks
      return;
    }
    setBoard((prevBoard) =>
      prevBoard.map((cell, i) => {
        if (i === index) return { ...cell, marked: !cell.marked };
        return cell;
      })
    );

    // Update complete lines calculation based on the new board structure
    const newBoard = [...board];
    newBoard[index] = { ...newBoard[index], marked: !newBoard[index].marked };
    const completeLines = calculateWinner_bingo(
      newBoard.map((cell) => (cell.marked ? "X" : null))
    );
    setMarkedRows(completeLines);

    if (completeLines === 5) {
      setIsWinnerModalVisible(true);
      setIsGameActive(false);
    }
  };

  const handleResetGame = () => {
    setBoard(generateRandomBoard()); // Reset with a new random board
    setIsWinnerModalVisible(false);
    setMarkedRows(0);
    setIsGameActive(true);
  };

  return (
    <div>
      <h1>Bingo</h1>
      <Bingo_board cells={board} onCellClick={handleMarkCell}></Bingo_board>
      <Button onClick={handleResetGame}>Reset Game</Button>
      <Modal
        title="Winner"
        open={isWinnerModalVisible}
        onCancel={() => setIsWinnerModalVisible(false)}
        onOk={() => setIsWinnerModalVisible(false)}
      >
        Congratulations! You have 5 complete lines in Bingo!
      </Modal>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
