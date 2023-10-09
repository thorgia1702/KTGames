import React from 'react'
import './Footer.css'
import './Styles.css'
import Logo from '../images/ktgame_logo.png';
import { Link } from 'react-router-dom';
import {FacebookOutlined, YoutubeOutlined, GithubOutlined} from '@ant-design/icons';

export default function Footer() {
  return (

    <div className="logo-footer-container">
        <Link to="/">
          <img className="logo" src={Logo} alt="Logo" height={100} width={250} />
        </Link>
        <div className='footer-links'>
            <a className='footer-icon' href='/about'>About us</a>
            <a className='footer-icon' href='https://www.facebook.com/profile.php?id=100035560933063'><FacebookOutlined /></a>
            <a className='footer-icon' href='https://www.youtube.com/channel/UCjhhORzyXI50PU_YZS4avdw'><YoutubeOutlined /></a>
            <a className='footer-icon' href='https://github.com/thorgia1702'><GithubOutlined /></a>
        </div>
        <div className='info'>
            <p>
              Tran Quang Khai
              <br/>
              GCH200767
              <br/>
              Final Project
              <br/>
              University of Greenwich Viet Nam
            </p>
        </div>
        
        
        
    </div>
    
  )
}
