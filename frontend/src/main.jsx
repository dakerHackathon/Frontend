import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// if (import.meta.env.DEV) {
//   const { worker } = await import("./mocks/browser.js");
//
//   worker.start({
//     onUnhandledRequest: "bypass", // ?뺤쟻 ?뚯씪(JS, CSS)? 臾댁떆?섍퀬 ?듦낵
//   });
// }

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser.js");

  await worker.start({
    onUnhandledRequest: "warn",
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
