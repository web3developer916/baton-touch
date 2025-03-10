import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import {
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  X as XIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChildStore } from "../stores/useChildStore";
import { useHealthStore } from "../stores/useHealthStore";

const CheckupRecord = () => {
  const navigate = useNavigate();
  const [showNewCheckupForm, setShowNewCheckupForm] = useState(false);
  const [editingCheckup, setEditingCheckup] = useState(null);
  const [selectedCheckup, setSelectedCheckup] = useState(null);

  const [checkupForm, setCheckupForm] = useState({
    type: "",
    date: "",
    height: "",
    weight: "",
    location: "",
    findings: "",
    nextAppointment: "",
  });

  const childStore = useChildStore();
  const healthStore = useHealthStore();

  const checkups = healthStore.getChildCheckups(childStore.selectedChildId);

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "M月d日(E)", { locale: ja });
  };

  const editCheckup = (checkup) => {
    setEditingCheckup(checkup);
    setCheckupForm({ ...checkup });
    setShowNewCheckupForm(true);
    setSelectedCheckup(null);
  };

  const deleteCheckup = (id) => {
    if (confirm("この検診記録を削除してもよろしいですか？")) {
      healthStore.deleteCheckup(id);
      setSelectedCheckup(null);
    }
  };

  const saveCheckup = () => {
    if (editingCheckup) {
      healthStore.updateCheckup(editingCheckup.id, {
        ...checkupForm,
        child_id: childStore.selectedChildId,
      });
    } else {
      healthStore.addCheckup({
        ...checkupForm,
        child_id: childStore.selectedChildId,
      });
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setShowNewCheckupForm(false);
    setEditingCheckup(null);
    setCheckupForm({
      type: "",
      date: "",
      height: "",
      weight: "",
      location: "",
      findings: "",
      nextAppointment: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">
            定期検診記録
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24">
        {/* 新規記録ボタン */}
        <button
          onClick={() => setShowNewCheckupForm(true)}
          className="w-full btn bg-white text-primary-600 border-2 border-primary-200 
                         hover:bg-primary-50 hover:border-primary-300 hover:scale-[1.02]
                         transition-all duration-300 group flex items-center justify-center mb-6"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          新しい検診を記録
        </button>

        {/* 記録一覧 */}
        <div className="space-y-4">
          {checkups.map((checkup) => (
            <div
              key={checkup.id}
              onClick={() => setSelectedCheckup(checkup)}
              className="bg-white rounded-2xl p-4 shadow-warm hover:shadow-warm-lg 
                          transition-all cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900">{checkup.type}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(checkup.date)}
                  </p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* 詳細モーダル */}
        {selectedCheckup && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h3 className="text-xl font-bold">{selectedCheckup.type}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedCheckup.date)}
                  </p>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => editCheckup(selectedCheckup)}
                    className="p-2 text-gray-400 hover:text-primary-500"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCheckup(selectedCheckup.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedCheckup(null)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">身長</p>
                    <p className="font-medium">{selectedCheckup.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">体重</p>
                    <p className="font-medium">{selectedCheckup.weight} kg</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">検診場所</p>
                    <p className="font-medium">{selectedCheckup.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">所見</p>
                    <p className="whitespace-pre-wrap">
                      {selectedCheckup.findings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 新規検診フォーム (モーダル) */}
        {showNewCheckupForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="text-xl font-bold">
                  {editingCheckup ? "検診記録を編集" : "新しい検診を記録"}
                </h3>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveCheckup();
                }}
                className="modal-body space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    検診の種類
                  </label>
                  <input
                    type="text"
                    value={checkupForm.type}
                    onChange={(e) =>
                      setCheckupForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    placeholder="例: 1ヶ月健診"
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    検診日
                  </label>
                  <input
                    type="date"
                    value={checkupForm.date}
                    onChange={(e) =>
                      setCheckupForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      身長 (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={checkupForm.height}
                      onChange={(e) =>
                        setCheckupForm((prev) => ({
                          ...prev,
                          height: e.target.value,
                        }))
                      }
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      体重 (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={checkupForm.weight}
                      onChange={(e) =>
                        setCheckupForm((prev) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }
                      className="input w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    検診場所
                  </label>
                  <input
                    type="text"
                    value={checkupForm.location}
                    onChange={(e) =>
                      setCheckupForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    所見
                  </label>
                  <textarea
                    value={checkupForm.findings || ""}
                    onChange={(e) =>
                      setCheckupForm((prev) => ({
                        ...prev,
                        findings: e.target.value,
                      }))
                    }
                    className="input w-full h-24 resize-none"
                    placeholder="所見や気になる点などを記録"
                  ></textarea>
                </div>
              </form>

              <div className="modal-footer">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    キャンセル
                  </button>
                  <button onClick={saveCheckup} className="btn btn-primary">
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckupRecord;
