import React, { useState, useEffect } from "react";
import { useChildStore } from "../stores/useChildStore";
import FamilyDropdown from "../components/common/FamilyDropdown";
import HeaderNotification from "../components/common/HeaderNotification";
import KindergartenInfo from "../components/child/KindergartenInfo";
import MedicalInfo from "../components/child/MedicalInfo";
import {
  UserPlus as UserPlusIcon,
  User as UserIcon,
  Baby as BabyIcon,
  Ruler as RulerIcon,
  Pencil as PencilIcon,
  Camera as CameraIcon,
  ChevronDown as ChevronDownIcon,
  Milestone as MilestoneIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useFamilyStore } from "../stores/useFamilyStore";
import { useAuth } from "../context/AuthContext";

import selectChild from "../components/common/FamilyDropdown";

const Child = () => {
  const { selectedFamilyId } = useFamilyStore();
  const [showNewChildForm, setShowNewChildForm] = useState(false);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fileInput, setFileInput] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [imageurl, setImageurl] = useState("");
  const { user, session, loading } = useAuth();

  const [newChildForm, setNewChildForm] = useState({
    name: "",
    birthdate: "",
    gender: "",
    imageurl: "",
  });
  const [editingChild, setEditingChild] = useState({
    name: "",
    birthdate: "",
    gender: "",
    imageurl: "",
  });
  const { children, selectedChildId, fetchChildren, addChild, updateChild } =
    useChildStore();

  // console.log(currentChildId, "currentChildId ");

  // setSelectedChild()

  // setSelectedChild(children.find((child) => child.id === currentChildId));
  // setEditingChild(children.find((child) => child.id === currentChildId));
  useEffect(() => {
    console.log("childuseEffect ");

    setSelectedChild(children.find((child) => child.id === selectedChildId));
    setEditingChild(children.find((child) => child.id === selectedChildId));
  }, [children, fetchChildren, selectedChildId]);
  // fetchChildren(selectedFamilyId);

  const triggerImageUpload = () => {
    fileInput?.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewChildForm((prev) => ({
          ...prev,
          imageurl: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 子供の追加
  const saveNewChild = () => {
    const newChild = {
      ...newChildForm,
      family_group_id: selectedFamilyId,
    };
    addChild(newChild);
    // setSelectedChild(newChild);
    setShowNewChildForm(false);
    setNewChildForm({
      name: "",
      birthdate: "",
      gender: "",
      imageurl: "",
    });
  };

  // 子供の情報更新
  const updateChildInfo = () => {
    const updateinfo = {
      name: editingChild.name,
      birthdate: editingChild.birthdate,
      gender: editingChild.gender,
      imageurl: editingChild.imageurl,
    };
    updateChild(selectedChild.id, updateinfo);
    // setSelectedChild(updateinfo);
    setShowEditProfileForm(false);
  };

  // 医療情報の管理
  const updateMedicalInfo = (update) => {
    updateChild(selectedChild.id, {
      ...selectedChild,
      medicalInfo: {
        ...selectedChild.medicalInfo,
        ...update,
      },
    });
  };

  // 幼稚園・保育園情報の管理
  const updateSchoolInfo = (update) => {
    updateChild(selectedChild.id, {
      ...selectedChild,
      schoolInfo: update,
    });
  };
  // console.log(selectedFamilyId, "selectedFamilyIdchildpage");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <FamilyDropdown />

            <div className="flex items-center">
              <button
                onClick={() => setShowNewChildForm(true)}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-600"
              >
                <UserPlusIcon className="w-5 h-5" />
              </button>
              <HeaderNotification />
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-20">
        {/* 選択中の子供の情報 */}
        {selectedChild ? (
          <div className="space-y-6">
            {/* プロフィール */}
            <div className="bg-white rounded-2xl p-6 relative">
              <button
                onClick={() => setShowEditProfileForm(true)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary-500 
                               hover:bg-gray-50 rounded-xl transition-colors"
              >
                <PencilIcon className="w-5 h-5" />
              </button>

              {/* プロフィール情報 */}
              <div className="text-center mb-8">
                <div
                  className="w-44 h-44 mx-auto mb-4 rounded-2xl bg-primary-50 
                              flex items-center justify-center"
                >
                  {selectedChild.imageurl ? (
                    <img
                      src={selectedChild.imageurl}
                      alt={selectedChild.name}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-primary-300" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {selectedChild.name}
                </h2>
                <p className="text-gray-500">
                  {selectedChild.birthdate
                    ? formatAge(selectedChild.birthdate)
                    : "年齢未設定"}
                </p>
              </div>

              {/* アクション */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/child/growth"
                  className="bg-primary-50 rounded-xl p-3 hover:bg-primary-100 transition-colors
                               flex items-center justify-center space-x-2"
                >
                  <RulerIcon className="w-6 h-6 text-primary-500" />
                  <span className="font-medium text-sm text-primary-500">
                    成長記録
                  </span>
                </Link>
                <Link
                  to="/child/development"
                  className="bg-primary-50 rounded-xl p-3 hover:bg-primary-100 transition-colors
                               flex items-center justify-center space-x-2"
                >
                  <MilestoneIcon className="w-6 h-6 text-primary-500" />
                  <span className="font-medium text-sm text-primary-500">
                    発達記録
                  </span>
                </Link>
              </div>

              {/* 最新の成長記録 */}
              <div className="mt-4 bg-[#fefbed] rounded-xl p-3">
                <h3 className="text-base font-medium text-gray-600 mb-2">
                  最新の成長記録
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 text-center">
                      身長
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-xl font-bold text-[#f97316]">
                        {getLatestGrowthRecord(selectedChild)?.height || "--"}
                      </span>
                      <span className="text-sm font-bold text-[#f97316] ml-1">
                        cm
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 text-center">
                      体重
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-xl font-bold text-[#f97316]">
                        {getLatestGrowthRecord(selectedChild)?.weight || "--"}
                      </span>
                      <span className="text-sm font-bold text-[#f97316] ml-1">
                        kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 幼稚園・保育園情報 */}
            <KindergartenInfo
              schoolInfo={selectedChild.schoolInfo || {}}
              onUpdate={updateSchoolInfo}
            />

            {/* 医療情報 */}
            <MedicalInfo
              medicalInfo={selectedChild.medicalInfo || {}}
              onUpdate={updateMedicalInfo}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BabyIcon className="w-12 h-12 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">子供を登録しましょう</h2>
            <p className="text-gray-500 mb-4">
              子供の情報を登録して、成長を記録していきましょう
            </p>
            <button
              onClick={() => setShowNewChildForm(true)}
              className="btn btn-primary"
            >
              子供を登録する
            </button>
          </div>
        )}

        {/* 新規子供登録フォーム (モーダル) */}
        {showNewChildForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6">
              <h3 className="text-xl font-bold mb-4">新しい子供を登録</h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveNewChild();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    名前（ひらがな推奨）
                  </label>
                  <input
                    type="text"
                    value={newChildForm.name}
                    onChange={(e) =>
                      setNewChildForm((prev) => ({
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
                    アイコン
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div
                        className="w-24 h-24 rounded-2xl bg-primary-50 
                                  flex items-center justify-center overflow-hidden"
                      >
                        {newChildForm.imageurl ? (
                          <img
                            src={newChildForm.imageurl}
                            alt={newChildForm.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-12 h-12 text-primary-300" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={triggerImageUpload}
                        className="absolute -bottom-2 -right-2 p-2 rounded-full 
                                       bg-white shadow-warm"
                      >
                        <CameraIcon className="w-5 h-5 text-primary-500" />
                      </button>
                      <input
                        type="file"
                        ref={setFileInput}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      子供の写真をアップロードできます
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    生年月日
                  </label>
                  <input
                    type="date"
                    value={newChildForm.birthdate}
                    onChange={(e) =>
                      setNewChildForm((prev) => ({
                        ...prev,
                        birthdate: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    性別
                  </label>
                  <select
                    value={newChildForm.gender}
                    onChange={(e) =>
                      setNewChildForm((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="male">男の子</option>
                    <option value="female">女の子</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewChildForm(false)}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    キャンセル
                  </button>
                  <button type="submit" className="btn btn-primary">
                    登録
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showEditProfileForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6">
              <h3 className="text-xl font-bold mb-4">子供情報を編集</h3>

              <form
                onSubmit={(e) => {
                  console.log(e.target, "e");

                  e.preventDefault();
                  updateChildInfo();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    名前（ひらがな推奨）
                  </label>
                  <input
                    type="text"
                    value={editingChild.name}
                    onChange={(e) =>
                      setEditingChild((prev) => ({
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
                    アイコン
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div
                        className="w-24 h-24 rounded-2xl bg-primary-50 
                                  flex items-center justify-center overflow-hidden"
                      >
                        {editingChild.imageurl ? (
                          <img
                            src={editingChild.imageurl}
                            alt={editingChild.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-12 h-12 text-primary-300" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={triggerImageUpload}
                        className="absolute -bottom-2 -right-2 p-2 rounded-full 
                                       bg-white shadow-warm"
                      >
                        <CameraIcon className="w-5 h-5 text-primary-500" />
                      </button>
                      <input
                        type="file"
                        ref={setFileInput}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      子供の写真をアップロードできます
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    生年月日
                  </label>
                  <input
                    type="date"
                    value={editingChild.birthdate}
                    onChange={(e) =>
                      setEditingChild((prev) => ({
                        ...prev,
                        birthdate: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    性別
                  </label>
                  <select
                    value={editingChild.gender}
                    onChange={(e) =>
                      setEditingChild((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="male">男の子</option>
                    <option value="female">女の子</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileForm(false)}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    キャンセル
                  </button>
                  <button type="submit" className="btn btn-primary">
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// 年齢のフォーマット
const formatAge = (birthdate) => {
  if (!birthdate) return "年齢未設定";

  let birth = new Date(birthdate);
  let now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return `${months}ヶ月`;
  } else {
    return `${years}歳${months}ヶ月`;
  }
};

// 最新の成長記録を取得
const getLatestGrowthRecord = (child) => {
  if (!child?.growthRecords?.length) return null;
  return child.growthRecords.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0];
};

export default Child;
