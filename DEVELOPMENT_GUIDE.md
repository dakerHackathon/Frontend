# DEVELOPMENT_GUIDE.md

## 문서 목적

이 문서는 Blooming Hackathon 프론트엔드 프로젝트의 현재 구조, 개발 원칙, 향후 목표 구조를 정리한 공식 개발 가이드다.  
현재 저장소에는 프론트엔드 파일만 존재하므로, 백엔드 항목은 "연동 대상 시스템에 대한 권장 아키텍처 기준"으로 정의한다.

## 프로젝트 개요

- 프로젝트 목적: 해커톤 정보를 조회하고, 참여 신청과 팀 활동을 지원하는 해커톤 홈페이지 구축
- 현재 저장소 범위: 프론트엔드 단일 저장소
- 프론트엔드 기술 스택: React 19, Vite 8, React Router 7, TailwindCSS v4, axios, MSW 2
- 개발 스타일: 프롬프트 기반 바이브코딩 + 문서 중심 일관성 유지
- 주석 정책: 모든 신규 주석은 한글로 작성하고, 로직의 의도와 예외 상황이 드러나야 한다

## 현재 실제 디렉토리 구조

아래 트리는 현재 저장소를 스캔한 결과를 기준으로, 개발에 의미 있는 구조만 정리한 것이다.  
`node_modules`, `dist`, `.git` 같은 생성물과 의존성 디렉토리는 제외했다.

```text
Frontend/
|-- AGENT.md
|-- DEVELOPMENT_GUIDE.md
|-- README.md
|-- package-lock.json
`-- frontend/
    |-- .gitignore
    |-- eslint.config.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- vite.config.js
    |-- public/
    |   |-- favicon.svg
    |   |-- icons.svg
    |   `-- mockServiceWorker.js
    `-- src/
        |-- App.css
        |-- App.jsx
        |-- index.css
        |-- main.jsx
        |-- api/
        |   |-- api_registry.js
        |   |-- auth.js
        |   `-- axiosInstance.js
        |-- assets/
        |   |-- BloomingLogo.png
        |   `-- mailDeleteIcon.png
        |-- components/
        |   |-- Footer.jsx
        |   |-- Header.jsx
        |   |-- Layout.jsx
        |   |-- MainCard.jsx
        |   |-- common/
        |   |   |-- BaseInfoCard.jsx
        |   |   |-- MiniCalendar.jsx
        |   |   |-- PageSectionHeader.jsx
        |   |   |-- PrimaryActionButton.jsx
        |   |   |-- RankingSidebarCard.jsx
        |   |   |-- SearchFilterBar.jsx
        |   |   `-- StatusBadge.jsx
        |   |-- mail/
        |   |   |-- MailListItem.jsx
        |   |   |-- MailSearchPanel.jsx
        |   |   |-- MailSidebar.jsx
        |   |   |-- MailViewer.jsx
        |   |   `-- NewMessageModal.jsx
        |   `-- mypage/
        |       |-- ActivityTemperatureCard.jsx
        |       |-- constants.js
        |       |-- HackathonListSection.jsx
        |       |-- InboxSection.jsx
        |       |-- Modal.jsx
        |       |-- ProfileEditModal.jsx
        |       |-- ProfileSection.jsx
        |       |-- SavedHackathonsSection.jsx
        |       |-- TeamCreateModal.jsx
        |       `-- TeamStatusSection.jsx
        |       `-- teamDetail/
        |           |-- shared.jsx
        |           |-- TeamBasicInfoCard.jsx
        |           |-- TeamHackathonLinkCard.jsx
        |           |-- TeamInviteCard.jsx
        |           `-- TeamMembersCard.jsx
        |-- data/
        |   `-- hackathons.js
        |-- hooks/
        |   |-- useAuth.js
        |   `-- common/
        |       `-- useApi.js
        |-- mocks/
        |   |-- browser.js
        |   |-- data/
        |   |   |-- mailData.js
        |   |   `-- user.js
        |   `-- handlers/
        |       |-- totalHandlers.js
        |       `-- userHandlers.js
        |-- pages/
        |   |-- HackathonDetailPage.jsx
        |   |-- HackathonListPage.jsx
        |   |-- Home.jsx
        |   |-- LoginPage.jsx
        |   |-- MailPage.jsx
        |   |-- MyPage.jsx
        |   |-- RankingPage.jsx
        |   |-- RecruitMemberPage.jsx
        |   |-- RecruitWritePage.jsx
        |   |-- SignUp.jsx
        |   `-- TeamDetailPage.jsx
        |-- routes/
        |   |-- AppRouter.jsx
        |   `-- ProtectedRoute.jsx
        `-- utils/
            `-- auth.js
