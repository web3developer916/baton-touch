import React, { useState } from "react";
import { useChildStore } from "../stores/useChildStore";
import { useHealthStore } from "../stores/useHealthStore";
import HeaderNotification from "../components/common/HeaderNotification";
import FamilyDropdown from "../components/common/FamilyDropdown";
import HealthTimeline from "../components/health/HealthTimeline";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Plus as PlusIcon,
  Thermometer as ThermometerIcon,
  Activity as ActivityIcon,
  Stethoscope as StethoscopeIcon,
  Syringe as SyringeIcon,
  Pill as PillIcon,
  Pencil as PencilIcon,
  ChevronRight as ChevronRightIcon,
  X as XIcon,
  Baby as BabyIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  format,
  parseISO,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { ja } from "date-fns/locale";
import { useFamilyStore } from "../stores/useFamilyStore";

const Health = () => {
  const familystore = useFamilyStore();
  console.log(familystore.selectedFamilyId, "health");

  const navigate = useNavigate();
  const [showNewTemperatureForm, setShowNewTemperatureForm] = useState(false);
  const [showNormalTempForm, setShowNormalTempForm] = useState(false);
  const [normalTempForm, setNormalTempForm] = useState({
    temperature: 36.5,
  });
  const [temperatureForm, setTemperatureForm] = useState({
    temperature: "",
    measuredAt: "",
    notes: "",
  });

  const childStore = useChildStore();
  const healthStore = useHealthStore();
  const selectedChild = childStore.children.find(
    (child) => child.id === childStore.selectedChildId
  );

  // 年齢を計算する関数
  const calculateAge = (birthdate) => {
    if (!birthdate) return "年齢未設定";

    const birth = new Date(birthdate);
    const now = new Date();

    const years = differenceInYears(now, birth);
    const months = differenceInMonths(now, birth) % 12;

    if (years === 0) {
      return `${months}ヶ月`;
    } else {
      return `${years}歳${months}ヶ月`;
    }
  };

  // 治療中の薬を取得
  const activeMedications = healthStore
    .getChildMedications(childStore.selectedChildId)
    ?.filter((med) => !med.endDate || new Date(med.endDate) >= new Date())
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  // 平熱を取得
  const normalTemperature = healthStore.getChildNormalTemperature(
    childStore.selectedChildId
  );

  // 治療中の病気を取得
  const activeIllnesses = healthStore
    .getChildIllnesses(childStore.selectedChildId)
    ?.filter((illness) => !illness.endDate)
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  // 日付のフォーマット
  const formatDate = (dateString) => {
    return format(parseISO(dateString), "M月d日(E)", { locale: ja });
  };

  // 平熱編集関連の関数
  const startEditingNormalTemp = () => {
    setNormalTempForm({
      temperature: healthStore.getChildNormalTemperature(
        childStore.selectedChildId
      ),
    });
    setShowNormalTempForm(true);
  };

  const saveNormalTemp = () => {
    healthStore.setNormalTemperature(
      childStore.selectedChildId,
      normalTempForm.temperature
    );
    setShowNormalTempForm(false);
  };

  const setCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setTemperatureForm((prev) => ({
      ...prev,
      measuredAt: `${year}-${month}-${day}T${hours}:${minutes}`,
    }));
  };

  const saveTemperature = () => {
    healthStore.addHealthRecord({
      family_group_id: childStore.selectedChild?.family_group_id,
      child_id: childStore.selectedChildId,
      type: "temperature",
      recorded_at: temperatureForm.measuredAt,
      data: {
        temperature: parseFloat(temperatureForm.temperature),
        notes: temperatureForm.notes,
      },
    });
    setShowNewTemperatureForm(false);
    setTemperatureForm({
      temperature: "",
      measuredAt: "",
      notes: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <FamilyDropdown />

            <div className="flex items-center">
              <HeaderNotification />
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-3xl mx-auto px-4 pt-20 space-y-6">
        {/* 選択中の子供の情報 */}
        {selectedChild ? (
          <div className="card">
            <div className="flex items-center space-x-4 mb-4">
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 
                            flex items-center justify-center shadow-warm"
              >
                {selectedChild.imageurl ? (
                  <img
                    src={selectedChild.imageurl}
                    alt={selectedChild.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <UserIcon className="w-8 h-8 text-primary-600" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedChild.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {calculateAge(selectedChild.birthdate)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-background rounded-xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-500">平熱</p>
                  <button
                    onClick={startEditingNormalTemp}
                    className="p-1 text-gray-400 hover:text-primary-500"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-600">
                    {normalTemperature}
                    <span className="text-lg font-medium">℃</span>
                  </p>
                </div>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  服用中の薬
                </p>
                <button
                  onClick={() => navigate("/health/medication")}
                  className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {activeMedications.length}
                  <span className="text-lg font-medium">件</span>
                </button>
              </div>
              <div className="bg-background rounded-xl p-4 col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  現在治療中の病気
                </p>
                {activeIllnesses.length > 0 ? (
                  <div className="space-y-2">
                    {activeIllnesses.map((illness) => (
                      <div
                        key={illness.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => navigate("/health/illness")}
                      >
                        <div>
                          <p className="font-medium">{illness.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(illness.start_date)}〜
                          </p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">なし</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BabyIcon className="w-12 h-12 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">子供を登録しましょう</h2>
            <p className="text-gray-500 mb-4">
              子供の情報を登録して、健康記録を始めましょう
            </p>
            <button
              onClick={() => navigate("/child")}
              className="btn btn-primary"
            >
              子供を登録する
            </button>
          </div>
        )}

        {selectedChild && (
          <>
            <div className="mb-6">
              {/* 体温記録 */}
              <div
                onClick={() => setShowNewTemperatureForm(true)}
                className="group relative bg-white rounded-2xl p-6 shadow-warm cursor-pointer 
                            transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 mb-4 rounded-xl bg-red-50 
                                flex items-center justify-center mx-auto"
                  >
                    <ThermometerIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-base font-bold text-center">体温記録</h3>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlusIcon className="w-5 h-5 text-primary-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* 病気記録 */}
              <div
                onClick={() => navigate("/health/illness")}
                className="group relative bg-white rounded-2xl p-6 shadow-warm cursor-pointer 
                            transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div
                  className="w-12 h-12 mb-4 rounded-xl bg-yellow-50 
                              flex items-center justify-center mx-auto"
                >
                  <ActivityIcon className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-base font-bold text-center">病気記録</h3>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlusIcon className="w-5 h-5 text-primary-500" />
                </div>
              </div>

              {/* 服薬記録 */}
              <div
                onClick={() => navigate("/health/medication")}
                className="group relative bg-white rounded-2xl p-6 shadow-warm cursor-pointer 
                            transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div
                  className="w-12 h-12 mb-4 rounded-xl bg-orange-50 
                              flex items-center justify-center mx-auto"
                >
                  <PillIcon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-base font-bold text-center">服薬記録</h3>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlusIcon className="w-5 h-5 text-primary-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 定期検診記録 */}
              <div
                onClick={() => navigate("/health/checkup")}
                className="group relative bg-white rounded-2xl p-6 shadow-warm cursor-pointer 
                            transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div
                  className="w-12 h-12 mb-4 rounded-xl bg-blue-50 
                              flex items-center justify-center mx-auto"
                >
                  <StethoscopeIcon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-base font-bold text-center">定期検診</h3>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlusIcon className="w-5 h-5 text-primary-500" />
                </div>
              </div>

              {/* 予防接種記録 */}
              <div
                onClick={() => navigate("/health/vaccination")}
                className="group relative bg-white rounded-2xl p-6 shadow-warm cursor-pointer 
                            transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div
                  className="w-12 h-12 mb-4 rounded-xl bg-green-50 
                              flex items-center justify-center mx-auto"
                >
                  <SyringeIcon className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-base font-bold text-center">予防接種</h3>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlusIcon className="w-5 h-5 text-primary-500" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* 健康記録タイムライン */}
      {selectedChild && (
        <div className="mt-8">
          <HealthTimeline
            records={healthStore.getChildHealthRecords(
              childStore.selectedChildId
            )}
          />
        </div>
      )}

      {/* 平熱編集モーダル */}
      {showNormalTempForm && (
        <div className="modal-overlay">
          <div className="modal-content max-w-lg">
            <div className="modal-header">
              <h3 className="text-xl font-bold">平熱を設定</h3>
              <button
                onClick={() => setShowNormalTempForm(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="modal-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  平熱
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={normalTempForm.temperature}
                    onChange={(e) =>
                      setNormalTempForm((prev) => ({
                        ...prev,
                        temperature: e.target.value,
                      }))
                    }
                    className="input w-full pr-8"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ℃
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNormalTempForm(false)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button onClick={saveNormalTemp} className="btn btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 体温記録フォーム (モーダル) */}
      {showNewTemperatureForm && (
        <div className="modal-overlay">
          <div className="modal-content max-w-lg">
            <div className="modal-header">
              <h3 className="text-xl font-bold">体温を記録</h3>
              <button
                onClick={() => setShowNewTemperatureForm(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="modal-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  体温
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={temperatureForm.temperature}
                    onChange={(e) =>
                      setTemperatureForm((prev) => ({
                        ...prev,
                        temperature: e.target.value,
                      }))
                    }
                    className="input w-full pr-8"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ℃
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  測定日時
                </label>
                <div className="space-y-2">
                  <input
                    type="datetime-local"
                    value={temperatureForm.measuredAt}
                    onChange={(e) =>
                      setTemperatureForm((prev) => ({
                        ...prev,
                        measuredAt: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={setCurrentTime}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    現在時刻を設定
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メモ
                </label>
                <textarea
                  value={temperatureForm.notes}
                  onChange={(e) =>
                    setTemperatureForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="input w-full h-24 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewTemperatureForm(false)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button onClick={saveTemperature} className="btn btn-primary">
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

export default Health;
