import MainCard from "../components/MainCard";
import hackathonSearch from "../assets/HackathonSearchImage.png";
import teambuild from "../assets/TeamBuildImage.png";
import ranking from "../assets/RankingImage.png";

const Home = () => {
  const cardData = [
    {
      title: "해커톤 탐색",
      description: `당신의 열정을 불태울 최신 해커톤 소식을 확인하세요. 분야별, 일정별로 나에게 딱 맞는
      대회를 찾을 수 있습니다.`,
      path: "/hackathons",
      imageUrl: hackathonSearch,
    },
    {
      title: "팀 빌딩 & 모집",
      description: `혼자 고민하지 마세요.
      함께 성장하고 승리할 팀원을 찾거나 직접 팀을 생성하여 시너지를 만들어보세요.`,
      path: "/teams",
      imageUrl: teambuild,
    },
    {
      title: "랭킹 & 성과",
      description: `실시간으로 업데이트되는 랭킹을 확인하고 나의 성장 지표를 관리하세요.
      우수한 성과는 당신의 커리어가 됩니다.`,
      path: "/ranking",
      imageUrl: ranking,
    },
  ];

  return (
    <main className="flex flex-col items-center py-24 px-6 bg-[#F8FAFC] min-h-[calc(100vh-320px)]">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
        Hackathon Platform
      </h1>
      <p className="text-3xl font-medium text-gray-700 mb-20">
        꿈꾸던 아이디어를 현실로 만드세요. 최적의 팀과 프로젝트가 당신을 기다립니다.
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