```

## 현재 아키텍처 해석

현재 프론트엔드 구조는 다음 특징을 가진다.

- 라우트 진입점은 `src/App.jsx`와 `src/routes/AppRouter.jsx`다.
- 인증 보호는 `ProtectedRoute.jsx`에서 처리한다.
- API 호출은 `axiosInstance.js`를 기반으로 `src/api`에서 관리한다.
- 요청 상태 관리는 `hooks/common/useApi.js`와 `hooks/useAuth.js` 같은 커스텀 훅이 담당한다.
- 공통 UI는 `components/common`에 모여 있다.
- 메일, 마이페이지 등 일부 도메인은 폴더 분리가 시작됐지만, 해커톤 도메인은 아직 `pages`와 `data`에 로직이 많이 남아 있다.
- 전역 상태 라이브러리는 사용하지 않고, 페이지 단위 `useState` 중심으로 운영 중이다.
- MSW는 설정돼 있으나 현재는 `userHandlers` 위주이며, 모든 화면이 핸들러 기반으로 정리된 상태는 아니다.

## 현재 공식 상태 관리 기준

이 프로젝트의 현재 공식 기준은 다음과 같다.

- 기본 상태 관리는 React 내장 훅을 사용한다.
- 페이지 범위 상태는 각 페이지 내부에서 관리한다.
- 여러 페이지에서 반복되는 비동기 로직은 커스텀 훅으로 추상화한다.
- 전역 상태 라이브러리(Zustand, Redux 등)는 기본 선택지가 아니다.
- 전역 상태가 꼭 필요한 경우에도 먼저 Context 또는 라우트/URL 상태로 해결 가능한지 검토한다.

즉, 현재 기준은 "로컬 상태 우선, 커스텀 훅 보조, 전역 라이브러리 보류"다.

## 프론트엔드 베스트 프랙티스

### 1. React 컴포넌트 분리 기준

다음 기준을 만족하면 컴포넌트 분리를 우선 검토한다.

- 하나의 JSX 블록이 의미 있는 독립 UI 단위다.
- 같은 UI 패턴이 두 화면 이상에서 반복된다.
- 페이지 파일이 라우팅, 상태 관리, 마크업까지 모두 품어 추론이 어려워졌다.
- UI 블록에 자체 상태 또는 이벤트 책임이 있다.
- 디자이너/기획 변경이 잦아 독립 수정 가능성이 높다.

분리 원칙은 다음과 같다.

- `pages/`: 라우팅 단위 화면, 데이터 조합, 상위 상태 관리
- `components/common/`: 버튼, 카드, 배지, 필터바 등 범용 UI
- 도메인 컴포넌트: 특정 기능에서만 쓰는 UI 묶음
- `hooks/`: 재사용 가능한 상태/비동기 로직
- `data/` 또는 `mocks/`: 목업 데이터, 더미 응답, 화면 실험용 데이터

### 2. 페이지 설계 원칙

- 페이지는 "화면 오케스트레이션" 역할에 집중한다.
- 페이지 내부에서 할 일:
  - 라우트 파라미터 읽기
  - API 또는 목업 데이터 결합
  - 상위 필터/정렬/탭 상태 보유
  - 공통 컴포넌트 조합
- 페이지에서 피해야 할 일:
  - 재사용 가능한 UI 블록의 중복 정의
  - 대규모 인라인 SVG/마크업의 무한 증식
  - 도메인 로직과 표현 로직의 과도한 혼합

### 3. 커스텀 훅 사용 기준

- 네트워크 상태 관리, 폼 제출, 인증 흐름처럼 여러 화면에서 재사용될 때 훅으로 추출한다.
- 단일 파일에서만 쓰는 단순 로직은 무리해서 훅으로 만들지 않는다.
- 훅은 UI를 반환하지 않고 상태와 액션만 반환한다.
- 훅 내부 주석은 "왜 이 순서로 처리하는지"가 드러나야 한다.

## TailwindCSS 유틸리티 클래스 적용 원칙

현재 프로젝트는 다음 설정을 사용한다.

- `@tailwindcss/vite` 플러그인 기반
- `src/index.css`에서 `@import "tailwindcss"` 사용
- 별도 `tailwind.config.*` 없음

이 조건을 기준으로 다음 규칙을 따른다.

### 1. 모바일 우선

- 기본 클래스는 모바일 기준으로 작성한다.
- 화면 확장은 `sm`, `lg`, `xl`, `2xl` 순서로 추가한다.

### 2. 반복 스타일은 공통 컴포넌트로 승격

- 카드 외형, 섹션 헤더, 주요 CTA, 배지 패턴처럼 반복도가 높은 스타일은 `components/common`으로 흡수한다.
- 동일한 긴 클래스 문자열이 3회 이상 반복되면 분리를 검토한다.

### 3. 임의값 사용 원칙

- 현재 코드베이스는 `rounded-[28px]`, `max-w-[1180px]` 같은 임의값을 적극 사용한다.
- 임의값 사용 자체는 허용되지만, 같은 값이 여러 곳에서 반복되면 공통 컴포넌트 또는 스타일 래퍼로 정리한다.

### 4. 클래스 구성 순서 권장

- 레이아웃: `flex`, `grid`, `items-*`, `justify-*`, `gap-*`
- 크기/여백: `w-*`, `h-*`, `p-*`, `m-*`
- 외형: `rounded-*`, `border-*`, `bg-*`, `shadow-*`
- 타이포그래피: `text-*`, `font-*`, `leading-*`, `tracking-*`
- 상호작용: `transition`, `hover:*`, `focus:*`

### 5. 접근성 고려

- 클릭 가능한 div보다 버튼 또는 링크를 우선 사용한다.
- 불가피하게 비시맨틱 요소를 쓰면 `role`, `tabIndex`, 키보드 이벤트를 함께 제공한다.
- 포커스 스타일을 제거할 때는 대체 포커스 피드백을 반드시 제공한다.

## API 통신 규칙

### 현재 구조

- `src/api/axiosInstance.js`: 공통 axios 인스턴스
- `src/api/auth.js`: 도메인 API
- `src/api/api_registry.js`: API 모음 진입점
- `src/hooks/common/useApi.js`: 요청 로딩/에러 상태 관리

### 권장 규칙

- 모든 실제 API 요청은 `src/api`를 통해서만 호출한다.
- 페이지에서 직접 axios를 import하지 않는다.
- 도메인 단위로 API 파일을 분리한다.
  - 예: `auth.js`, `hackathon.js`, `mail.js`, `team.js`
- API 함수는 "요청 1회"에 집중하고, UI 상태 관리는 훅 또는 페이지에서 담당한다.
- 응답 스키마가 정해지면 주석 또는 타입 수준 문서화를 함께 남긴다.

### 에러 처리 가이드

- `axiosInstance`에서 공통 응답 처리 규칙을 통일한다.
- 훅에서는 에러를 삼키지 말고, 메시지 추출 후 상위 UI가 처리할 수 있게 전달한다.
- 에러 메시지는 사용자 친화적인 한국어 문장으로 변환한다.
- 인증 실패, 권한 실패, 네트워크 실패, 비즈니스 검증 실패를 구분한다.

## MSW 기반 모킹 전략

백엔드 API가 완성되기 전까지는 MSW를 프론트 병렬 개발의 기본 도구로 사용한다.

### 현재 상태

- `src/mocks/browser.js`에서 worker 설정이 존재한다.
- `src/mocks/handlers/totalHandlers.js`에서 핸들러를 취합한다.
- 현재는 `userHandlers.js`만 연결된 상태다.
- `src/main.jsx`의 worker 시작 코드는 주석 처리돼 있다.

### 권장 전략

1. 새 API를 만들 때는 실제 API 파일과 MSW 핸들러를 동시에 정의한다.
2. 응답 구조는 백엔드 계약과 최대한 유사하게 맞춘다.
3. 성공/실패/빈 데이터/권한 오류 케이스를 함께 만든다.
4. 임시 더미 데이터는 `src/mocks/data`에 둔다.
5. 페이지에서 직접 목업 배열을 하드코딩하기보다, MSW 또는 도메인 데이터 계층을 우선 사용한다.

### 권장 디렉토리 예시

```text
src/
|-- api/
|   |-- auth.js
|   |-- hackathon.js
|   |-- mail.js
|   `-- team.js
`-- mocks/
    |-- data/
    |   |-- auth.js
    |   |-- hackathons.js
    |   |-- mails.js
    |   `-- teams.js
    `-- handlers/
        |-- authHandlers.js
        |-- hackathonHandlers.js
        |-- mailHandlers.js
        |-- teamHandlers.js
        `-- totalHandlers.js
```

