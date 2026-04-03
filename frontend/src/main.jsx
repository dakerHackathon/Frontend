import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  // 현재는 실제 응답으로 연동 상태를 확인해야 해서 개발 환경 mock worker를 잠시 비활성화합니다.
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

