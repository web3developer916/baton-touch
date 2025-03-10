import React, { useState } from "react";
import { useChildStore } from "../../stores/useChildStore";
import {
  Plus as PlusIcon,
  Phone as PhoneIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  X as XIcon,
  MoreVertical as MoreVerticalIcon,
  Trash2 as Trash2Icon,
  Pencil as PencilIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

const MedicalInfo = ({ medicalInfo, onUpdate }) => {
  const [isAllergyExpanded, setIsAllergyExpanded] = useState(true);
  const [isConditionExpanded, setIsConditionExpanded] = useState(true);
  const [isDoctorExpanded, setIsDoctorExpanded] = useState(true);
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [showNewConditionForm, setShowNewConditionForm] = useState(false);
  const [showNewDoctorForm, setShowNewDoctorForm] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editingAllergy, setEditingAllergy] = useState(null);
  const [editingCondition, setEditingCondition] = useState(null);

  const [allergyForm, setAllergyForm] = useState({
    name: "",
    onsetDate: "",
    symptoms: "",
    severity: "mild",
    treatment: "",
  });

  const [conditionForm, setConditionForm] = useState({
    name: "",
    onsetDate: "",
    treatment: "",
    notes: "",
  });

  const [doctorForm, setDoctorForm] = useState({
    hospitalName: "",
    department: "",
    customDepartment: "",
    name: "",
    phone: "",
    address: "",
    hours: "",
  });

  const departments = [
    "小児科",
    "内科",
    "耳鼻咽喉科",
    "皮膚科",
    "眼科",
    "歯科",
    "整形外科",
    "アレルギー科",
    "小児歯科",
  ];

  const { allergies = [], conditions = [], doctors = [] } = medicalInfo;

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString("ja-JP") : "";
  };

  const updateMedicalInfo = (update) => {
    if (update.type === "allergy") {
      onUpdate({
        allergies: update.data,
      });
    } else if (update.type === "condition") {
      onUpdate({
        conditions: update.data,
      });
    } else if (update.type === "doctor") {
      onUpdate({
        doctors: update.data,
      });
    }
  };

  const showAllergyDetails = (allergy) => {
    setSelectedAllergy(allergy);
  };

  const showDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const editDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({ ...doctor });
    setShowNewDoctorForm(true);
    setSelectedDoctor(null);
  };

  const deleteDoctor = (id) => {
    if (confirm("このかかりつけ医情報を削除してもよろしいですか？")) {
      onUpdate({
        doctors: doctors.filter((d) => d.id !== id),
      });
      setSelectedDoctor(null);
    }
  };

  const saveDoctor = () => {
    const updatedDoctors = [...doctors];
    const isNewRegistration = !editingDoctor;

    if (editingDoctor) {
      const index = updatedDoctors.findIndex((d) => d.id === editingDoctor.id);
      if (index !== -1) {
        updatedDoctors[index] = {
          ...editingDoctor,
          ...doctorForm,
        };
      }
    } else {
      updatedDoctors.push({
        id: Date.now(),
        ...doctorForm,
      });
    }

    updateMedicalInfo({
      type: "doctor",
      data:
        updatedDoctors.department === "other"
          ? {
              ...updatedDoctors,
              department: updatedDoctors.customDepartment,
            }
          : updatedDoctors,
    });

    setDoctorForm({
      hospitalName: "",
      department: "",
      customDepartment: "",
      name: "",
      phone: "",
      address: "",
      hours: "",
    });

    setEditingDoctor(null);
    
    if (isNewRegistration) {
      setIsDoctorExpanded(true);
    }

    setShowNewDoctorForm(false);
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "mild":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case "severe":
        return "重度";
      case "moderate":
        return "中度";
      case "mild":
        return "軽度";
      default:
        return "不明";
    }
  };

  const saveAllergy = () => {
    const updatedAllergies = [...allergies];
    const isNewRegistration = !editingAllergy;

    if (editingAllergy) {
      const index = updatedAllergies.findIndex(
        (a) => a.id === editingAllergy.id
      );
      if (index !== -1) {
        updatedAllergies[index] = {
          ...editingAllergy,
          ...allergyForm,
        };
      }
    } else {
      updatedAllergies.push({
        id: Date.now(),
        ...allergyForm,
      });
    }

    updateMedicalInfo({
      type: "allergy",
      data: updatedAllergies,
    });

    // 新規登録の場合は展開状態をtrueに設定
    if (isNewRegistration) {
      setIsAllergyExpanded(true);
    }

    setShowAllergyForm(false);
    setEditingAllergy(null);
    setAllergyForm({
      name: "",
      onsetDate: "",
      symptoms: "",
      severity: "mild",
      treatment: "",
    });
  };

  const saveCondition = () => {
    const updatedConditions = [...conditions];
    const isNewRegistration = !editingCondition;

    if (editingCondition) {
      const index = updatedConditions.findIndex(
        (c) => c.id === editingCondition.id
      );
      if (index !== -1) {
        updatedConditions[index] = {
          ...editingCondition,
          ...conditionForm,
        };
      }
    } else {
      updatedConditions.push({
        id: Date.now(),
        ...conditionForm,
      });
    }

    updateMedicalInfo({
      type: "condition",
      data: updatedConditions,
    });

    if (isNewRegistration) {
      setIsConditionExpanded(true);
    }
    setShowNewConditionForm(false);
    setEditingCondition(null);
    setConditionForm({
      name: "",
      onsetDate: "",
      treatment: "",
      notes: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* アレルギー情報 */}
      <div className="card relative overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">アレルギー情報</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAllergyForm(true)}
              className="p-2 text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAllergyExpanded(!isAllergyExpanded)}
              className="p-2 hover:text-primary-600 transition-colors"
            >
              {isAllergyExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isAllergyExpanded && (
          <div className="space-y-3">
            {allergies.map((allergy) => (
              <div
                key={allergy.id}
                className="p-4 bg-background rounded-xl cursor-pointer hover:bg-gray-50"
                onClick={() => showAllergyDetails(allergy)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <h4 className="font-medium">{allergy.name}</h4>
                      <p className="text-sm text-gray-600">
                        発症日: {allergy.onsetDate}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            "このアレルギー情報を削除してもよろしいですか？"
                          )
                        ) {
                          onUpdate({
                            allergies: allergies.filter(
                              (a) => a.id !== allergy.id
                            ),
                          });
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 持病情報 */}
      <div className="card relative overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">持病情報</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNewConditionForm(true)}
              className="p-2 text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsConditionExpanded(!isConditionExpanded)}
              className="p-2 hover:text-primary-600 transition-colors"
            >
              {isConditionExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isConditionExpanded && (
          <div className="space-y-3">
            {conditions.map((condition) => (
              <div
                key={condition.id}
                onClick={() => setSelectedCondition(condition)}
                className="p-4 bg-background rounded-xl cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <h4 className="font-medium">{condition.name}</h4>
                      <p className="text-sm text-gray-600">
                        発症日: {formatDate(condition.onsetDate)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm("この持病情報を削除してもよろしいですか？")
                        ) {
                          onUpdate({
                            conditions: conditions.filter(
                              (c) => c.id !== condition.id
                            ),
                          });
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 持病詳細モーダル */}
        {selectedCondition && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedCondition.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    発症日: {formatDate(selectedCondition.onsetDate)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingCondition(selectedCondition);
                      setConditionForm({ ...selectedCondition });
                      setShowNewConditionForm(true);
                      setSelectedCondition(null);
                    }}
                    className="p-2 text-gray-400 hover:text-primary-500"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedCondition(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="modal-body space-y-4">
                <div>
                  <p className="text-sm text-gray-500">治療内容</p>
                  <p className="font-medium whitespace-pre-wrap">
                    {selectedCondition.treatment}
                  </p>
                </div>
                {selectedCondition.notes && (
                  <div>
                    <p className="text-sm text-gray-500">メモ</p>
                    <p className="font-medium whitespace-pre-wrap">
                      {selectedCondition.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* かかりつけ医情報 */}
      <div className="card relative overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">かかりつけ医</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNewDoctorForm(true)}
              className="p-2 text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDoctorExpanded(!isDoctorExpanded)}
              className="p-2 hover:text-primary-600 transition-colors"
            >
              {isDoctorExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isDoctorExpanded && (
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="p-4 bg-background rounded-xl cursor-pointer hover:bg-gray-50"
                onClick={() => showDoctorDetails(doctor)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <h4 className="font-medium">{doctor.hospitalName}</h4>
                      <p className="text-sm">
                        {doctor.department} - {doctor.name}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDoctor(doctor.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* モーダル類 */}
      {/* アレルギー詳細モーダル */}
      {selectedAllergy && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{selectedAllergy.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    発症日: {selectedAllergy.onsetDate}
                  </p>
                  <div
                    className={`${getSeverityClass(
                      selectedAllergy.severity
                    )} px-3 py-1 rounded-full text-sm inline-block`}
                  >
                    {getSeverityText(selectedAllergy.severity)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingAllergy(selectedAllergy);
                    setAllergyForm({ ...selectedAllergy });
                    setShowAllergyForm(true);
                    setSelectedAllergy(null);
                  }}
                  className="p-2 text-gray-400 hover:text-primary-500"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedAllergy(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="modal-body space-y-4">
              <div>
                <p className="text-sm text-gray-600">症状</p>
                <p className="font-medium whitespace-pre-wrap">
                  {selectedAllergy.symptoms}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">対応方法</p>
                <p className="font-medium whitespace-pre-wrap">
                  {selectedAllergy.treatment}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新規アレルギー情報フォーム */}
      {showAllergyForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">
                {editingAllergy
                  ? "アレルギー情報の編集"
                  : "アレルギー情報の登録"}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveAllergy();
              }}
              className="modal-body space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アレルゲン名
                </label>
                <input
                  type="text"
                  value={allergyForm.name}
                  onChange={(e) =>
                    setAllergyForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  発症日
                </label>
                <input
                  type="date"
                  value={allergyForm.onsetDate}
                  onChange={(e) =>
                    setAllergyForm((prev) => ({
                      ...prev,
                      onsetDate: e.target.value,
                    }))
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  症状
                </label>
                <textarea
                  value={allergyForm.symptoms}
                  onChange={(e) =>
                    setAllergyForm((prev) => ({
                      ...prev,
                      symptoms: e.target.value,
                    }))
                  }
                  className="input w-full h-24"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  重症度
                </label>
                <select
                  value={allergyForm.severity}
                  onChange={(e) =>
                    setAllergyForm((prev) => ({
                      ...prev,
                      severity: e.target.value,
                    }))
                  }
                  className="input w-full"
                >
                  <option value="mild">軽度</option>
                  <option value="moderate">中度</option>
                  <option value="severe">重度</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  対応方法
                </label>
                <textarea
                  value={allergyForm.treatment}
                  onChange={(e) =>
                    setAllergyForm((prev) => ({
                      ...prev,
                      treatment: e.target.value,
                    }))
                  }
                  className="input w-full h-24"
                ></textarea>
              </div>
            </form>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllergyForm(false);
                    setEditingAllergy(null);
                    setAllergyForm({
                      name: "",
                      onsetDate: "",
                      symptoms: "",
                      severity: "mild",
                      treatment: "",
                    });
                  }}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button onClick={saveAllergy} className="btn btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新規持病情報フォーム */}
      {showNewConditionForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">
                {editingCondition ? "持病情報の編集" : "持病情報の登録"}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCondition();
              }}
              className="modal-body space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  病名
                </label>
                <input
                  type="text"
                  value={conditionForm.name}
                  onChange={(e) =>
                    setConditionForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  発症日
                </label>
                <input
                  type="date"
                  value={conditionForm.onsetDate}
                  onChange={(e) =>
                    setConditionForm((prev) => ({
                      ...prev,
                      onsetDate: e.target.value,
                    }))
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  治療内容
                </label>
                <textarea
                  value={conditionForm.treatment}
                  onChange={(e) =>
                    setConditionForm((prev) => ({
                      ...prev,
                      treatment: e.target.value,
                    }))
                  }
                  className="input w-full h-24 resize-none"
                  placeholder="例：定期的な投薬、生活上の注意点など"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メモ
                </label>
                <textarea
                  value={conditionForm.notes}
                  onChange={(e) =>
                    setConditionForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="input w-full h-24 resize-none"
                  placeholder="例：症状の特徴、緊急時の対応など"
                ></textarea>
              </div>
            </form>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewConditionForm(false);
                    setEditingCondition(null);
                    setConditionForm({
                      name: "",
                      onsetDate: "",
                      treatment: "",
                      notes: "",
                    });
                  }}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button onClick={saveCondition} className="btn btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新規かかりつけ医フォーム */}
      {showNewDoctorForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">
                {editingDoctor ? "かかりつけ医の編集" : "かかりつけ医の登録"}
              </h3>
            </div>

            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveDoctor();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    病院名
                  </label>
                  <input
                    type="text"
                    value={doctorForm.hospitalName}
                    onChange={(e) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        hospitalName: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    診療科
                  </label>
                  <div className="space-y-2">
                    <select
                      value={doctorForm.department}
                      onChange={(e) =>
                        setDoctorForm((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                      className="input w-full"
                    >
                      <option value="">選択してください</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                      <option value="other">その他</option>
                    </select>
                    {doctorForm.department === "other" && (
                      <input
                        type="text"
                        value={doctorForm.customDepartment}
                        onChange={(e) =>
                          setDoctorForm((prev) => ({
                            ...prev,
                            customDepartment: e.target.value,
                          }))
                        }
                        className="input w-full mt-2"
                        placeholder="診療科を入力"
                        required
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    医師名
                  </label>
                  <input
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    value={doctorForm.phone}
                    onChange={(e) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    住所
                  </label>
                  <input
                    type="text"
                    value={doctorForm.address}
                    onChange={(e) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    診察時間
                  </label>
                  <textarea
                    value={doctorForm.hours}
                    onChange={(e) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        hours: e.target.value,
                      }))
                    }
                    className="input w-full h-24 resize-none"
                    placeholder="例：平日 9:00-18:00&#13;土曜 9:00-12:00&#13;日祝 休診"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewDoctorForm(false);
                    setDoctorForm({
                      hospitalName: "",
                      department: "",
                      name: "",
                      phone: "",
                      address: "",
                      hours: "",
                    });
                    setEditingDoctor(null);
                  }}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button onClick={saveDoctor} className="btn btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 医師詳細モーダル */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">
                  {selectedDoctor.hospitalName}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedDoctor.department}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => editDoctor(selectedDoctor)}
                  className="p-2 text-gray-400 hover:text-primary-500"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="modal-body space-y-4">
              <div>
                <p className="text-sm text-gray-600">医師名</p>
                <p className="font-medium">{selectedDoctor.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">電話番号</p>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{selectedDoctor.phone}</p>
                  <a
                    href={`tel:${selectedDoctor.phone}`}
                    className="btn bg-primary-50 text-primary-600"
                  >
                    <PhoneIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">住所</p>
                <p className="font-medium">{selectedDoctor.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">診察時間</p>
                <p className="font-medium whitespace-pre-wrap">
                  {selectedDoctor.hours}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalInfo;
