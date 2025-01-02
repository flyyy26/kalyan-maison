import React from 'react'
import footer from '@/app/style/footer.module.css'
import Image from 'next/image'
import Logo from '@/public/images/logo_footer.png'
import Link from 'next/link'

const page = () => {
  return (
    <>
      <div className={footer.footer_container}>
        <div className={footer.footer_logo}>
            <Image src={Logo} fill alt='Logo Kalya Maison' objectFit='contain' />
        </div>
        <div className={footer.menu}>
            <ul>
                <li><Link href="/">Privacy Policy</Link></li>
                <li><Link href="/">Terms Of Use</Link></li>
            </ul>
        </div>
        <div className={footer.copyright}>
            <span>Copyright © 2024 Kalyan Maison | All Rights Reserved</span>
        </div>
      </div>
    </>
  )
}

export default page