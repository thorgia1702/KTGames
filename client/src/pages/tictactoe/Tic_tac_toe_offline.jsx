import React, { useState } from "react";
import "../pages.css";
import Board from "./Board";
import "./tictactoe.css";
import { calculateWinner_tictactoe } from "../../game_logics";
import { Button, Modal, message } from "antd";
import { Link } from "react-router-dom";

export default function Tic_tac_toe_offline() {
  const [board, setBoard] = useState(Array(100).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);

  const winner = calculateWinner_tictactoe(board);

  const handleClick = (index) => {
    const boardCopy = [...board];
    if (winner || boardCopy[index]) return;
    boardCopy[index] = xIsNext ? "✖" : "○";
    setBoard(boardCopy);
    setXIsNext(!xIsNext);

    if (calculateWinner_tictactoe(boardCopy)) {
      // Show the winner modal when a winner is determined
      setIsWinnerModalVisible(true);
    }
  };

  const handleResetGame = () => {
    setBoard(Array(100).fill(null));
    setIsWinnerModalVisible(false);
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <div className="ctn">
        <div></div>
        <div className="game-container">
        <Board cells={board} onClick={handleClick}></Board>
        </div>
        <div>
          <button className="reset-button" onClick={handleResetGame}>
            RESET GAME
          </button>
        </div>
      </div>
      <Modal
        title="Winner"
        centered
        open={isWinnerModalVisible}
        onOk={() => setIsWinnerModalVisible(false)}
        onCancel={() => setIsWinnerModalVisible(false)}
        footer={[]}
      >
        <p>Winner is {winner}</p>
        <Button type="default" onClick={handleResetGame}>
          Reset Board
        </Button>
        <Link to={"/"}>
          <Button>Home</Button>
        </Link>
      </Modal>
    </div>
  );
}
