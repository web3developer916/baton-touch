import React, { useState, useRef } from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Plus as PlusIcon,
  X as XIcon,
  ChevronRight as ChevronRightIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
} from "lucide-react";

const VaccinationRecord = ({
  records,
  birthDate,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [showNewVaccinationForm, setShowNewVaccinationForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [recordForm, setRecordForm] = useState({
    vaccines: [""],
    date: "",
    doctor: "",
    location: "",
    notes: "",
    reminder: {
      beforeDay: false,
      onDay: false,
      beforeHour: false,
    },
  });

  const groupedRecords = records.reduce((groups, record) => {
    const year = format(parseISO(record.date), "yyyy");
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(record);
    return groups;
  }, {});

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "M月d日(E)", { locale: ja });
  };

  const showDetails = (record) => {
    setSelectedRecord(record);
  };

  const addVaccine = () => {
    setRecordForm((prev) => ({
      ...prev,
      vaccines: [...prev.vaccines, ""],
    }));
  };

  const removeVaccine = (index) => {
    setRecordForm((prev) => {
      const newVaccines = [...prev.vaccines];
      newVaccines.splice(index, 1);
      if (newVaccines.length === 0) {
        newVaccines.push("");
      }
      return {
        ...prev,
        vaccines: newVaccines,
      };
    });
  };

  const editRecord = (record) => {
    setEditingRecord(record);
    setRecordForm({
      ...record,
      reminder: record.reminder || {
        beforeDay: false,
        onDay: false,
        beforeHour: false,
      },
    });
    setShowNewVaccinationForm(true);
    setSelectedRecord(null);
  };

  const deleteRecord = (id) => {
    if (confirm("この記録を削除してもよろしいですか？")) {
      onDelete(id);
      setSelectedRecord(null);
    }
  };

  const saveRecord = () => {
    if (editingRecord) {
      onUpdate(editingRecord.id, recordForm);
    } else {
      onAdd(recordForm);
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setShowNewVaccinationForm(false);
    setEditingRecord(null);
    setRecordForm({
      vaccines: [""],
      date: "",
      doctor: "",
      location: "",
      notes: "",
      reminder: {
        beforeDay: false,
        onDay: false,
        beforeHour: false,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* 新規記録ボタン */}
      <button
        onClick={() => setShowNewVaccinationForm(true)}
        className="w-full btn bg-white text-primary-600 border-2 border-primary-200 
                         hover:bg-primary-50 hover:border-primary-300 hover:scale-[1.02]
                         transition-all duration-300 group flex items-center justify-center"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        新しい予防接種を記録
      </button>

      {/* 接種履歴 */}
      <div className="space-y-4 mt-6">
        {Object.entries(groupedRecords).map(([year, group]) => (
          <div key={year} className="card">
            <h4 className="text-base font-bold text-gray-500 mb-4">{year}年</h4>

            <div className="space-y-3">
              {group.map((record) => (
                <div
                  key={record.id}
                  onClick={() => showDetails(record)}
                  className="bg-white rounded-2xl p-4 shadow-warm hover:shadow-warm-lg 
                              transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {record.vaccines.join("・")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(record.date)}
                      </p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 詳細モーダル */}
      {selectedRecord && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">
                  {selectedRecord.vaccines.join("・")}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(selectedRecord.date)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editRecord(selectedRecord)}
                  className="p-2 text-gray-400 hover:text-primary-500"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteRecord(selectedRecord.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="modal-body space-y-4">
              <div>
                <p className="text-sm text-gray-500">接種場所</p>
                <p className="font-medium">{selectedRecord.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">接種医</p>
                <p className="font-medium">{selectedRecord.doctor}</p>
              </div>
              {selectedRecord.notes && (
                <div>
                  <p className="text-sm text-gray-500">メモ</p>
                  <p className="whitespace-pre-wrap">{selectedRecord.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 新規記録フォーム (モーダル) */}
      {showNewVaccinationForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">
                {editingRecord ? "記録を編集" : "新しい予防接種記録"}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveRecord();
              }}
              className="modal-body space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ワクチン名
                </label>
                <div className="space-y-2">
                  {recordForm.vaccines.map((vaccine, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={vaccine}
                        onChange={(e) => {
                          const newVaccines = [...recordForm.vaccines];
                          newVaccines[index] = e.target.value;
                          setRecordForm((prev) => ({
                            ...prev,
                            vaccines: newVaccines,
                          }));
                        }}
                        className="input flex-1"
                        placeholder="ワクチン名を入力"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeVaccine(index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVaccine}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl
                                   text-gray-500 hover:border-primary-300 hover:text-primary-600
                                   transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    接種日
                  </label>
                  <input
                    type="date"
                    value={recordForm.date}
                    onChange={(e) =>
                      setRecordForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    接種医
                  </label>
                  <input
                    type="text"
                    value={recordForm.doctor}
                    onChange={(e) =>
                      setRecordForm((prev) => ({
                        ...prev,
                        doctor: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    接種場所
                  </label>
                  <input
                    type="text"
                    value={recordForm.location}
                    onChange={(e) =>
                      setRecordForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メモ
                </label>
                <textarea
                  value={recordForm.notes}
                  onChange={(e) =>
                    setRecordForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="input w-full h-24 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  次回接種のリマインダー
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={recordForm.reminder.beforeDay}
                      onChange={(e) =>
                        setRecordForm((prev) => ({
                          ...prev,
                          reminder: {
                            ...prev.reminder,
                            beforeDay: e.target.checked,
                          },
                        }))
                      }
                      className="input mr-2"
                    />
                    <span>前日に通知</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={recordForm.reminder.onDay}
                      onChange={(e) =>
                        setRecordForm((prev) => ({
                          ...prev,
                          reminder: {
                            ...prev.reminder,
                            onDay: e.target.checked,
                          },
                        }))
                      }
                      className="input mr-2"
                    />
                    <span>当日に通知</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={recordForm.reminder.beforeHour}
                      onChange={(e) =>
                        setRecordForm((prev) => ({
                          ...prev,
                          reminder: {
                            ...prev.reminder,
                            beforeHour: e.target.checked,
                          },
                        }))
                      }
                      className="input mr-2"
                    />
                    <span>1時間前に通知</span>
                  </label>
                </div>
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
                <button onClick={saveRecord} className="btn btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationRecord;
