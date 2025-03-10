import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  BabyIcon,
  MoonIcon,
  SmileIcon,
  UtensilsIcon,
  ShirtIcon,
  ShowerHeadIcon,
  HeartPulseIcon,
  SirenIcon,
  FileTextIcon,
  GraduationCap as GraduationCapIcon,
  Diameter as DiaperIcon,
  Trees as TreeIcon,
  HomeIcon,
  FrownIcon,
} from "lucide-react";
import { useNoteStore } from "../stores/useNoteStore";
import { useFamilyStore } from "../stores/useFamilyStore";

const NoteSettings = () => {
  const navigate = useNavigate();
  const { noteSettings, loading, error, getNoteSettings, updateNoteSetting } =
    useNoteStore();
  const { selectedFamilyId } = useFamilyStore();
  // ページマウント時に一番上にスクロール
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ジャンル一覧
  const genres = [
    {
      id: 1,
      name: "幼稚園・保育園",
      icon: GraduationCapIcon,
      color: "primary",
    },
    { id: 2, name: "授乳・ミルク", icon: BabyIcon, color: "blue" },
    { id: 3, name: "おむつ替え", icon: DiaperIcon, color: "yellow" },
    { id: 4, name: "寝かしつけ", icon: MoonIcon, color: "indigo" },
    { id: 5, name: "遊び方", icon: SmileIcon, color: "pink" },
    { id: 6, name: "食事・離乳食", icon: UtensilsIcon, color: "orange" },
    { id: 7, name: "着替え", icon: ShirtIcon, color: "purple" },
    { id: 8, name: "お風呂", icon: ShowerHeadIcon, color: "cyan" },
    { id: 9, name: "健康", icon: HeartPulseIcon, color: "red" },
    { id: 10, name: "緊急時対応", icon: SirenIcon, color: "rose" },
    { id: 11, name: "不機嫌時の対応", icon: FrownIcon, color: "amber" },
    { id: 12, name: "その他", icon: FileTextIcon, color: "gray" },
  ];

  // 表示するジャンルのID一覧
  const [visibleGenreIds, setVisibleGenreIds] = useState(
    getNoteSettings(selectedFamilyId)[0].visibleGenreIds
  );
  const getGenreIconClass = (genre) => {
    const colorMap = {
      primary: "bg-primary-50 text-primary-500",
      blue: "bg-blue-50 text-blue-500",
      yellow: "bg-yellow-50 text-yellow-500",
      indigo: "bg-indigo-50 text-indigo-500",
      pink: "bg-pink-50 text-pink-500",
      orange: "bg-orange-50 text-orange-500",
      purple: "bg-purple-50 text-purple-500",
      cyan: "bg-cyan-50 text-cyan-500",
      red: "bg-red-50 text-red-500",
      rose: "bg-rose-50 text-rose-500",
      amber: "bg-amber-50 text-amber-500",
      gray: "bg-gray-50 text-gray-500",
    };
    return colorMap[genre.color];
  };

  const isGenreVisible = (genreId) => {
    return visibleGenreIds.includes(genreId);
  };

  const toggleGenreVisibility = (genreId) => {
    if (isGenreVisible(genreId)) {
      setVisibleGenreIds(visibleGenreIds.filter((id) => id !== genreId));
      const visibleGenreData = visibleGenreIds.filter((id) => id !== genreId);
      updateNoteSetting(getNoteSettings(selectedFamilyId)[0].id, {
        visibleGenreIds: visibleGenreData,
      });
      console.log(visibleGenreData, "visibleGenreIds11");
    } else {
      setVisibleGenreIds([...visibleGenreIds, genreId]);
      const visibleGenreData = [...visibleGenreIds, genreId];
      updateNoteSetting(getNoteSettings(selectedFamilyId)[0].id, {
        visibleGenreIds: visibleGenreData,
      });
      console.log(visibleGenreData, "visibleGenreIds22");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-600"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">
              育児メモ設定
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-16">
        {/* ジャンル表示設定 */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">表示するジャンル</h2>
          <div className="space-y-3">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${getGenreIconClass(genre)}`}>
                    {React.createElement(genre.icon, { className: "w-5 h-5" })}
                  </div>
                  <span className="font-medium">{genre.name}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGenreVisible(genre.id)}
                    onChange={() => toggleGenreVisibility(genre.id)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                peer-focus:ring-primary-100 rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:border-gray-300 after:border after:rounded-full 
                                after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"
                  ></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoteSettings;
