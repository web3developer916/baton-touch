import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  User as UserIcon,
  ChevronRight as ChevronRightIcon,
  Mail as MailIcon,
  Key as KeyIcon,
  Trash2 as Trash2Icon,
  X as XIcon,
} from "lucide-react";
// import { useAuth } from "../context/AuthContext";
import { useAuthStore } from "../lib/auth";

const AccountSettings = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const { user, profile, updateProfile, deleteProfile } = useAuthStore();

  console.log(profile, "uyser");

  // ランダムな色を生成する関数
  const getRandomColor = () => {
    const colors = [
      "bg-red-100 text-red-600",
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
      "bg-orange-100 text-orange-600",
      "bg-teal-100 text-teal-600",
      "bg-cyan-100 text-cyan-600",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 最初の文字を取得する関数
  const getInitial = (name) => {
    return name.charAt(0);
  };

  // ランダムな色を保持するステート
  const [iconColor] = useState(getRandomColor());

  // ユーザー情報
  const [userInfo, setUserInfo] = useState({
    name: profile.name,
    email: profile.email,
  });

  // モーダルの表示状態
  const [showEditNameForm, setShowEditNameForm] = useState(false);
  const [showEditEmailForm, setShowEditEmailForm] = useState(false);
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] =
    useState(false);

  // フォームの状態
  const [nameForm, setNameForm] = useState({
    name: "",
  });

  const [emailForm, setEmailForm] = useState({
    email: "",
  });

  const [passwordResetForm, setPasswordResetForm] = useState({
    email: "",
  });

  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  // 名前の変更
  const saveName = () => {
    setUserInfo((prev) => ({
      ...prev,
      name: nameForm.name,
    }));
    updateProfile({ ...profile, name: nameForm.name });
    setShowEditNameForm(false);
    setNameForm({ name: "" });
  };

  // メールアドレスの変更
  const requestEmailChange = async () => {
    // TODO: メールアドレス変更のメールを送信
    alert(
      "メールアドレス変更のメールを送信しました。メールの指示に従って変更を完了してください。"
    );
    // await onEmailChange(email);
    // setMessage("確認メールを送信しました。");
    setShowEditEmailForm(false);
    setEmailForm({
      email: "",
    });
  };

  // パスワードの変更
  const requestPasswordReset = () => {
    // TODO: パスワードリセットのメールを送信
    alert(
      "パスワードリセットのメールを送信しました。メールの指示に従ってパスワードを変更してください。"
    );
    setShowPasswordResetForm(false);
    setPasswordResetForm({
      email: "",
    });
  };

  // アカウントの削除
  const deleteAccount = () => {
    deleteProfile(profile.id, { ...profile, state: "deleted" });
    if (deleteConfirmed) {
      // アカウント削除の処理
      navigate("/login");
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
              アカウント設定
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-16">
        {/* プロフィール情報 */}
        <div className="card mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div
              className={`w-20 h-20 rounded-full ${iconColor} flex items-center justify-center`}
            >
              <span className="text-3xl font-bold">
                {getInitial(userInfo.name)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{userInfo.name}</h2>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="space-y-2">
            <button
              onClick={() => setShowEditNameForm(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-xl">
                  <UserIcon className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium">名前</p>
                  <p className="text-sm text-gray-500">{userInfo.name}</p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowEditEmailForm(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <MailIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">メールアドレス</p>
                  <p className="text-sm text-gray-500">{userInfo.email}</p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowPasswordResetForm(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-xl">
                  <KeyIcon className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">パスワード変更</p>
                  <p className="text-sm text-gray-500">********</p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* アカウント削除 */}
        <div className="card">
          <button
            onClick={() => setShowDeleteAccountConfirm(true)}
            className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-red-50 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-xl">
                <Trash2Icon className="w-5 h-5 text-red-500" />
              </div>
              <span className="font-medium">アカウントを削除</span>
            </div>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* モーダル類 */}
      {/* 名前変更モーダル */}
      {showEditNameForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">名前を変更</h3>
              <button
                onClick={() => setShowEditNameForm(false)}
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
                    名前
                  </label>
                  <input
                    type="text"
                    value={nameForm.name}
                    onChange={(e) =>
                      setNameForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="input w-full"
                    placeholder="名前を入力"
                    required
                  />
                </div>
              </div>
            </form>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditNameForm(false)}
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

      {/* メールアドレス変更モーダル */}
      {showEditEmailForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">メールアドレスの変更</h3>
              <button
                onClick={() => setShowEditEmailForm(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestEmailChange();
              }}
              className="modal-body"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    登録済みのメールアドレス
                  </label>
                  <input
                    type="email"
                    value={emailForm.email}
                    onChange={(e) =>
                      setEmailForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="input w-full"
                    placeholder="現在のメールアドレスを入力"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  メールアドレス変更のメールを送信します。メールの指示に従って変更を完了してください。
                </p>
              </div>
            </form>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditEmailForm(false)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={requestEmailChange}
                  className="btn btn-primary"
                >
                  変更
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* パスワードリセットモーダル */}
      {showPasswordResetForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold">パスワードのリセット</h3>
              <button
                onClick={() => setShowPasswordResetForm(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestPasswordReset();
              }}
              className="modal-body"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    登録済みのメールアドレス
                  </label>
                  <input
                    type="email"
                    value={passwordResetForm.email}
                    onChange={(e) =>
                      setPasswordResetForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="input w-full"
                    placeholder="メールアドレスを入力"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  パスワードリセットのメールを送信します。メールの指示に従って新しいパスワードを設定してください。
                </p>
              </div>
            </form>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordResetForm(false)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={requestPasswordReset}
                  className="btn btn-primary"
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* アカウント削除確認モーダル */}
      {showDeleteAccountConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-bold text-red-500">
                アカウントを削除
              </h3>
            </div>

            <div className="modal-body">
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4">
                <p className="font-bold mb-2">⚠️ 注意</p>
                <p>
                  アカウントを削除すると、以下の情報がすべて削除され、復元できません：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>子供の記録</li>
                  <li>健康記録</li>
                  <li>育児メモ</li>
                  <li>タスク</li>
                  <li>家族グループ情報</li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  本当にアカウントを削除しますか？
                </p>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={deleteConfirmed}
                      onChange={(e) => setDeleteConfirmed(e.target.checked)}
                      className="input"
                    />
                    <span>
                      上記の内容を理解し、アカウントを削除することに同意します
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteAccountConfirm(false)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={deleteAccount}
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

export default AccountSettings;
