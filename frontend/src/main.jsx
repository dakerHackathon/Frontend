import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  // MSW 동작 확인을 위해 잠시 비활성화합니다.
  // 가로채기 재확인이 필요하면 아래 worker import/start 코드를 다시 활성화하면 됩니다.
  // const { worker } = await import("./mocks/browser");
  // return worker.start({
  //   onUnhandledRequest: "warn",
  // });
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
