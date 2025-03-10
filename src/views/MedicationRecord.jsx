import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChildStore } from "../stores/useChildStore";
import { useHealthStore } from "../stores/useHealthStore";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import {
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
  X as XIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Link as LinkIcon,
} from "lucide-react";

const MedicationRecord = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [showNewMedicationForm, setShowNewMedicationForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const childStore = useChildStore();
  const healthStore = useHealthStore();
  const selectedChild = childStore.children.find(
    (child) => child.id === childStore.selectedChildId
  );

  // 病気記録を取得
  const illnesses = healthStore
    .getChildIllnesses(childStore.selectedChildId)
    ?.filter((illness) => !illness.endDate); // 治療中の病気のみ

  const [medicationForm, setMedicationForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    timing: "",
    notes: "",
    illnessId: "",
  });

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "M月d日(E)", { locale: ja });
  };

  const editMedication = (medication) => {
    setEditingMedication(medication);
    setMedicationForm({
      ...medication,
      reminder: medication.reminder || {
        beforeDay: false,
        onDay: false,
        beforeHour: false,
      },
    });
    setShowNewMedicationForm(true);
    setSelectedMedication(null);
  };

  const deleteMedication = (id) => {
    if (confirm("この服薬記録を削除してもよろしいですか？")) {
      healthStore.deleteMedication(id);
      setSelectedMedication(null);
    }
  };

  const saveMedication = () => {
    if (editingMedication) {
      healthStore.updateMedication(editingMedication.id, {
        ...medicationForm,
        child_id: childStore.selectedChildId,
      });
    } else {
      healthStore.addMedication({
        ...medicationForm,
        child_id: childStore.selectedChildId,
      });
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setShowNewMedicationForm(false);
    setEditingMedication(null);
    setMedicationForm({
      name: "",
      startDate: "",
      endDate: "",
      timing: "",
      notes: "",
      illnessId: "",
    });
  };

  // 全ての服薬記録を取得
  const medications = healthStore.getChildMedications(
    childStore.selectedChildId
  );

  // 服薬中と服薬済みに分類
  const filteredMedications = medications
    ?.filter((med) => {
      const now = new Date();
      const isActive = !med.endDate || new Date(med.endDate) >= now;
      return activeTab === "active" ? isActive : !isActive;
    })
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  console.log(medications, "medications");

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
            服薬記録
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24">
        {/* 新規服薬記録ボタン */}
        <button
          onClick={() => setShowNewMedicationForm(true)}
          className="w-full btn bg-white text-primary-600 border-2 border-primary-200 
                         hover:bg-primary-50 hover:border-primary-300 hover:scale-[1.02]
                         transition-all duration-300 group flex items-center justify-center mb-6"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          新しい服薬を記録
        </button>

        {/* タブ切り替え */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            服薬中
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTab === "completed"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            服薬済み
          </button>
        </div>

        {/* 服薬記録一覧 */}
        <div className="space-y-4">
          {filteredMedications.length > 0 ? (
            filteredMedications.map((medication) => (
              <div
                key={medication.id}
                onClick={() => setSelectedMedication(medication)}
                className="bg-white rounded-2xl p-4 shadow-warm hover:shadow-warm-lg 
                          transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{medication.name}</h3>
                    {medication.illnessId && (
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        <span>
                          病名:{" "}
                          {
                            illnesses.find((i) => i.id === medication.illnessId)
                              ?.name
                          }
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {formatDate(medication.startDate)}
                      {medication.endDate &&
                        ` 〜 ${formatDate(medication.endDate)}`}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              {activeTab === "active"
                ? "服薬中の薬はありません"
                : "服薬済みの薬はありません"}
            </div>
          )}
        </div>

        {/* 服薬記録フォーム (モーダル) */}
        {showNewMedicationForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="text-xl font-bold">
                  {editingMedication ? "服薬記録を編集" : "新しい服薬を記録"}
                </h3>
                <button
                  onClick={cancelEdit}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveMedication();
                }}
                className="modal-body space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    関連する病気
                  </label>
                  <select
                    value={medicationForm.illnessId}
                    onChange={(e) =>
                      setMedicationForm((prev) => ({
                        ...prev,
                        illnessId: e.target.value,
                      }))
                    }
                    className="input w-full"
                  >
                    <option value="">選択してください</option>
                    {illnesses.map((illness) => (
                      <option key={illness.id} value={illness.id}>
                        {illness.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    薬の名前
                  </label>
                  <input
                    type="text"
                    value={medicationForm.name}
                    onChange={(e) =>
                      setMedicationForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      開始日
                    </label>
                    <input
                      type="date"
                      value={medicationForm.startDate}
                      onChange={(e) =>
                        setMedicationForm((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      終了日
                    </label>
                    <input
                      type="date"
                      value={medicationForm.endDate}
                      onChange={(e) =>
                        setMedicationForm((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    服用量・服用タイミング
                  </label>
                  <input
                    type="text"
                    value={medicationForm.timing}
                    onChange={(e) =>
                      setMedicationForm((prev) => ({
                        ...prev,
                        timing: e.target.value,
                      }))
                    }
                    className="input w-full"
                    placeholder="例: 毎食後1袋"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メモ
                  </label>
                  <textarea
                    value={medicationForm.notes}
                    onChange={(e) =>
                      setMedicationForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="input w-full h-24 resize-none"
                    placeholder="服用時の注意点など"
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
                  <button onClick={saveMedication} className="btn btn-primary">
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 服薬詳細モーダル */}
        {selectedMedication && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedMedication.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedMedication.startDate)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => editMedication(selectedMedication)}
                    className="p-2 text-gray-400 hover:text-primary-500"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMedication(selectedMedication.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedMedication(null)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="modal-body space-y-4">
                {selectedMedication.illnessId &&
                  illnesses.find((i) => i.id === selectedMedication.illnessId)
                    ?.name && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        病名
                      </p>
                      <p className="font-medium flex items-center">
                        <LinkIcon className="w-4 h-4 mr-1 text-gray-500" />
                        {illnesses.find(
                          (i) => i.id === selectedMedication.illnessId
                        )?.name || "不明"}
                      </p>
                    </div>
                  )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    服用期間
                  </p>
                  <div className="flex items-center text-gray-900">
                    <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
                    {formatDate(selectedMedication.startDate)}
                    {selectedMedication.endDate && (
                      <>
                        <span className="mx-2">〜</span>
                        {formatDate(selectedMedication.endDate)}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    服用量・服用タイミング
                  </p>
                  <p className="font-medium">{selectedMedication.timing}</p>
                </div>

                {selectedMedication.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      メモ
                    </p>
                    <p className="font-medium whitespace-pre-wrap">
                      {selectedMedication.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicationRecord;
