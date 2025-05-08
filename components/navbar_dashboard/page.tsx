"use client"

import React from 'react'
import menu from "@/app/[locale]/style/menu_dashboard.module.css"
import { Link } from '@/i18n/routing';
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
                            <li><Link href="/dashboard">Dashboard</Link></li>
                            <li><Link href="/dashboard/reservation">Reservation</Link></li>
                            <li><Link href="/dashboard/lounges">Lounges</Link></li>
                            <li><Link href="/dashboard/press">Press</Link></li>
                            <li><Link href="/dashboard/gallery/681bcfa40fe6e9b362afd97a">Gallery</Link></li>
                            <li><Link href="/dashboard/contact/67d680385affe265e192668d">Contact</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Navbar;
