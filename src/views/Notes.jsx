import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChildStore } from "../stores/useChildStore";
import HeaderNotification from "../components/common/HeaderNotification";
import {
  Plus as PlusIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  ArrowLeft as ArrowLeftIcon,
  Search as SearchIcon,
  Baby as BabyIcon,
  Moon as MoonIcon,
  Smile as SmileIcon,
  Utensils as UtensilsIcon,
  Shirt as ShirtIcon,
  ShowerHead as ShowerHeadIcon,
  HeartPulse as HeartPulseIcon,
  Siren as SirenIcon,
  FileText as FileTextIcon,
  GraduationCap as GraduationCapIcon,
  Diameter as DiaperIcon,
  Trees as TreeIcon,
  Home as HomeIcon,
  Frown as FrownIcon,
  X as XIcon,
} from "lucide-react";
import { useNoteStore } from "../stores/useNoteStore";
import { useFamilyStore } from "../stores/useFamilyStore";

const Notes = () => {
  const navigate = useNavigate();
  const {
    noteSettings,
    loading,
    error,
    getNoteSettings,
    notes,
    updateNoteSetting,
    getNotesByGenre,
    getNotes,
  } = useNoteStore();
  const { selectedFamilyId } = useFamilyStore();

  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showGenreSettings, setShowGenreSettings] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [selectedChildFilter, setSelectedChildFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [fileInput, setFileInput] = useState(null);

  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    childId: "",
    attachments: [],
  });

  // const notes = getNotes(selectedFamilyId);

  // getNotes;

  const childStore = useChildStore();
  const children = childStore.children;

  const genres = [
    { id: 1, name: "幼稚園・保育園", icon: GraduationCapIcon },
    { id: 2, name: "授乳・ミルク", icon: BabyIcon },
    { id: 3, name: "おむつ替え", icon: DiaperIcon },
    { id: 4, name: "寝かしつけ", icon: MoonIcon },
    {
      id: 5,
      name: "遊び方",
      icon: SmileIcon,
      subCategories: ["年齢別", "室内遊び", "外遊び"],
    },
    {
      id: 6,
      name: "食事・離乳食",
      icon: UtensilsIcon,
      subCategories: ["レシピ", "アレルギー対応"],
    },
    { id: 7, name: "着替え", icon: ShirtIcon },
    { id: 8, name: "お風呂", icon: ShowerHeadIcon },
    {
      id: 9,
      name: "健康",
      icon: HeartPulseIcon,
      subCategories: ["発熱", "咳", "嘔吐"],
    },
    {
      id: 10,
      name: "緊急時対応",
      icon: SirenIcon,
      subCategories: ["発熱時", "けいれん時", "誤飲時"],
    },
    {
      id: 11,
      name: "不機嫌時の対応",
      icon: FrownIcon,
      subCategories: ["ぐずり", "かんしゃく", "睡眠不足"],
    },
    { id: 12, name: "その他", icon: FileTextIcon },
  ];

  // 表示するジャンルのID一覧
  // const [visibleGenreIds, setVisibleGenreIds] = useState(
  //   genres.map((g) => g.id)
  // );

  const [visibleGenreIds, setVisibleGenreIds] = useState(
    getNoteSettings(selectedFamilyId)[0].visibleGenreIds
  );

  // 表示するジャンルの設定
  const visibleGenres = genres.filter((g) => {
    // console.log("Current Notes:", notes);
    // console.log("Search Query:", searchQuery);
    if (!visibleGenreIds.includes(g.id)) return false;
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    // console.log("called", visibleGenreIds);
    // ジャンル名で検索
    // if (g.name.toLowerCase().includes(query)) return true;
    // ジャンルに属するメモの内容で検索
    const genreNotes = getNotes.filter((note) => note.genreId === g.id);
    console.log(genreNotes, "Search Query");

    return genreNotes.some(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
    // notes.filter((note) => {
    //   if (!searchQuery) return true;
    //   const query = searchQuery.toLowerCase();
    //   return (
    //     note.title.toLowerCase().includes(query) ||
    //     note.content.toLowerCase().includes(query)
    //   );
    // });
    // return (
    //   note.title.toLowerCase().includes(query) ||
    //   note.content.toLowerCase().includes(query)
    // );
  });

  // const notes = [
  //   {
  //     id: 1,
  //     genreId: 6,
  //     childId: 1,
  //     childName: "山田太郎",
  //     title: "離乳食の進め方",
  //     content:
  //       "7ヶ月目の離乳食は、1日2回。\n野菜を中心に、少しずつ魚や豆腐も取り入れています。\n食べる量は様子を見ながら調整してください。",
  //     updatedAt: "2024-02-15T10:00:00Z",
  //   },
  //   {
  //     id: 2,
  //     genreId: 4,
  //     childId: 1,
  //     childName: "山田太郎",
  //     title: "就寝時の注意点",
  //     content:
  //       "寝かしつけは20:00から始めます。\nお気に入りの音楽を流しながら、絵本を読んであげると落ち着きます。",
  //     updatedAt: "2024-02-14T15:30:00Z",
  //   },
  // ];

  // const notes = getNotesByGenre(genre);

  console.log(notes, "Generation");

  const selectGenre = (genre) => {
    // ジャンルに応じて適切なパスに遷移
    switch (genre.id) {
      case 1: // 幼稚園・保育園
        navigate("/notes/kindergarten");
        break;
      case 2: // 授乳・ミルク
        navigate("/notes/feeding");
        break;
      case 3: // おむつ替え
        navigate("/notes/diaper");
        break;
      case 4: // 寝かしつけ
        navigate("/notes/sleep");
        break;
      case 5: // 遊び方
        navigate("/notes/play");
        break;
      case 6: // 食事・離乳食
        navigate("/notes/food");
        break;
      case 7: // 着替え
        navigate("/notes/clothing");
        break;
      case 8: // お風呂
        navigate("/notes/bath");
        break;
      case 9: // 健康
        navigate("/notes/health");
        break;
      case 10: // 緊急時対応
        navigate("/notes/emergency");
        break;
      case 11: // 不機嫌時の対応
        navigate("/notes/mood");
        break;
      case 12: // その他
        navigate("/notes/other");
        break;
      default:
        break;
    }
  };

  const backToGenres = () => {
    setSelectedGenreId(null);
    setSelectedGenre(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const editNote = (note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      childId: note.childId,
      attachments: note.attachments || [],
    });
    setShowNewNoteForm(true);
    setSelectedNote(null);
  };

  const deleteNote = (id) => {
    if (confirm("このメモを削除してもよろしいですか？")) {
      // TODO: メモの削除処理
    }
  };

  const saveNote = () => {
    if (editingNote) {
      // TODO: メモの更新処理
    } else {
      // TODO: 新規メモの追加処理
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setShowNewNoteForm(false);
    setEditingNote(null);
    setNoteForm({
      title: "",
      content: "",
      childId: "",
      attachments: [],
    });
  };

  const triggerFileInput = () => {
    if (noteForm.attachments.length >= 5) {
      alert("添付ファイルは最大5つまでです");
      return;
    }
    fileInput?.click();
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const remainingSlots = 5 - noteForm.attachments.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNoteForm((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              name: file.name,
              type: file.type,
              url: e.target.result,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const removeAttachment = (index) => {
    setNoteForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <div className="w-10"></div>
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">
              育児メモ
            </h1>
            <div className="flex items-center">
              <HeaderNotification />
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-16">
        {/* 検索欄 */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="メモを検索..."
            className="input w-full pl-10 py-3"
          />
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* ジャンル一覧 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visibleGenres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => selectGenre(genre)}
              className="w-full bg-white rounded-2xl p-6 shadow-warm hover:shadow-warm-lg 
                             transition-all duration-300 group text-left"
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-xl bg-primary-50 
                             flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  {React.createElement(genre.icon, {
                    className: "w-6 h-6 text-primary-500",
                  })}
                </div>
                {selectedChildFilter && (
                  <span className="text-xs text-gray-500 mt-2">
                    {children.find((c) => c.id === selectedChildFilter)?.name}
                  </span>
                )}
                <h3 className="text-sm font-medium text-center mt-2">
                  {genre.name}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {/* メモ一覧 */}
        {selectedGenre && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={backToGenres}
                className="flex items-center text-gray-600 hover:text-primary-600"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                <span>戻る</span>
              </button>
              <div>
                <button
                  onClick={() => setShowNewNoteForm(true)}
                  className="p-2 hover:bg-gray-100 rounded-xl text-primary-600"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {notes
              .filter((note) => note.genreId === selectedGenre.id)
              .map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className="bg-white rounded-2xl p-4 shadow-warm hover:shadow-warm-lg 
                            transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{note.title}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(note.updatedAt)}
                      </p>
                      {note.childName && (
                        <span className="text-sm bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full mt-2 inline-block">
                          {note.childName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* メモ詳細モーダル */}
      {selectedNote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{selectedNote.title}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(selectedNote.updatedAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => editNote(selectedNote)}
                  className="p-2 text-gray-400 hover:text-primary-500"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="modal-body">
              <div className="space-y-4">
                {selectedNote.childName && (
                  <div>
                    <p className="text-sm text-gray-500">対象の子供</p>
                    <p className="font-medium">{selectedNote.childName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">メモ内容</p>
                  <p className="whitespace-pre-wrap">{selectedNote.content}</p>
                </div>
                {selectedNote.attachments?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">添付ファイル</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNote.attachments.map((file, index) => (
                        <div key={index} className="relative group">
                          {file.type.startsWith("image/") && (
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
