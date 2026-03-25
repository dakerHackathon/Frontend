import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser.js");
  worker.start({
    onUnhandledRequest: "bypass", // 매칭되지 않는 요청은 경고 없이 통과
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
