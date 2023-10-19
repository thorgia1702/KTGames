import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css'
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Ktshop from './pages/Ktshop';
import Leaderboard from './pages/Leaderboard';
import Tic_tac_toe_offline from './pages/tictactoe/Tic_tac_toe_offline';
import Tic_tac_toe_online from './pages/tictactoe/Tic_tac_toe_online';
import Tic_tac_toe from './pages/tictactoe/Tic_tac_toe';
import Bingo from './pages/bingo/Bingo';
import Admin from './pages/admin/admin';
import Manage_items from './pages/admin/Manage_items';
import Manage_users from './pages/admin/Manage_users';

export default function App() {
  return(
  <BrowserRouter>
  <Header />
  <div style={{minHeight: 500}}>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sign-in' element={<SignIn/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/leaderboard' element={<Leaderboard/>}/>
      <Route path='/tic-tac-toe' element={<Tic_tac_toe/>}/>
      <Route path='/tic-tac-toe-offline' element={<Tic_tac_toe_offline/>}/>
      <Route path='/ktshop' element={<Ktshop/>}/>
      <Route path='/bingo' element={<Bingo/>}/>

      <Route element={<PrivateRoute/>}>
        <Route path='/tic-tac-toe-online' element={<Tic_tac_toe_online/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Route>

      <Route element={<AdminRoute/>}>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/uses' element={<Manage_users/>}/>
        <Route path='/items' element={<Manage_items/>}/>
      </Route>

    </Routes>
  </div>
  <Footer />
  </BrowserRouter>
  )
}
