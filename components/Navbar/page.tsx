"use client"

import React from 'react'
import menu from "@/app/style/menu.module.css"
import { AiOutlineMenu, AiOutlineClose  } from "react-icons/ai";
import Link from 'next/link';
import Image from 'next/image';
import Logo from "@/public/images/logo.png"
import {useMenu} from "@/context/MenuContext"

const Navbar = () => {
    const { isOpen, toggleMenu } = useMenu();

    return (
        <>
        {/* <div className={`${menu.navbar_container} ${isOpen ? menu.navbarContainer_active : ''}`}> */}
            <div className={`${menu.navbar} ${isOpen ? menu.navbarBorder : ''}`}>
                <div className={menu.navbar_layout}>
                    <div className={menu.logo}>
                        <Image fill src={Logo} alt='Kalyan Maison Logo' objectFit='contain'/>
                    </div>
                    <button
                        className={`${menu.hamburger} ${isOpen ? menu.iconOpen : ''}`}
                        aria-label="Toggle Menu"
                        onClick={toggleMenu}
                    >
                        <span className={`${menu.icon} ${isOpen ? menu.hidden : menu.visible}`}>
                            <AiOutlineMenu />
                        </span>
                        <span className={`${menu.icon} ${isOpen ? menu.visible : menu.hidden}`}>
                            <AiOutlineClose />
                        </span>
                    </button>
                </div>
                <div className={menu.navbar_layout}>
                    <span>EN</span>
                    <Link href="/"><button className={menu.btn_primary}>Reserve</button></Link>
                </div>
            </div>
            <nav className={`${menu.menu} ${isOpen ? menu.menuOpen : ''}`}>
                <ul>
                    <li><a href="#home">All Lounges</a></li>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#services">Blog</a></li>
                </ul>
            </nav>
        {/* </div> */}
        </>
    )
}

export default Navbar;