### 실무 운영 규칙

- 화면 완성 후 실제 API가 연결되면 "핸들러 삭제"가 아니라 "환경별 전환"을 먼저 고려한다.
- 개발 중에는 MSW로 재현 가능한 에러 케이스를 확보해 UI 예외 처리를 검증한다.
- 응답 shape가 바뀌면 API, 핸들러, 목업 데이터, 화면 매핑 코드를 함께 수정한다.

## 향후 목표 구조

현재 구조를 존중하되, 향후에는 도메인 단위 응집도를 높이는 방향으로 점진적으로 정리한다.

### 목표

- 페이지 파일의 비대화를 줄인다.
- 해커톤 도메인의 UI, 로직, 데이터 책임을 분리한다.
- 목업 데이터와 실제 API 전환 지점을 명확히 한다.
- 공통 UI와 도메인 UI의 경계를 분명히 한다.

### 목표 디렉토리 예시

```text
src/
|-- api/
|   |-- auth.js
|   |-- hackathon.js
|   |-- mail.js
|   `-- team.js
|-- components/
|   `-- common/
|       ...
|-- features/
|   |-- auth/
|   |   |-- components/
|   |   |-- hooks/
|   |   `-- utils/
|   |-- hackathon/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- utils/
|   |   `-- constants/
|   |-- mail/
|   |   |-- components/
|   |   `-- hooks/
|   `-- team/
|       |-- components/
|       |-- hooks/
|       `-- utils/
|-- hooks/
|   `-- common/
|-- mocks/
|   |-- data/
|   `-- handlers/
|-- pages/
|   |-- Home.jsx
|   |-- LoginPage.jsx
|   |-- SignUp.jsx
|   |-- HackathonListPage.jsx
|   |-- HackathonDetailPage.jsx
|   |-- MailPage.jsx
|   |-- MyPage.jsx
|   `-- ...
|-- routes/
|-- utils/
`-- data/
```

### 점진적 리팩터링 순서 권장

1. 해커톤 목록/상세에서 반복 UI를 도메인 컴포넌트로 분리
2. 해커톤 관련 목업 데이터와 매핑 함수를 정리
3. 해커톤 API와 MSW 핸들러 추가
4. 로그인/회원가입의 요청 필드와 응답 필드 정합성 정리
5. 메일, 팀, 마이페이지 도메인 순으로 동일한 구조 규칙 적용

## 해커톤 도메인 구현 가이드

현재 프로젝트 목적상 해커톤 도메인이 핵심이므로 다음 원칙을 우선 적용한다.

- 목록 페이지는 검색, 필터, 정렬, 즐겨찾기 상태 관리에 집중한다.
- 상세 페이지는 상세 정보 조합, 모달 제어, 참여 액션, 제출물/리더보드 렌더링에 집중한다.
- 카드, 즐겨찾기 버튼, 상태 배지, 상세 섹션 헤더는 재사용 가능한 도메인 컴포넌트로 분리 가능성을 우선 검토한다.
- 해커톤 데이터가 커질수록 화면 파일에서 직접 관리하지 말고 도메인 데이터 모듈 또는 API 계층으로 이동한다.

## 라우팅 가이드

- 모든 라우트는 `src/routes/AppRouter.jsx`에서 관리한다.
- 인증이 필요한 라우트는 `ProtectedRoute` 하위에 둔다.
- 목록 위에 상세 모달을 띄우는 패턴처럼 `backgroundLocation`을 활용하는 경우, 닫기 동작과 직접 접근 동작을 모두 고려해야 한다.
- 상세 페이지는 다음 두 경로를 모두 안전하게 처리해야 한다.
  - 목록에서 모달 형태로 열린 경우
  - URL 직접 진입으로 열린 경우

## 인증 가이드

- 현재 인증 상태는 `localStorage` 기반이다.
- 개발 단계에서는 간단한 세션 시뮬레이션을 허용하되, 실제 백엔드 연동 시 토큰 저장 방식과 만료 처리 정책을 명확히 해야 한다.
- 로그인 여부 체크는 공통 유틸에서 수행하고, 페이지 내부에서 중복 구현하지 않는다.
- 인증 관련 메시지는 한국어로 일관되게 제공한다.

## 백엔드 연동 대상 권장 아키텍처

현재 저장소에는 백엔드 코드가 없지만, 추후 Spring 또는 Spring Boot 백엔드를 붙일 때는 다음 계층형 구조를 권장한다.

### 권장 계층

- Controller: 요청/응답 DTO 매핑, 인증 정보 수신, HTTP 상태 코드 제어
- Service: 비즈니스 규칙, 트랜잭션, 권한 검증, 도메인 조합
- Repository: 데이터 영속성 처리
- Domain/Entity: 핵심 모델과 상태
- DTO: 외부 계약 전용 객체

### 설계 원칙

- Controller는 얇게 유지한다.
- Service가 핵심 비즈니스 로직을 가진다.
- Repository는 조회/저장 책임만 가진다.
- 엔티티를 그대로 프론트에 노출하지 않고 DTO를 통해 응답한다.
- 해커톤, 팀, 사용자, 메일 도메인은 분리된 패키지 단위로 관리한다.

### 예시 패키지 구조

```text
backend/
`-- src/main/java/.../
    |-- hackathon/
    |   |-- controller/
    |   |-- service/
    |   |-- repository/
    |   |-- domain/
    |   `-- dto/
    |-- team/
    |-- user/
    `-- mail/
```

