import React from "react";
import { X as XIcon } from "lucide-react";

const IllnessForm = ({
  illnessForm,
  setIllnessForm,
  onSave,
  onCancel,
  availableSymptoms,
}) => {
  console.log(illnessForm, "currentIllnessForm");

  const toggleSymptom = (symptom) => {
    const index = illnessForm.symptoms.indexOf(symptom);
    if (index === -1) {
      setIllnessForm((prev) => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom],
        symptomDescriptions: {
          ...prev.symptomDescriptions,
          [symptom]: "",
        },
      }));
    } else {
      setIllnessForm((prev) => {
        const newSymptoms = [...prev.symptoms];
        newSymptoms.splice(index, 1);
        const newDescriptions = { ...prev.symptomDescriptions };
        delete newDescriptions[symptom];
        return {
          ...prev,
          symptoms: newSymptoms,
          symptomDescriptions: newDescriptions,
        };
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="text-xl font-bold">
            {illnessForm.name || illnessForm.start_date
              ? "病気情報を編集"
              : "新しい病気を記録"}
          </h3>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="modal-body space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              病名
            </label>
            <input
              type="text"
              value={illnessForm.name}
              onChange={(e) =>
                setIllnessForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="例: インフルエンザ"
              className="input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              症状（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    illnessForm.symptoms.includes(symptom)
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </button>
              ))}
            </div>
            {illnessForm.symptoms.includes("その他") && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  その他の症状
                </label>
                <input
                  type="text"
                  value={illnessForm.otherSymptom}
                  onChange={(e) =>
                    setIllnessForm((prev) => ({
                      ...prev,
                      otherSymptom: e.target.value,
                    }))
                  }
                  placeholder="症状を入力してください"
                  className="input w-full"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              発症日
            </label>
            <input
              type="date"
              value={illnessForm.start_date}
              onChange={(e) =>
                setIllnessForm((prev) => ({
                  ...prev,
                  start_date: e.target.value,
                }))
              }
              className="input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メモ
            </label>
            <textarea
              value={illnessForm.notes}
              onChange={(e) =>
                setIllnessForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="症状や気になる点などを記録してください"
              className="input w-full h-24 resize-none"
            ></textarea>
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
            <button onClick={onSave} className="btn btn-primary">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IllnessForm;
