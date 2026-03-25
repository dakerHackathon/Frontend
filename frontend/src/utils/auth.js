//개발용 모드 변수
/* 
해당 변수가 True이면 로그인하지 않고도 다른 페이지에 접근이 가능합니다.
False이면 로그인 로직이 그대로 동작하며, 로그인 시에만 다른 페이지로 접근이 가능합니다.
다른 페이지를 작업할 때는 True로 두고, 마이페이지 작업을 할 때에는 False로 두고 하는 것이 편할 것입니다.
(로그인을 해야 마이페이지 버튼이 보이기 때문입니다.)
*/
export const IS_DEV_MODE = false;

// 회원가입: 이름, 이메일, 아이디, 비밀번호 저장
export const registerUser = (userData) => {
  const { name, email, userId, password } = userData;
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // 이메일 또는 아이디 중복 체크
  if (users.find((u) => u.email === email))
    return { isSuccess: false, message: "이미 존재하는 이메일입니다." };
  if (users.find((u) => u.userId === userId))
    return { isSuccess: false, message: "이미 존재하는 아이디입니다." };

  const newUser = {
    id: Date.now(), // 고유 PK
    name,
    email,
    userId,
    password,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return { isSuccess: true, message: "회원가입이 완료되었습니다!" };
};

export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // 입력받은 email과 password가 모두 일치하는 사용자 찾기
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    localStorage.setItem("currentUser", JSON.stringify(sessionData));
    return { isSuccess: true };
  }

  return { isSuccess: false, message: "이메일 또는 비밀번호가 틀렸습니다." };
};

export const logoutUser = () => {
  localStorage.removeItem("currentUser");
};

// 로그인 여부 확인: 세션 데이터 존재 여부 반환
export const checkIsLoggedIn = () => {
  if (IS_DEV_MODE) return true;
  return localStorage.getItem("currentUser") !== null;
};

// 현재 로그인된 유저 정보 가져오기 (이름 표시용)
export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};