## 보안 가이드

### 프론트엔드

- 민감한 비밀값을 소스코드에 하드코딩하지 않는다.
- API base URL은 장기적으로 환경 변수로 분리한다.
- 사용자 입력값은 폼 제출 전 1차 검증한다.
- 인증 정보와 사용자 식별 정보는 최소한으로 저장한다.
- HTML 삽입이 필요한 경우가 아니라면 `dangerouslySetInnerHTML`를 사용하지 않는다.
- 권한이 필요한 화면은 라우트 보호와 UI 보호를 함께 적용한다.

### 백엔드 연동 시

- 인증/인가 실패를 구분한다.
- 비밀번호, 토큰, 개인 식별 정보는 로그에 남기지 않는다.
- 입력 검증은 프론트와 백엔드 모두에서 수행한다.
- CORS, CSRF, 토큰 만료 정책은 운영 환경 기준으로 명확히 설정한다.

## 성능 최적화 가이드

- 큰 화면 컴포넌트는 필요 시 도메인 단위로 분리해 렌더링 책임을 줄인다.
- 필터링, 정렬, 파생 데이터 계산은 `useMemo` 또는 순수 함수로 정리한다.
- 리스트 렌더링에는 안정적인 key를 사용한다.
- 모달, 드롭다운, 스크롤 잠금 같은 브라우저 제어는 정리(cleanup)를 반드시 포함한다.
- 공통 컴포넌트의 과도한 prop 확장은 피하고, 역할이 커지면 컴포넌트를 분리한다.
- 불필요한 전역 상태 도입보다 컴포넌트 경계 정리를 우선한다.

