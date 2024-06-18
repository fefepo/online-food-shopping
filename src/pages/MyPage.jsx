import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, sendPasswordReset, deleteAccount } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import "./MyPage.css";

const MyPage = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data = userDoc.data();
        setUserData(data);
        setName(data.name);
        setPhone(data.phone);
        setAddress(data.address);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          name,
          phone,
          address,
        });
        alert("정보가 업데이트되었습니다.");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("사용자 데이터 업데이트 오류: ", error);
      alert("정보 업데이트 실패: " + error.message);
    }
  };

  const handlePasswordReset = () => {
    sendPasswordReset(auth.currentUser.email);
    alert("비밀번호 재설정 이메일이 전송되었습니다.");
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm("정말로 회원 탈퇴하시겠습니까?");
    if (isConfirmed) {
      try {
        const user = auth.currentUser;
        if (user) {
          await deleteDoc(doc(db, "users", user.uid));

          await deleteAccount();

          await auth.signOut();

          setIsAuthenticated(false);

          alert("회원 탈퇴가 완료되었습니다.");
          navigate("/");
        }
      } catch (error) {
        console.error("회원 탈퇴 오류: ", error);
        alert("회원 탈퇴 실패: " + error.message);
      }
    }
  };

  const handleOrderHistory = () => {
    navigate("/order-history");
  };

  return (
    <div className="mypage-container">
      {userData ? (
        <>
          <h2>{name} 님 반갑습니다.</h2>
          {isEditing ? (
            <form onSubmit={handleUpdate} className="update-form">
              <div className="formGroup">
                <label>이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="formGroup">
                <label>연락처</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="formGroup">
                <label>주소</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="button-container">
                <button type="submit" className="mypage-button">
                  정보 수정
                </button>
                <button
                  type="button"
                  className="mypage-button"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <div className="button-container">
              <button
                className="mypage-button"
                onClick={handleOrderHistory}
              >
                주문 내역 조회
              </button>
              <button
                className="mypage-button"
                onClick={() => setIsEditing(true)}
              >
                회원정보수정
              </button>
              <button
                className="mypage-button"
                onClick={handlePasswordReset}
              >
                비밀번호 재설정
              </button>
              <button
                className="mypage-button"
                onClick={handleDeleteAccount}
              >
                회원 탈퇴
              </button>
            </div>
          )}
        </>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default MyPage;
