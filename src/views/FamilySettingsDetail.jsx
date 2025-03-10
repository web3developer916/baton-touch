import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFamilyStore } from "../stores/useFamilyStore";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  ArrowLeft as ArrowLeftIcon,
  User as UserIcon,
  ChevronRight as ChevronRightIcon,
  Text as TextIcon,
  X as XIcon,
  UserPlus as UserPlusIcon,
  LogOut as LogOutIcon,
  Trash2 as Trash2Icon,
  MoreVertical as MoreVerticalIcon,
  UserMinus as UserMinusIcon,
} from "lucide-react";

const FamilySettingsDetail = () => {
  const navigate = useNavigate();
  const familyStore = useFamilyStore();

  const [showEditNameForm, setShowEditNameForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRemoveMemberConfirm, setShowRemoveMemberConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "member",
  });

  const selectedFamily = familyStore.families.find(
    (family) => family.id === familyStore.selectedFamilyId
  );

  const [nameForm, setNameForm] = useState({
    name: selectedFamily.name,
  });

  console.log(selectedFamily, "selectedFamily");

  // 管理者権限を持っているかどうか
  const isAdmin = selectedFamily.family_members[0].role === "admin";
  console.log(isAdmin, "isAdmin");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy年M月d日", { locale: ja });
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case "member":
        return "タスクの追加・編集が可能、その他は閲覧のみ";
      case "admin":
        return "グループの管理を含むすべての操作が可能";
      default:
        return "";
    }
  };

  const inviteMember = () => {
    if (selectedFamily) {
      familyStore.addMember(selectedFamily.id, {
        name: inviteForm.name,
        email: inviteForm.email,
        role: inviteForm.role,
        // isAdmin: inviteForm.role === "admin",
      });
    }
    setShowInviteForm(false);
    setInviteForm({
      name: "",
      email: "",
      role: "member",
    });
  };

  const showMemberSettingsForm = (member) => {
    setSelectedMember(member);
  };

  const saveName = () => {
    if (selectedFamily) {
      familyStore.updateFamily(selectedFamily.id, {
        name: nameForm.name,
      });
    }
    setShowEditNameForm(false);
  };

  const removeMember = () => {
    if (selectedFamily && selectedMember) {
      familyStore.removeMember(selectedFamily.id, selectedMember.id);
    }
    setSelectedMember(null);
    setShowRemoveMemberConfirm(false);
  };

  const leaveGroup = () => {
    if (selectedFamily) {
      // 自分をメンバーから削除
      familyStore.removeMember(selectedFamily.id, 1); // TODO: 実際のユーザーIDに置き換える
      navigate("/settings/family");
    }
  };

  const deleteGroup = () => {
    if (selectedFamily && deleteConfirmed) {
      familyStore.deleteFamily(selectedFamily.id);
      navigate("/settings/family");
    }
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
        {/* 家族グループ情報 */}
        <div className="card mb-6">
          <div className="mb-6">
            <div>
              <h2 className="text-xl font-bold">{selectedFamily?.name}</h2>
              <p className="text-sm text-gray-500">
                作成日: {formatDate(selectedFamily?.created_at)}
              </p>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="space-y-4">
            <button
              onClick={() => setShowEditNameForm(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-xl">
                  <TextIcon className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium">グループ名</p>
                  <p className="text-sm text-gray-500">
                    {selectedFamily?.name}
                  </p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* メンバー管理 */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">メンバー</h3>
            <button
              onClick={() => setShowInviteForm(true)}
              className="p-2 text-primary-600 hover:text-primary-700"
            >
              <UserPlusIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {selectedFamily?.family_members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{member.profiles.name}</p>
                    <p className="text-sm text-gray-500">
                      {member.role ? "管理者" : "閲覧者"}
                    </p>
                  </div>
                </div>
                {isAdmin && !member.role && (
                  <button
                    onClick={() => showMemberSettingsForm(member)}
                    className="p-2 text-gray-400 hover:text-primary-500"
                  >
                    <MoreVerticalIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 危険な操作 */}
        <div className="space-y-4">
          {!isAdmin && (
            <div className="card">
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-red-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-50 rounded-xl">
                    <LogOutIcon className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="font-medium">グループから退出</span>
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="card">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-red-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-50 rounded-xl">
                    <Trash2Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="font-medium">グループを削除</span>
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* モーダル類 */}
      {/* グループ名編集モーダル */}
      {showEditNameForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">グループ名を変更</h3>
              <button
                onClick={() => {
                  setShowEditNameForm(false);
                  setNameForm({
                    name: selectedFamily.name,
                  });
                }}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveName();
              }}
              className="modal-body"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    グループ名
                  </label>
                  <input
                    type="text"
                    value={nameForm.name}
                    onChange={(e) =>
                      setNameForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="グループ名を入力"
                    required
                  />
                </div>
              </div>
            </form>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditNameForm(false);
                    setNameForm({
                      name: selectedFamily.name,
                    });
                  }}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button onClick={saveName} className="btn btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メンバー招待モーダル */}
      {showInviteForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">メンバーを招待</h3>
              <button
                onClick={() => setShowInviteForm(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                inviteMember();
              }}
              className="modal-body space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名前（ひらがな）
                </label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) =>
                    setInviteForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="input w-full"
                  placeholder="例：たろう"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="input w-full"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  権限
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="input w-full"
                  required
                >
                  <option value="member">メンバー（親以外）</option>
                  <option value="admin">管理者（親）</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  ※管理者は親のみ設定可能です。その他のメンバー（祖父母など）は閲覧のみの権限となります。
                </p>
              </div>
            </form>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button onClick={inviteMember} className="btn btn-primary">
                  招待を送信
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メンバー設定モーダル */}
      {selectedMember && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">メンバー設定</h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="modal-body">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    {selectedMember.imageUrl ? (
                      <img
                        src={selectedMember.imageUrl}
                        alt={selectedMember.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-primary-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {selectedMember.profiles.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedMember.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRemoveMemberConfirm(true)}
                  className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <UserMinusIcon className="w-5 h-5" />
                    <span className="font-medium">メンバーを削除</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メンバー削除確認モーダル */}
      {showRemoveMemberConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">メンバーを削除</h3>
            </div>

            <div className="modal-body">
              <p className="text-gray-600">
                {selectedMember.profiles.name}さんをグループから削除しますか？
                削除すると、このメンバーはグループの情報にアクセスできなくなります。
              </p>
            </div>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRemoveMemberConfirm(false)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={removeMember}
                  className="btn bg-red-500 text-white hover:bg-red-600"
                >
                  削除する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* グループ退出確認モーダル */}
      {showLeaveConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">グループから退出</h3>
            </div>

            <div className="modal-body">
              <p className="text-gray-600">
                このグループから退出しますか？
                退出すると、このグループの情報にアクセスできなくなります。
              </p>
            </div>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={leaveGroup}
                  className="btn bg-red-500 text-white hover:bg-red-600"
                >
                  退出する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* グループ削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold text-red-500">グループを削除</h3>
            </div>

            <div className="modal-body">
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4">
                <p className="font-bold mb-2">⚠️ 注意</p>
                <p>
                  グループを削除すると、以下の情報がすべて削除され、復元できません：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>子供の記録</li>
                  <li>健康記録</li>
                  <li>育児メモ</li>
                  <li>タスク</li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">本当にグループを削除しますか？</p>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={deleteConfirmed}
                      onChange={(e) => setDeleteConfirmed(e.target.checked)}
                      className="input"
                    />
                    <span>
                      上記の内容を理解し、グループを削除することに同意します
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={deleteGroup}
                  disabled={!deleteConfirmed}
                  className={`btn text-white transition-colors ${
                    deleteConfirmed
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  削除する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilySettingsDetail;
