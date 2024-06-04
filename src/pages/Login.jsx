// src/pages/Login.js

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import styles from "./login.module.css";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuth(true);
      navigate("/");
    } catch (error) {
      alert("로그인 실패: " + error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>로그인</h2>
        <div className={styles.formGroup}>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
        <Link to="/register" className={styles.registerLink}>회원가입</Link>
      </form>
    </div>
  );
};

export default Login;
