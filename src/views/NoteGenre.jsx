import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNoteStore } from "../stores/useNoteStore";
import { useChildStore } from "../stores/useChildStore";
import { useFamilyStore } from "../stores/useFamilyStore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  X as XIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
} from "lucide-react";

const NoteGenre = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const noteStore = useNoteStore();
  const childStore = useChildStore();
  const { selectedFamilyId } = useFamilyStore();
  const quillRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    child_id: childStore.selectedChildId,
    genre: genre,
    attachments: [],
    family_group_id: childStore.selectedChild?.family_group_id,
  });

  // ジャンル名のマッピング
  const genreNames = {
    kindergarten: "幼稚園・保育園",
    feeding: "授乳・ミルク",
    diaper: "おむつ替え",
    sleep: "寝かしつけ",
    play: "遊び方",
    food: "食事・離乳食",
    clothing: "着替え",
    bath: "お風呂",
    health: "健康",
    emergency: "緊急時対応",
    mood: "不機嫌時の対応",
    other: "その他",
  };

  // 現在のジャンル名を取得
  const currentGenreName = genreNames[genre] || "メモ";

  // ジャンルごとの説明文
  const genreDescriptions = {
    kindergarten:
      "幼稚園・保育園の準備や送り迎えのルーティンなどを記録しましょう！荷物の場所なども細かく記載するとわかりやすくなります。",
    feeding:
      "授乳時間やミルクの量、ミルクの種類などを記録しましょう！ミルクの場所なども記載するとわかりやすくなります。",
    diaper: "おむつ替えの仕方や普段のうんちの色などの記録しましょう！",
    sleep:
      "寝かしつけの方法や時間、寝かしつけ時のポイントなどを記録しましょう！",
    play: "どんなおもちゃが好きで普段どんな遊びをしているかなどをしましょう！",
    food: "食事の内容やレシピ、好き嫌いなどを記録しましょう！",
    clothing: "着替えの手順やポイント、収納場所などを記録しましょう！",
    bath: "お風呂の入れ方や注意点、お風呂上がりのケアなどを記録しましょう！",
    health: "体調が悪くなる時の合図や体調悪い時の対処法などを記録しましょう！",
    emergency: "何かあった時の緊急時の対応をを記録しましょう！",
    mood: "不機嫌な時に何をすれば機嫌が直るかなどを記録しましょう！",
    other: "育児に関するメモなどを自由に記録しましょう！",
  };

  // 現在のジャンルのメモを取得
  const notes = noteStore.getNotesByGenre(genre);
  console.log(notes, "Notes");

  // 画像ハンドラー
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (quillRef.current) {
            const quillInstance = quillRef.current.getEditor();
            const range = quillInstance.getSelection(true);
            quillInstance.insertEmbed(range.index, "image", e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  // Quillのツールバーオプション
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        ["image", "clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  // Quillのフォーマットオプション
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "image",
  ];

  const editNote = (note) => {
    setNoteForm({
      id: note.id,
      title: note.title,
      content: note.content,
      child_id: note.child_id,
      genre: genre,
    });
    setShowNewNoteForm(true);
    setSelectedNote(null);
  };

  const deleteNote = (id) => {
    if (confirm("このメモを削除してもよろしいですか？")) {
      noteStore.deleteNote(id);
      setSelectedNote(null);
    }
  };

  const saveNote = () => {
    console.log(noteForm, "noteForm");

    const noteData = {
      ...noteForm,
      childName: childStore.children.find((c) => c.id === noteForm.child_id)
        ?.name,
      family_group_id: selectedFamilyId,
      updatedAt: new Date().toISOString(),
    };

    if (noteForm.id) {
      noteStore.updateNote(noteForm.id, noteData);
    } else {
      noteStore.addNote(noteData);
    }

    setShowNewNoteForm(false);
    setNoteForm({
      title: "",
      content: "",
      child_id: childStore.selectedChildId,
      genre: genre,
      attachments: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <button
              onClick={() => navigate("/notes")}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-600"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">
              {currentGenreName}
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-600">
                <FilterIcon className="w-5 h-5" />
              </button>
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

        {/* メモ一覧 */}
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes
              .filter((note) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  note.title.toLowerCase().includes(query) ||
                  note.content.toLowerCase().includes(query)
                );
              })
              .map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className="bg-white rounded-2xl p-4 shadow-warm hover:shadow-warm-lg 
                            transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold mb-1">{note.title}</h3>
                      <span className="text-sm bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                        {note.childName}
                      </span>
                      <span className="text-sm text-gray-500 ml-3">
                        {new Date(note.updatedAt).toLocaleString("ja-JP", {
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12 px-6 text-gray-500">
              {genreDescriptions[genre] || "メモがありません"}
            </div>
          )}
        </div>

        {/* 新規メモ追加ボタン */}
        <button
          onClick={() => setShowNewNoteForm(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-primary-500 rounded-full shadow-lg
                        flex items-center justify-center text-white hover:bg-primary-600
                        hover:scale-105 active:scale-95 transition-all"
        >
          <PlusIcon className="w-6 h-6" />
        </button>

        {/* 新規メモ作成フォーム (モーダル) */}
        {showNewNoteForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-xl font-bold">新しいメモを作成</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowNewNoteForm(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveNote();
                }}
                className="modal-body space-y-4"
              >
                {/* タイトル */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) =>
                      setNoteForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="input w-full"
                    placeholder="タイトルを入力"
                    required
                  />
                </div>

                {/* 対象の子供 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    対象の子供
                  </label>
                  <select
                    value={noteForm.child_id || ""}
                    onChange={(e) =>
                      setNoteForm((prev) => ({
                        ...prev,
                        child_id: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  >
                    {childStore.children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* メモ内容 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メモ内容
                  </label>
                  <ReactQuill
                    forwardedRef={quillRef}
                    value={noteForm.content}
                    onChange={(content) =>
                      setNoteForm((prev) => ({ ...prev, content }))
                    }
                    modules={modules}
                    formats={formats}
                    className="bg-white rounded-lg"
                    placeholder="メモを入力してください"
                    theme="snow"
                  />
                </div>
              </form>

              <div className="modal-footer">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewNoteForm(false);
                      setNoteForm({
                        title: "",
                        content: "",
                        child_id: childStore.selectedChildId,
                        genre: genre,
                        attachments: [],
                      });
                    }}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    キャンセル
                  </button>
                  <button onClick={saveNote} className="btn btn-primary">
                    保存
                  </button>
                </div>
              </div>
            </div>
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
                  {new Date(selectedNote.updatedAt).toLocaleString("ja-JP")}
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
                    <p className="text-sm text-gray-500 mb-1">対象の子供</p>
                    <p className="font-medium">{selectedNote.childName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">メモ内容</p>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteGenre;
