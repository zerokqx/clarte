import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./Login.css";

export const RegisterPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { register, isLoading, error } = useAuth();

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      setPasswordError("Пароль должен содержать минимум 8 символов");
      return false;
    }
    if (!/[A-Z]/.test(pass)) {
      setPasswordError("Пароль должен содержать хотя бы одну заглавную букву");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      setPasswordError("Пароль должен содержать хотя бы один спецсимвол (!@#$%^&*())");
      return false;
    }
    if (/[а-яА-Я]/.test(pass)) {
      setPasswordError("Пароль должен содержать только латинские буквы");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }
    if (!validatePassword(password)) {
      return;
    }
    const success = await register({ login, password });
    if (success) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Регистрация</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль (мин. 8 символов, заглавная буква, спецсимвол)"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
          <input
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading || !!passwordError}>
            {isLoading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
        <p>
          Уже есть аккаунт? <a href="/login">Войти</a>
        </p>
      </div>
    </div>
  );
};
