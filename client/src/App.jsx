import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Ktshop from "./pages/Ktshop";
import Leaderboard from "./pages/Leaderboard";
import Tic_tac_toe_offline from "./pages/tictactoe/Tic_tac_toe_offline";
import Tic_tac_toe_online from "./pages/tictactoe/TIc_tac_toe_online";
import Tic_tac_toe from "./pages/tictactoe/Tic_tac_toe";
import Bingo from "./pages/bingo/Bingo";
import Admin from "./pages/admin/Admin";
import Manage_items from "./pages/admin/Manage_items";
import Manage_users from "./pages/admin/Manage_users";
import Update_item from "./pages/admin/Update_item";
import Update_user from "./pages/admin/Update_user";
import Item_information from "./pages/Item_information";
import ScrollToTop from "./Scroll_To_Top";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <div style={{ minHeight: 500 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/tic-tac-toe" element={<Tic_tac_toe />} />
          <Route
            path="/tic-tac-toe-offline"
            element={<Tic_tac_toe_offline />}
          />
          <Route path="/ktshop" element={<Ktshop />} />

          <Route element={<PrivateRoute />}>
            <Route
              path="/tic-tac-toe-online"
              element={<Tic_tac_toe_online />}
            />
            <Route path="/bingo" element={<Bingo />} />
            <Route path="/view-item/:itemId" element={<Item_information />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/users" element={<Manage_users />} />
            <Route path="/items" element={<Manage_items />} />
            <Route path="/update-item/:itemId" element={<Update_item />} />
            <Route path="/update-user/:userId" element={<Update_user />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
