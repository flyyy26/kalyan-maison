// "use client";

// import { useState, useEffect } from "react";

// type Admin = {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
//   createdAt: string;
// };

// export default function AdminPage() {
//   const [admins, setAdmins] = useState<Admin[]>([]);

//   useEffect(() => {
//     // Fetch admin users from the API
//     async function fetchAdmins() {
//       const response = await fetch("/api/users");
//       const data = await response.json();
//       setAdmins(data);
//     }
//     fetchAdmins();
//   }, []);

//   return (
//     <div>
//       <h1>Admin Users</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Created At</th>
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map((admin) => (
//             <tr key={admin.id}>
//               <td>{admin.id}</td>
//               <td>{admin.username}</td>
//               <td>{admin.email}</td>
//               <td>{admin.role}</td>
//               <td>{new Date(admin.createdAt).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function DashboardPage() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(''); // State to track authentication

//   console.log('data', isAuthenticated)

//   useEffect(() => {
//     // Check if the admin is authenticated
//     const authData = localStorage.getItem('adminAuthenticated');
//     if (!authData) {
//       router.push('/login'); // Redirect to login page if not authenticated
//     } else {
//       setIsAuthenticated('true'); // Set authentication state
//     }
//   }, [router]);

//   const handleLogout = () => {
//     // Clear the authentication flag from localStorage
//     localStorage.removeItem('adminAuthenticated');

//     // Redirect to login page after logout
//     router.push('/login');
//   };

//   return (
//     <div className="dashboard-container">
//       <h2>Hi Welcome to the Admin Dashboard</h2>
//       <div>
//         <p>Email: {isAuthenticated.email}</p>
//       </div>
//       <p>Here is your admin panel.</p>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = localStorage.getItem('adminAuthenticated');

    if (!adminData) {
      router.push('/login');
    } else {
      try {
        const parsedAdmin = JSON.parse(adminData); // Parsing JSON
        setAdmin(parsedAdmin as Admin);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminAuthenticated');
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/login');
  };

  if (!admin) {
    return <p>Memuat...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Selamat Datang, {admin.username}</h2>
      <p>Email: {admin.email}</p>
      <p>Role: {admin.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