## 품질 관리 체크리스트

코드 작성 또는 수정 후 다음 항목을 점검한다.

1. 기존 라우팅 흐름이 깨지지 않았는가
2. 로그인 여부에 따른 접근 제한이 유지되는가
3. 로딩, 에러, 빈 상태가 분리돼 있는가
4. 목업 데이터와 실제 API 전환 지점이 명확한가
5. 한글 주석이 의도를 설명하고 있는가
6. 공통 UI를 중복 작성하지 않았는가
7. Tailwind 클래스가 과도하게 비대해지지 않았는가
8. 직접 접근 URL과 화면 내 이동 경로가 모두 동작하는가
9. 깨진 문자열 인코딩이나 하드코딩 텍스트 문제가 없는가

## 문서 운영 규칙

- 실제 디렉토리 구조가 바뀌면 이 문서의 트리도 함께 갱신한다.
- 새로운 도메인이나 공통 규칙이 추가되면 먼저 이 문서에 기준을 반영한다.
- 프로젝트 실제 구현과 문서가 충돌하면, 문서를 바로 복붙 수정하지 말고 어떤 쪽이 최신 합의인지 먼저 확인한다.

## Git Commit 규칙

- 앞으로 모든 git commit 메시지는 한글로 작성한다.
- 커밋 메시지는 변경 의도가 바로 보이도록 간결하고 구체적으로 작성한다.
- 예시:
  - `해커톤 목록 API 명세 반영`
  - `팀원 모집 상세 모달 정리`

