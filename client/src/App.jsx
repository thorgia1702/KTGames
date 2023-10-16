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

import Tic_tac_toe from './pages/Tic_tac_toe';
import Ktshop from './pages/Ktshop';
import Bingo from './pages/Bingo';
import Leaderboard from './pages/Leaderboard';

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
      <Route path='/ktshop' element={<Ktshop/>}/>
      <Route path='/bingo' element={<Bingo/>}/>
      <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>}/>
      </Route>
    </Routes>
  </div>
  <Footer />
  </BrowserRouter>
  )
}
