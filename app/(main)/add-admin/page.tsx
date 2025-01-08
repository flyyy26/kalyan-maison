'use client';
import { useState } from "react";

export default function AdminManagement() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (response.ok) {
        alert("Admin created successfully!");
      } else {
        alert("Failed to create admin.");
      }
    };
  
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <h1>Create Admin User</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Create Admin</button>
        </form>
      </div>
    );
  }
  