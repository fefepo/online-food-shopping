// src/pages/MyPage.jsx

import { Link } from "react-router-dom";

const MyPage = () => {
  return (
    <div>
      <h2>마이페이지</h2>
      <ul>
        <li>
          <Link to="/orders">주문 내역 확인</Link>
        </li>
        <li>
          <Link to="/withdrawal">회원 탈퇴</Link>
        </li>
      </ul>
    </div>
  );
};

export default MyPage;
