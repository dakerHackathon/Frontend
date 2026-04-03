import React, { StrictMode } from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  // 가로채기 설정을 담은 browser.js 파일을 가져옵니다.
  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );
