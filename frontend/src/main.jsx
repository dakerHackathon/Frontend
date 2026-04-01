import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// MSW를 활성화하려면 아래 주석을 해제한다.
// 실제 백엔드 서버와 통신할 때는 주석 처리 상태를 유지한다.
// if (import.meta.env.DEV) {
//   const { worker } = await import("./mocks/browser.js");
//
//   // worker.start()가 완료된 뒤 앱을 렌더링해야 첫 API 요청을 MSW가 가로챌 수 있다.
//   // await 없이 렌더링하면 서비스 워커 등록 전에 요청이 나가 HTML 응답을 받게 된다.
//   await worker.start({
//     onUnhandledRequest: "warn", // 처리되지 않은 요청은 콘솔에 경고를 출력한다.
//   });
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
