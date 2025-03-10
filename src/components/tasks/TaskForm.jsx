import React, { useState, useRef, useEffect } from "react";
import {
  X as XIcon,
  Plus as PlusIcon,
  Play as PlayIcon,
  Search as SearchIcon,
} from "lucide-react";
import { useChildStore } from "../../stores/useChildStore";
import { useAuthStore } from "../../lib/auth";
import { useFamilyStore } from "../../stores/useFamilyStore";

const TaskForm = ({ initialData, notes, onSave, onCancel }) => {
  const [taskForm, setTaskForm] = useState({
    title: initialData?.title || "",
    checklist: initialData?.task_checklist || [],
    linkedNoteIds: initialData?.linkedNoteIds || [],
    attachments: initialData?.attachments || [],
    dueDate: initialData?.dueDate || "",
    dueTime: initialData?.dueTime || "",
    assignees: initialData?.task_assignees || [],
    priority: initialData?.priority || "medium",
    notes: initialData?.notes || "",
    reminder: initialData?.reminder || {
      beforeDay: false,
      onDay: false,
      beforeHour: false,
    },
  });
  const [isParent, setIsParent] = useState(false);
  const childStore = useChildStore();
  const authStore = useAuthStore();
  const familyStore = useFamilyStore();
  const selectedFamily = familyStore.families.find(
    (family) => family.id === familyStore.selectedFamilyId
  );
  console.log(selectedFamily, "families123");

  const [noteSearchQuery, setNoteSearchQuery] = useState("");
  const [showNoteDropdown, setShowNoteDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const fileInput = useRef(null);
  // const familyMembers = ["ママ", "パパ", "祖父母"];
  // 例: selectedFamily.family_membersが以下のような場合
  const familyMembers = selectedFamily?.family_members.map((member) => ({
    id: member.id, // IDを追加
    name: member.profiles.name, // 名前を追加
  }));
  // クリック外でドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNoteDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 検索クエリに基づいてメモをフィルタリング
  const filteredNotes = notes.filter((note) => {
    if (!noteSearchQuery) return true;
    return note.title.toLowerCase().includes(noteSearchQuery.toLowerCase());
  });

  // メモの選択を切り替える
  const toggleNote = (noteId) => {
    setTaskForm((prev) => {
      const newIds = prev.linkedNoteIds.includes(noteId)
        ? prev.linkedNoteIds.filter((id) => id !== noteId)
        : [...prev.linkedNoteIds, noteId];
      return { ...prev, linkedNoteIds: newIds };
    });
  };

  // 選択されたメモを削除
  const removeNote = (noteId) => {
    setTaskForm((prev) => ({
      ...prev,
      linkedNoteIds: prev.linkedNoteIds.filter((id) => id !== noteId),
    }));
  };

  const addChecklistItem = () => {
    setTaskForm((prev) => ({
      ...prev,
      checklist: [...prev.checklist, ""],
    }));
  };

  const removeChecklistItem = (index) => {
    setTaskForm((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index),
    }));
  };

  const triggerFileInput = () => {
    if (taskForm.attachments.length >= 5) {
      alert("添付ファイルは最大5つまでです");
      return;
    }
    fileInput.current?.click();
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const remainingSlots = 5 - taskForm.attachments.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTaskForm((prev) => ({
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
    setTaskForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const saveTask = () => {
    // 必須項目のバリデーション
    if (!taskForm.title?.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    // 日付と時間のバリデーション
    if (taskForm.dueTime && !taskForm.dueDate) {
      alert("時間を設定する場合は日付も設定してください");
      return;
    }

    // const processedData = {
    //   ...taskForm,
    //   familyGroupId: familyStore.selectedFamilyId,
    //   userId: authStore.user?.id,
    //   checklist:
    //     taskForm.checklist.length > 0
    //       ? taskForm.checklist
    //           .filter((item) =>
    //             typeof item === "string" ? item.trim() : item.text
    //           )
    //           .map((item) => (typeof item === "string" ? { text: item } : item))
    //       : [],
    // };

    const processedData = {
      ...taskForm,
      familyGroupId: familyStore.selectedFamilyId,
      userId: authStore.user?.id,
      checklist:
        taskForm.checklist.length > 0
          ? taskForm.checklist
              .filter((item) =>
                typeof item === "string" ? item.trim() : item.text
              )
              .map((item) => (typeof item === "string" ? { text: item } : item))
          : [],
      // assignees: taskForm.assignees.map((assignee) => assignee.id), // IDの配列に変更
    };
    onSave(processedData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="text-xl font-bold">
            {initialData ? "タスクを編集" : "新しいタスク"}
          </h3>
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveTask();
          }}
          className="modal-body space-y-4"
        >
          <div>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="input w-full text-lg"
              placeholder="タスクを入力"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              チェックリスト
            </label>
            <div className="space-y-2">
              {taskForm.checklist.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={typeof item === "string" ? item : item.text}
                    onChange={(e) => {
                      const newChecklist = [...taskForm.checklist];
                      if (typeof item === "string") {
                        newChecklist[index] = e.target.value;
                      } else {
                        newChecklist[index] = {
                          ...item,
                          text: e.target.value,
                        };
                      }
                      setTaskForm((prev) => ({
                        ...prev,
                        checklist: newChecklist,
                      }));
                    }}
                    className="input flex-1"
                    placeholder="チェックリストアイテムを入力"
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addChecklistItem}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl
                               text-gray-500 hover:border-primary-300 hover:text-primary-600
                               transition-colors"
              >
                <PlusIcon className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              参考メモ
            </label>
            <div className="relative" ref={dropdownRef}>
              <div className="flex flex-wrap gap-2 mb-2">
                {taskForm.linkedNoteIds.map((noteId) => {
                  const note = notes.find((n) => n.id === noteId);
                  if (!note) return null;
                  return (
                    <div
                      key={noteId}
                      className="bg-primary-50 text-primary-700 px-2 py-1 rounded-lg 
                                  flex items-center space-x-1"
                    >
                      <span>{note.title}</span>
                      <button
                        type="button"
                        onClick={() => removeNote(noteId)}
                        className="p-0.5 hover:text-red-500"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={noteSearchQuery}
                  onChange={(e) => {
                    setNoteSearchQuery(e.target.value);
                    setShowNoteDropdown(true);
                  }}
                  onFocus={() => setShowNoteDropdown(true)}
                  className="input w-full pl-10"
                  placeholder="メモを検索..."
                />
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {showNoteDropdown && (
                <div
                  className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg 
                               border border-gray-200 max-h-60 overflow-y-auto"
                >
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => {
                          toggleNote(note.id);
                          setNoteSearchQuery("");
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                          taskForm.linkedNoteIds.includes(note.id)
                            ? "bg-primary-50 text-primary-700"
                            : ""
                        }`}
                      >
                        {note.title}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      メモが見つかりません
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              添付ファイル
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {taskForm.attachments.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type.startsWith("image/") ? (
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg text-red-500 hover:text-red-600"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : file.type.startsWith("video/") ? (
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <video
                          src={file.url}
                          className="w-full h-full object-cover"
                        />
                        <PlayIcon
                          className="w-8 h-8 text-white absolute top-1/2 left-1/2 
                                        -translate-x-1/2 -translate-y-1/2"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg text-red-500 hover:text-red-600"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl
                               text-gray-500 hover:border-primary-300 hover:text-primary-600
                               transition-colors"
              >
                <PlusIcon className="w-4 h-4 mx-auto" />
              </button>
              <input
                type="file"
                ref={fileInput}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                multiple
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                期日
              </label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) =>
                  setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                時間
              </label>
              <input
                type="time"
                value={taskForm.dueTime}
                onChange={(e) =>
                  setTaskForm((prev) => ({ ...prev, dueTime: e.target.value }))
                }
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              担当者
            </label>
            <div className="space-y-2">
              {familyMembers.map((member) => (
                <label key={member.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={taskForm.assignees.some(
                      (assignee) => assignee.user_id === member.id
                    )} // IDでチェック
                    onChange={(e) => {
                      if (e.target.checked) {
                        // チェックされた場合、配列にオブジェクトを追加
                        setTaskForm((prev) => ({
                          ...prev,
                          assignees: [
                            ...prev.assignees,
                            { user_id: member.id, name: member.name },
                          ],
                        }));
                      } else {
                        // チェックを外された場合、配列からオブジェクトを削除
                        setTaskForm((prev) => ({
                          ...prev,
                          assignees: prev.assignees.filter(
                            (assignee) => assignee.user_id !== member.id
                          ),
                        }));
                      }
                    }}
                    className="input"
                  />
                  <span>{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              優先度
            </label>
            <select
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="input w-full"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              詳細メモ
            </label>
            <textarea
              value={taskForm.notes}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="input w-full h-24 resize-none"
              placeholder="タスクの詳細な指示、注意点、準備物など"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              リマインダー
            </label>
            <div className="space-y-2">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={taskForm.reminder.beforeDay}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        reminder: {
                          ...prev.reminder,
                          beforeDay: e.target.checked,
                        },
                      }))
                    }
                    className="input"
                  />
                  <span>前日に通知</span>
                </label>
                {taskForm.reminder.beforeDay && (
                  <input
                    type="time"
                    value={taskForm.reminder.beforeDayTime || ""}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        reminder: {
                          ...prev.reminder,
                          beforeDayTime: e.target.value,
                        },
                      }))
                    }
                    className="input mt-2 ml-6"
                    required
                  />
                )}
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={taskForm.reminder.onDay}
                  onChange={(e) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      reminder: {
                        ...prev.reminder,
                        onDay: e.target.checked,
                      },
                    }))
                  }
                  className="input"
                />
                <span>当日に通知</span>
              </label>
              {taskForm.reminder.onDay && (
                <input
                  type="time"
                  value={taskForm.reminder.onDayTime || ""}
                  onChange={(e) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      reminder: {
                        ...prev.reminder,
                        onDayTime: e.target.value,
                      },
                    }))
                  }
                  className="input mt-2 ml-6"
                  required
                />
              )}
            </div>
          </div>
        </form>

        <div className="modal-footer">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              キャンセル
            </button>
            <button onClick={() => saveTask()} className="btn btn-primary">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
