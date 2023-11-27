import React, { useState, useEffect } from "react";
import "./bingo.css";
import { Button, Modal } from "antd";
import BingoBoard from "./Bingo_board";
import { useDispatch, useSelector } from "react-redux";
import Searching from "../../images/loop2.gif";
import { useSocket } from "../../helpers/socket.io/index";
import { Link } from "react-router-dom";
import {
  updateUserSuccess,
  updateUserFailure,
  updateUserStart,
} from "../../redux/user/userSlice";

export default function Bingo() {
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState(null);
  const { appSocket } = useSocket();
  const [board, setBoard] = useState([]);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [opponentId, setOpponentId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBoardLoaded, setIsBoardLoaded] = useState(false);
  const [gameOutcome, setGameOutcome] = useState(null);
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
    setIsConnecting(true);
    setIsBoardLoaded(false);
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

      if (opponentPlayerId) {
        setIsConnecting(false);
      }

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

    appSocket.on("gameWon", async (data) => {
      if (data.winnerId === currentUser._id) {
        setGameOutcome("win");
        const newKtPoints = currentUser.ktpoint + 10;
        const newTrophies = currentUser.trophy + 1;
        fetch(`/api/user/update/${currentUser._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ktpoint: newKtPoints,
            trophy: newTrophies,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success === false) {
              dispatch(updateUserFailure(data.message));
            } else {
              dispatch(updateUserSuccess(data));
              setIsWinnerModalVisible(true);
            }
          })
          .catch((error) => {
            dispatch(updateUserFailure(error.message));
          });
      } else {
        setGameOutcome("lose");
      }
      setIsWinnerModalVisible(true);
      setIsGameActive(false);
    });

    appSocket.on("gameUpdate", (newBoard) => {
      setBoard(newBoard);
    });

    appSocket.on("updateTurn", (data) => {
      setIsPlayerTurn(data.nextPlayerId === currentUser._id);
    });

    appSocket.on("playerDisconnected", () => {
      setIsGameActive(false);
      Modal.info({
        title: "Player Disconnected",
        centered: true,
        content: "Your opponent has disconnected. The game will end now.",
        onOk() {
          setIsConnecting(false);
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
      appSocket.off("gameWon");
    };
  }, [appSocket, currentUser._id]);

  const handleMarkCell = (index) => {
    if (!isGameActive || !isPlayerTurn || !roomId) return;

    const cell = board[index];
    if (!cell.marked) {
      appSocket.emit("move", { index, roomId });
      // The server will handle the state and emit an "updateTurn" event.
    }
  };

  const handleNewMatchClick = () => {
    window.location.reload();
  };

  return (
    <div>
      <h1>Bingo</h1>

      {isConnecting ? (
        <div className="waiting-ctn">
          <p className="waiting">Waiting for opponent...</p>
          <img
            src={Searching}
            alt="Searching for opponent"
            height={300}
            width={300}
          />
        </div>
      ) : opponentId && isBoardLoaded ? (
        <div className="game-info-container">
          <p className="game-info">Your opponent: {formData.username}</p>
          <p className="game-info">
            Who's Turn: {isPlayerTurn ? "Your turn" : "Opponent's turn"}
          </p>
          <BingoBoard cells={board} onCellClick={handleMarkCell} />
        </div>
      ) : (
        <button
          className="navbutton"
          id="tic-tac-toe-online"
          onClick={handleConnectPlayers}
          disabled={isConnecting}
        >
          Connect Players
        </button>
      )}

      <Modal
        title={gameOutcome === "win" ? "Winner" : "Game Over"}
        open={isWinnerModalVisible}
        centered
        onCancel={() => setIsWinnerModalVisible(false)}
        footer={[]}
      >
        {gameOutcome === "win" ? (
          <p>Congratulations! You have won the Bingo game!</p>
        ) : (
          <p>Sorry! You have lost the Bingo game.</p>
        )}
        <Link to={"/bingo"}>
          <Button onClick={handleNewMatchClick}>New match</Button>
        </Link>
        <Link to={"/"}>
          <Button>Home</Button>
        </Link>
      </Modal>
    </div>
  );
}
