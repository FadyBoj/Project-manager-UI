import React from 'react'

//components
import Logo from '../assets/LogoSvg.jsx';
import { AiOutlinePlus } from 'react-icons/ai'
const Header = (props) => {
  return (
    <div className='header'>
        <Logo width={200} />

        <div onClick={props.openDialog} className='create-btn'>
            <div>Create new</div>
            <div><AiOutlinePlus className='plus-icon' size={20}/></div>
        </div>
    </div>
  )
}

export default Header