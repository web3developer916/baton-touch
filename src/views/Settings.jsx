import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  User as UserIcon,
  Bell as BellIcon,
  BookOpen as BookOpenIcon,
  HelpCircle as HelpCircleIcon,
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
  FileText as FileTextIcon,
  LogOut as LogOutIcon,
  Shield as ShieldIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Mail as MailIcon,
} from "lucide-react";
import { useFamilyStore } from "../stores/useFamilyStore";
import { useAuthStore } from "../lib/auth";

const Settings = () => {
  const familyStore = useFamilyStore();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  // 管理者権限を持っているかどうか
  const isAdmin = familyStore.selectedFamily?.isAdmin;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-600"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-base font-medium absolute left-1/2 -translate-x-1/2">
              設定
            </h1>
            <button
              onClick={() => {
                if (confirm("ログアウトしてもよろしいですか？")) {
                  signOut();
                  navigate("/login");
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-600"
            >
              <LogOutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 pt-16 pb-8">
        {/* アカウント */}
        <div className="card mb-6">
          <Link
            to="/settings/account"
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 rounded-xl">
                <UserIcon className="w-5 h-5 text-primary-500" />
              </div>
              <span className="font-medium">アカウント</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* 一般設定 */}
        <div className="space-y-4 mb-6">
          <h2 className="text-sm font-medium text-gray-500 px-1">一般</h2>
          <div className="card space-y-2">
            <Link
              to="/settings/family"
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-xl">
                  <UsersIcon className="w-5 h-5 text-primary-500" />
                </div>
                <span className="font-medium">家族グループ設定</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Link>

            <Link
              to="/settings/notes"
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-xl">
                  <BookOpenIcon className="w-5 h-5 text-green-500" />
                </div>
                <span className="font-medium">育児メモ設定</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Link>

            <Link
              to="/settings/notifications"
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <BellIcon className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-medium">プッシュ通知</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* ヘルプ */}
        <div className="space-y-4 mb-6">
          <h2 className="text-sm font-medium text-gray-500 px-1">ヘルプ</h2>
          <div className="card space-y-2">
            <a
              href="https://innovesta.jp/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-50 rounded-xl">
                  <MailIcon className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-medium">お問い合わせ</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </a>

            <Link
              to="/settings/faq"
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-50 rounded-xl">
                  <HelpCircleIcon className="w-5 h-5 text-orange-500" />
                </div>
                <span className="font-medium">よくある質問</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* アプリ情報 */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-500 px-1">アプリ情報</h2>
          <div className="card space-y-2">
            <Link
              to="/settings/terms"
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <FileTextIcon className="w-5 h-5 text-gray-500" />
                </div>
                <span className="font-medium">利用規約</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Link>

            <Link
              to="/settings/privacy"
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <ShieldIcon className="w-5 h-5 text-gray-500" />
                </div>
                <span className="font-medium">プライバシーポリシー</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Link>
          </div>

          {/* ログアウト */}
          <div className="card mt-4 mb-2">
            <button
              onClick={() => {
                if (confirm("ログアウトしてもよろしいですか？")) {
                  signOut();
                  navigate("/login");
                }
              }}
              className="w-full flex items-center justify-between p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-50 rounded-xl">
                  <LogOutIcon className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-medium">ログアウト</span>
              </div>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
