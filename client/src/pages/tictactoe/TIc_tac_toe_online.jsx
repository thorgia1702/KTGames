import React, { useState, useEffect } from "react";
import "../pages.css";
import Board from "./Board";
import "./tictactoe.css";
import { Button, Modal, message } from "antd";
import { Link } from "react-router-dom";
import { useSocket } from "../../helpers/socket.io/index";
import { calculateWinner } from "../../game_logics";
import { useSelector } from "react-redux";

export default function Tic_tac_toe_online() {
  const { appSocket } = useSocket();
  const [board, setBoard] = useState(Array(100).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const winner = calculateWinner(board);

  const [isConnected, setIsConnected] = useState(false);

  const handleConnectPlayers = () => {
    appSocket.emit("joinRoom", roomId, currentUser.username);
    setIsConnected(true);
  };

  useEffect(() => {
    appSocket.on("gameUpdate", (updatedBoard) => {
      setBoard(updatedBoard);
      if (calculateWinner(updatedBoard)) {
        setIsWinnerModalVisible(true);
      }
    });

    appSocket.on("startGame", (opponent) => {
      setOpponentName(opponent);
    });

    // Handle opponent disconnection
    appSocket.on("playerDisconnected", () => {
      setIsConnected(false);
      setOpponentName(null);
      setBoard(Array(100).fill(null));
      setIsWinnerModalVisible(false);
      setXIsNext(true);
    });

    return () => {
      appSocket.off("gameUpdate");
      appSocket.off("startGame");
    };
  }, [appSocket]);

  const handleClick = (index) => {
    const boardCopy = [...board];
    if (
      winner ||
      boardCopy[index] ||
      !isConnected ||
      xIsNext !== currentUser.username
    )
      return;
    boardCopy[index] = xIsNext ? "✖" : "○";
    appSocket.emit("move", { roomId, board: boardCopy });
    // Update xIsNext only if it's the player's turn
    if (currentUser.username === xIsNext) {
      setXIsNext(!xIsNext);
    }
  };

  const handleResetGame = () => {
    setBoard(Array(100).fill(null));
    setIsWinnerModalVisible(false);
    setOpponentName(null);
    appSocket.emit("newMatch", roomId);
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>

      {isConnected ? (
        <div>
          <p>
            {opponentName
              ? `Opponent: ${opponentName}`
              : "Waiting for opponent..."}
          </p>
          <p>Who's turn: {xIsNext ? opponentName : currentUser.username}</p>
          <div className="game-container">
            <Board cells={board} onClick={handleClick}></Board>
          </div>
        </div>
      ) : (
        <button
          className="connect-button"
          onClick={handleConnectPlayers}
          disabled={isConnected}
        >
          Connect Players
        </button>
      )}

      <Modal
        title="Winner"
        centered
        visible={isWinnerModalVisible}
        onOk={() => setIsWinnerModalVisible(false)}
        onCancel={() => setIsWinnerModalVisible(false)}
        footer={[]}
      >
        <p>Winner is {winner}</p>
        <Button type="default" onClick={handleConnectPlayers}>
          New match
        </Button>
        <Link to={"/"}>
          <Button>Home</Button>
        </Link>
      </Modal>
    </div>
  );
}
