import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser.js");

  // worker.start()가 완료된 뒤 앱을 렌더링해야 첫 API 요청을 MSW가 가로챌 수 있다.
  // await 없이 렌더링하면 서비스 워커 등록 전에 요청이 나가 HTML 응답을 받게 된다.
  await worker.start({
    onUnhandledRequest: "bypass", // 정적 파일(JS, CSS)은 무시하고 통과
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
