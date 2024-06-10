import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, sendPasswordReset, deleteAccount } from "../firebase";
import './MyPage.css'; // 스타일 파일 임포트

const MyPage = () => {
  const navigate = useNavigate();
  const email = auth.currentUser.email;

  const handlePasswordReset = () => {
    sendPasswordReset(email);
    alert('비밀번호 재설정 이메일이 전송되었습니다.');
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm("정말로 회원 탈퇴하시겠습니까?");
    if (isConfirmed) {
      await deleteAccount();
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    }
  };

  const handleOrderHistory = () => {
    navigate('/order-history');
  };

  return (
    <div className="mypage-container">
      <h2> {email} 님 반갑습니다.</h2>
      <div className="button-container">
        <button className="mypage-button" onClick={handleOrderHistory}>주문 내역 조회</button>
        <button className="mypage-button" onClick={handlePasswordReset}>비밀번호 재설정</button>
        <button className="mypage-button" onClick={handleDeleteAccount}>회원 탈퇴</button>
      </div>
    </div>
  );
};

export default MyPage;