## Commit Message Convention Reference

### Format
- 기본 형식: `type: 작업 내용`
- 선택 형식: `type(scope): 작업 내용`

### Type
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `style`: UI / CSS 수정 (로직 변경 없음)
- `refactor`: 코드 구조 개선 (기능 변화 없음)
- `chore`: 설정 변경, 충돌 해결, 기타 작업
- `docs`: 문서 수정
- `test`: 테스트 코드 추가/수정

### 작성 규칙
- 타입은 영문 소문자로 작성한다.
- `:` 뒤에는 한 칸 띄운다.
- 작업 내용은 구체적으로 작성한다.
- `수정`, `작업`, `완료`처럼 의미가 모호한 표현은 사용하지 않는다.
- 하나의 커밋에는 하나의 작업만 포함한다.

### 예시
- `feat: mail 페이지 구현`
- `fix: 로그인 버튼 클릭 오류 수정`
- `style: 헤더 UI 간격 및 색상 수정`
- `refactor: mail 리스트 컴포넌트 분리`
- `chore: main 최신 내용 반영 및 충돌 해결`
- `docs: README 실행 방법 추가`

### 전략
- 커밋은 작고 명확하게 나눈다.
- 기능, 스타일, 리팩토링 작업을 한 커밋에 섞지 않는다.
- 충돌 해결은 별도의 커밋으로 처리한다.
