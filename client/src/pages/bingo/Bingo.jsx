import React, { useState } from "react";
import "./bingo.css";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import Bingo_board from "./Bingo-board";
import { calculateWinner_bingo } from "../../game_logics";

export default function Bingo() {
  const [board, setBoard] = useState(Array(25).fill(null));
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [markedRows, setMarkedRows] = useState(0);

  const handleMarkCell = (index) => {
    if (board[index] === null) {
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);

      const winnerResult = calculateWinner_bingo(newBoard);
      if (winnerResult === "X") {
        setMarkedRows((prevMarkedRows) => prevMarkedRows + 1);
        if (markedRows >= 5) {
          // Check for 5 marked rows
          setIsWinnerModalVisible(true);
        }
      }
    }
  };

  const handleResetGame = () => {
    setBoard(Array(25).fill(null));
    setIsWinnerModalVisible(false);
    setMarkedRows(0);
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
      >
        Congratulations! You won Bingo!
      </Modal>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
