// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, 
        sendPasswordResetEmail, 
        deleteUser, 
        EmailAuthProvider, 
        reauthenticateWithCredential, 
        updatePassword } from "firebase/auth";
import { getFirestore, 
        collection, 
        getDocs, 
        query, 
        where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDay2GC28ZoCDvquCkAC_0x3Ex2rtIe358",
    authDomain: "oss-3-dd070.firebaseapp.com",
    projectId: "oss-3-dd070",
    storageBucket: "oss-3-dd070.appspot.com",
    messagingSenderId: "790752965200",
    appId: "1:790752965200:web:cffe4aab7febebd10c5755"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("비밀번호 재설정 이메일이 성공적으로 전송되었습니다.");
  } catch (error) {
    console.error("비밀번호 재설정 이메일 전송 중 오류 발생:", error);
  }
};

export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    await deleteUser(user);
    console.log('회원 탈퇴가 완료되었습니다.');
  } catch (error) {
    console.error('회원 탈퇴 중 오류 발생:', error);
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    console.log('비밀번호가 변경되었습니다.');
  } catch (error) {
    console.error('비밀번호 변경 중 오류 발생:', error);
  }
};

export const getOrders = async (customerId) => {
  try {
    const ordersQuery = query(collection(db, "orders"), where("customerId", "==", customerId));
    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders: ", error);
    return [];
  }
};