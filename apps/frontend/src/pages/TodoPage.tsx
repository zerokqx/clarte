import React from "react";
import { useAuth } from "../hooks/useAuth";

export const TodoPage = () => {
  const { logout } = useAuth();
  
  return (
    <div style={{ padding: "40px", fontSize: "24px", fontFamily: "Arial" }}>
      <h1> TODO PAGE WORKS!</h1>
      <p>Если вы видите это сообщение, приложение работает!</p>
      <button 
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#d93025",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Выйти
      </button>
    </div>
  );
};
