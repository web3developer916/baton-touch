import React from "react";
import { useFamilyStore } from "../stores/useFamilyStore";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  Users as UsersIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

const FamilySettings = () => {
  const navigate = useNavigate();
  const familyStore = useFamilyStore();

  console.log(familyStore.families, "families");

  // 自分の家族グループ（管理者権限を持つグループ）
  const myFamilies = familyStore.families.filter(
    (family) =>
      family.family_members?.some(
        (member) => member.role && member.role === "admin"
      ) // TODO: 実際のユーザーIDに置き換える
  );

  // その他の家族グループ（閲覧者権限のグループ）
  const otherFamilies = familyStore.families.filter(
    (family) =>
      family.family_members?.some(
        (member) => member.role && member.role === "member"
      ) // TODO: 実際のユーザーIDに置き換える
  );

  const selectFamily = (family) => {
    familyStore.selectedFamilyId = family.id;
    navigate("/settings/family/detail");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-600"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">
              家族グループ設定
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-16">
        {/* 自分の家族グループ */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 px-1 mb-3">
            自分の家族グループ
          </h2>
          <div className="card">
            {myFamilies.map((family) => (
              <button
                key={family.id}
                onClick={() => selectFamily(family)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{family.name}</h3>
                  <p className="text-sm text-gray-500">
                    メンバー: {family.family_members?.length || 0}人
                  </p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* その他の家族グループ */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 px-1 mb-3">
            その他の家族グループ
          </h2>
          <div className="card">
            {otherFamilies.map((family) => (
              <div
                key={family.id}
                className="flex items-center justify-between p-4 rounded-xl"
              >
                <div className="space-y-1">
                  <div>
                    <h3 className="font-medium">{family.name}</h3>
                    <p className="text-sm text-gray-500">
                      メンバー: {family.family_members?.length || 0}人
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FamilySettings;
