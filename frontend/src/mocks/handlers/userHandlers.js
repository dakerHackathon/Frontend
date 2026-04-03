import { http, HttpResponse } from "msw";
import { mockUsers } from "../data/user";

const BASE_URL = "http://13.125.160.175:8080";

export const userHandlers = [
  // <로그인 API>
  http.post(`${BASE_URL}/user/login`, async ({ request }) => {
    // 1. 파라미터를 loginId 대신 email로 받습니다.
    const { email, password } = await request.json();

    // 2. 로컬스토리지에서 유저 목록을 가져옵니다.
    const storedUsers = JSON.parse(
      localStorage.getItem("users") || JSON.stringify(mockUsers),
    );

    // 3. email과 password가 일치하는 유저를 찾습니다.
    const user = storedUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      return HttpResponse.json({
        isSuccess: true,
        code: "200",
        message: "요청이 성공적입니다.",
        data: {
          userId: user.id,
          name: user.name,
          nickName: user.nickName,
        },
      });
    }

    return HttpResponse.json(
      {
        isSuccess: false,
        code: "401",
        message: "이메일 또는 비밀번호가 틀렸습니다.",
        data: null,
      },
      { status: 401 },
    );
  }),

  // <회원가입 API>
  http.post(`${BASE_URL}/user/signup`, async ({ request }) => {
    const userData = await request.json();
    const { email, loginId, password, name, nickName } = userData;

    const users = JSON.parse(
      localStorage.getItem("users") || JSON.stringify(mockUsers),
    );

    // 중복 체크
    if (users.find((u) => u.email === email)) {
      return HttpResponse.json(
        { isSuccess: false, message: "이미 존재하는 이메일입니다." },
        { status: 400 },
      );
    }
    if (users.find((u) => u.loginId === loginId)) {
      return HttpResponse.json(
        { isSuccess: false, message: "이미 존재하는 아이디입니다." },
        { status: 400 },
      );
    }

    // 새 유저 저장
    const newUser = {
      id: Date.now(),
      email,
      loginId,
      password,
      name,
      nickName,
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return HttpResponse.json({
      isSuccess: true,
      code: "200",
      message: "요청이 성공적입니다.",
    });
  }),
];
