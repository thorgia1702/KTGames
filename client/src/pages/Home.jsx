import React from "react";
import "./pages.css";
import Battleship from "../images/battleship.png";
import Bingo from "../images/bingo.png";
import Chess from "../images/chess.png";
import Tictactoe from "../images/tictactoe.png";
import { useState, useEffect } from "react";
import Lol from "../images/lol.png";
import Gow from "../images/gow.png";
import Farcry5 from "../images/farcry5.png";
import Dmc5 from "../images/dmc5.png";
import Cs2 from "../images/cs2.png";
import { useDispatch, useSelector } from "react-redux";
import Usermanage from "../images/user-manage.png";
import Itemmanage from "../images/item-manage.png";
import Ordermanage from "../images/order-manage.png";
import { Button, Modal, notification } from "antd";
import {
  signOutFailure,
  signOutSuccess,
  signOutStart,
} from "../redux/user/userSlice";

export default function Home() {
  const dispatch = useDispatch();
  const [showBannedPopup, setShowBannedPopup] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);
  const { currentUser } = useSelector((state) => state.user);

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(data.message));
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.status === 'banned') {
      setShowBannedPopup(true);
    }
  }, [currentUser]);

  const closeBannedPopup = () => {
    // Close the popup and sign out the user
    setShowBannedPopup(false);
    handleSignOut();
  };

  

  const plusSlides = (n) => {
    showSlides(slideIndex + n);
  };

  const currentSlide = (n) => {
    showSlides(n);
  };

  const showSlides = (n) => {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
      setSlideIndex(1);
    } else if (n < 1) {
      setSlideIndex(slides.length);
    } else {
      setSlideIndex(n);
    }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
  };

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);

  return (
    <div>
      <Modal
        title="You have been banned from the website"
        open={showBannedPopup}
        onOk={closeBannedPopup}
        onCancel={closeBannedPopup}
        centered
        footer={[
          <Button key="ok" type="primary" onClick={closeBannedPopup}>
            OK
          </Button>,
        ]}
      >
        <p>Please note that you have been banned from using our website.</p>
      </Modal>

      {currentUser && currentUser.role === "admin" ? (
        <h1>Welcome to KTGames Management site</h1>
      ) : (
        <h1>Welcome to KTGames!</h1>
      )}

      <hr></hr>

      {/* GAMES! */}
      {currentUser && currentUser.role === "admin" ? (
        <h2>Management pages</h2>
      ) : (
        <h2>All games</h2>
      )}

      {currentUser && currentUser.role === "admin" ? (
        <div className="grid-container">
          <div>
            <a href="/users">
              <img
                className="game"
                src={Usermanage}
                alt="user-manage"
                height={300}
                width={300}
              />
              <p>Manage users</p>
            </a>
          </div>
          <div>
            <a href="/items">
              <img
                className="game"
                src={Itemmanage}
                alt="item-manage"
                height={300}
                width={300}
              />
              <p>Manage items</p>
            </a>
          </div>
          <div>
            <a href="/orders">
              <img
                className="game"
                src={Ordermanage}
                alt="order-manage"
                height={300}
                width={300}
              />
              <p>Manage orders</p>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid-container">
          <div>
            <a href="/tic-tac-toe">
              <img
                className="game"
                src={Tictactoe}
                alt="tictactoe"
                height={300}
                width={300}
              />
              <p>Tic tac toe</p>
            </a>
          </div>
          <div>
            <a href="/bingo">
              <img
                className="game"
                src={Bingo}
                alt="bingo"
                height={300}
                width={300}
              />
              <p>Bingo</p>
            </a>
          </div>
        </div>
      )}

      <hr></hr>

      {/* NEWS! */}
      <h2>News</h2>
      <div className="slideshow-container">
        {/* Slides */}
        <div className="mySlides fade">
          <div className="numbertext">1 / 5</div>
          <img src={Lol} alt="chess" height={350} width={650} />
          <p className="newstitle">League of legends</p>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">2 / 5</div>
          <img src={Farcry5} alt="battleship" height={350} width={650} />
          <p className="newstitle">Far cry 5</p>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">3 / 5</div>
          <img src={Gow} alt="tictactoe" height={350} width={650} />
          <p className="newstitle">God of war</p>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">4 / 5</div>
          <img src={Cs2} alt="tictactoe" height={350} width={650} />
          <p className="newstitle">Counter Strike 2</p>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">5 / 5</div>
          <img src={Dmc5} alt="tictactoe" height={350} width={650} />
          <p className="newstitle">Devil may cry 5</p>
        </div>

        {/* Previous and Next buttons */}
        <a className="prev" onClick={() => plusSlides(-1)}>
          ❮
        </a>
        <a className="next" onClick={() => plusSlides(1)}>
          ❯
        </a>

        {/* Dots */}
        <div style={{ textAlign: "center" }}>
          <span className="dot" onClick={() => currentSlide(1)}></span>
          <span className="dot" onClick={() => currentSlide(2)}></span>
          <span className="dot" onClick={() => currentSlide(3)}></span>
          <span className="dot" onClick={() => currentSlide(4)}></span>
          <span className="dot" onClick={() => currentSlide(5)}></span>
        </div>
      </div>
    </div>
  );
}