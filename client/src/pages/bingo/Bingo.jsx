import React, { useState, useEffect } from "react";
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
  const [isGameActive, setIsGameActive] = useState(true);

  const handleMarkCell = (index) => {
    if (!isGameActive) {
      // If the game is not active, ignore clicks
      return;
    }
    // Toggle the marked state of the clicked cell
    setBoard((prevBoard) =>
      prevBoard.map((cell, i) =>
        i === index ? { ...cell, marked: !cell.marked } : cell
      )
    );
  };

  useEffect(() => {
    // Check for complete lines whenever the board changes
    const completeLines = calculateWinner_bingo(
      board.map((cell) => (cell.marked ? "X" : null))
    );
    setMarkedRows(completeLines);

    if (completeLines >= 5) {
      setIsWinnerModalVisible(true);
      setIsGameActive(false);
    }
  }, [board]);

  const handleResetGame = () => {
    setBoard(generateRandomBoard()); // Reset with a new random board
    setIsWinnerModalVisible(false);
    setMarkedRows(0);
    setIsGameActive(true);
  };

  return (
    <div>
      <h1>Bingo</h1>
      <Bingo_board cells={board} onCellClick={handleMarkCell} />
      <Button onClick={handleResetGame}>Reset Game</Button>
      <Modal
        title="Winner"
        open={isWinnerModalVisible}
        onCancel={() => setIsWinnerModalVisible(false)}
        onOk={() => setIsWinnerModalVisible(false)}
      >
        Congratulations! You have completed at least 5 lines in Bingo!
      </Modal>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
