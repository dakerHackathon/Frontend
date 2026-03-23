import MainCard from "../components/MainCard";

const Home = () => {
  const cardData = [
    {
      title: "해커톤 목록 페이지로 이동",
      description: "해커톤 이미지와 설명이 들어갈 곳",
      path: "/hackathons",
    },
    {
      title: "팀원 모집 & 팀 리스트 생성",
      description: "팀원 모집 & 팀 생성 디자인",
      path: "/teams",
    },
    { title: "랭킹 보기", description: "랭킹 목록 디자인", path: "/ranking" },
  ];

  return (
    <main className="flex flex-col items-center py-24 px-6 bg-[#F8FAFC] min-h-[calc(100vh-320px)]">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
        Hackathon Platform
      </h1>
      <p className="text-3xl font-medium text-gray-700 mb-20">
        여기에 이게 무슨 페이지인지 아니면 동기부여 글
      </p>

      <div className="flex flex-wrap justify-center gap-10 w-full max-w-7xl">
        {cardData.map((card, idx) => (
          <MainCard key={idx} {...card} />
        ))}
      </div>
    </main>
  );
};

export default Home;
