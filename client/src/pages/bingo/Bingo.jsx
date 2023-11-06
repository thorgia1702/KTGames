import React, { useState, useEffect } from "react";
import "./bingo.css";
import { Button, Modal } from "antd";
import BingoBoard from "./Bingo_board";
import { calculateWinner_bingo } from "../../game_logics";
import { useSelector } from "react-redux";
import Searching from "../../images/loop2.gif";
import { useSocket } from "../../helpers/socket.io/index";

export default function Bingo() {
  const [roomId, setRoomId] = useState(null);
  const { appSocket } = useSocket();
  const [board, setBoard] = useState([]);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [opponentId, setOpponentId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isConnected, setIsConnected] = useState(false);
  const [isBoardLoaded, setIsBoardLoaded] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
    trophy: 0,
    ktpoint: 0,
    phone: 0,
    role: "",
    password: "",
    status: "",
  });

  const handleConnectPlayers = () => {
    appSocket.emit("findGameBingo", currentUser._id);
    setIsConnected(true);
  };

  useEffect(() => {
    if (!appSocket) return;

    appSocket.on("startGame", async (gameData) => {
      if (gameData.gameType !== "bingo") return;

      setBoard(gameData.board); // Set the board directly from the game data
      setIsBoardLoaded(true);
      setIsPlayerTurn(gameData.players[0] === currentUser._id);
      setRoomId(gameData.roomId);
      setIsGameActive(true);
      const opponentPlayerId = gameData.players.find(
        (id) => id !== currentUser._id
      );
      setOpponentId(opponentPlayerId);

      try {
        const res = await fetch(`/api/user/get/${opponentPlayerId}`);
        const opponentData = await res.json();
        if (opponentData.success === false) {
          console.log(opponentData.message);
          return;
        }
        setFormData(opponentData);
      } catch (error) {
        console.error("Error fetching opponent name:", error);
      }
    });

    appSocket.on("gameUpdate", (newBoard) => {
      console.log("Received new board state: ", newBoard);
      setBoard(newBoard);
    });

    appSocket.on("updateTurn", (data) => {
      setIsPlayerTurn(data.nextPlayerId === currentUser._id);
    });

    appSocket.on("playerDisconnected", () => {
      setIsGameActive(false);
      Modal.info({
        title: "Player Disconnected",
        content: "Your opponent has disconnected. The game will end now.",
        onOk() {
          setIsConnected(false);
          setOpponentId(null);
        },
      });
    });

    // Cleanup on component unmount
    return () => {
      appSocket.off("startGame");
      appSocket.off("gameUpdate");
      appSocket.off("updateTurn");
      appSocket.off("playerDisconnected");
    };
  }, [appSocket]);

  const handleMarkCell = (index) => {
    if (!isGameActive || !isPlayerTurn || !roomId) return;

    const cell = board[index];
    if (!cell.marked) {
      appSocket.emit("move", { index, roomId });
      // The server will handle the state and emit an "updateTurn" event.
    }
  };

  return (
    <div>
      <h1>Bingo</h1>
      {isConnected && isBoardLoaded ? (
        opponentId ? (
          <div className="game-info-container">
            <p className="game-info">Your opponent: {formData.username}</p>
            <p className="game-info">
              Who's Turn: {isPlayerTurn ? "Your turn" : "Opponent's turn"}
            </p>
            <BingoBoard cells={board} onCellClick={handleMarkCell} />
          </div>
        ) : (
          <div className="waiting-container">
            <p className="waiting">Waiting for opponent...</p>
            <img
              src={Searching}
              alt="Searching for opponent"
              height={300}
              width={300}
            />
          </div>
        )
      ) : (
        <Button onClick={handleConnectPlayers} disabled={isConnected}>
          Connect Players
        </Button>
      )}

      <Modal
        title="Winner"
        open={isWinnerModalVisible}
        onCancel={() => setIsWinnerModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setIsWinnerModalVisible(false)}
          >
            Close
          </Button>,
        ]}
      >
        <p>Congratulations! You have won the Bingo game!</p>
      </Modal>
    </div>
  );
}
