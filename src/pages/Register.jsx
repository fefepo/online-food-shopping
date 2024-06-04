// src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import styles from "./register.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // 에러 메시지 초기화
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore에 사용자 데이터 저장
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
      });

      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError("이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.");
      } else {
        setError("회원가입 실패: " + error.message);
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2>회원가입</h2>
        {error && <p className={styles.error}>{error}</p>}
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
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Register;
