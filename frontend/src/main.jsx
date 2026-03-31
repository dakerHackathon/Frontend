import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// if (import.meta.env.DEV) {
//   const { worker } = await import("./mocks/browser.js");

//   worker.start({
//     onUnhandledRequest: "bypass", // 정적 파일(JS, CSS)은 무시하고 통과
//   });
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
