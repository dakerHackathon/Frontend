import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    proxy: {
      // axios baseURL이 localhost를 보더라도 /user 요청은 개발 서버에서 백엔드로 전달합니다.
      "/user": {
        target: "http://13.125.160.175:8080",
        changeOrigin: true,
      },
      // 팀 관련 API도 동일하게 개발 서버에서 백엔드로 전달합니다.
      "/camp": {
        target: "http://13.125.160.175:8080",
        changeOrigin: true,
      },
    },
  },
});
