import React from "react";
import Header from "../../components/Header";

export default function fridgeRegister() {
  return (
   <Header
      title="여기는 재료등록페이지"
      onNotificationPress={() => console.log("알림 클릭")}
      onProfilePress={() => console.log("프로필 클릭")}
   />
  );
}

