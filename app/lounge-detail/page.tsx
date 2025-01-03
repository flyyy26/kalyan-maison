'use client'

import React from 'react';
import style from '@/app/style/lounge_detail.module.css';
import { useLocationContext } from '@/context/LocationContext';

export default function LoungeDetail() {
  const { locations } = useLocationContext();

  if (!locations || locations.length === 0) {
    return <div>Loading...</div>;
  }

  // Ambil lokasi aktif, misalnya lokasi pertama
  const activeLocation = (locations[0]);

  return (
    <>
      <div className={style.banner}  style={{ background: `url(${activeLocation.banner}`}}>
        <div className={style.heading_banner}>
          <h1>Kalyan Maison {activeLocation.name}</h1>
          <p>{activeLocation.address}</p>
          <p>+62 {activeLocation.phone}</p>
        </div>
      </div>
    </>
  );
}
