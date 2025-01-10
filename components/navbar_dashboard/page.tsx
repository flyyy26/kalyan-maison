"use client"

import React from 'react'
import menu from "@/app/[locale]/style/menu_dashboard.module.css"
import Link from 'next/link';
import Image from 'next/image';
import Logo from "@/public/images/logo.png"

const Navbar = () => {

    return (
        <>
            <div className={menu.navbar}>
                <div className={menu.navbar_layout}>
                    <Link href="/">
                        <div className={menu.logo}>
                            <Image fill src={Logo} alt='Kalyan Maison Logo' objectFit='contain'/>
                        </div>
                    </Link>
                </div>
                <div className={menu.navbar_layout}>
                    <nav>
                        <ul>
                            <li><Link href="#">Dashboard</Link></li>
                            <li><Link href="/dashboard/reservation">Reservation</Link></li>
                            <li><Link href="#">Lounges</Link></li>
                            <li><Link href="/dashboard/blog">Blog</Link></li>
                            <li><Link href="#">Contact</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Navbar;
