import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Thermometer as ThermometerIcon,
  Activity as ActivityIcon,
  Syringe as SyringeIcon,
  Stethoscope as StethoscopeIcon,
  Pill as PillIcon,
} from "lucide-react";

const HealthTimeline = ({ records: allRecords }) => {
  const [showAll, setShowAll] = useState(false);
  const recordsToShow = showAll ? allRecords : allRecords.slice(0, 10);

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "M月d日(E)", { locale: ja });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "temperature":
        return ThermometerIcon;
      case "symptom":
        return ActivityIcon;
      case "vaccination":
        return SyringeIcon;
      case "checkup":
        return StethoscopeIcon;
      case "medication":
        return PillIcon;
      default:
        return ActivityIcon;
    }
  };

  const getEventIconClass = (type) => {
    switch (type) {
      case "illness":
        return "bg-yellow-50 text-yellow-500";
      case "symptom":
        return "bg-orange-50 text-orange-500";
      case "recovery":
        return "bg-green-50 text-green-500";
      case "temperature":
        return "bg-red-50 text-red-500";
      case "vaccination":
        return "bg-green-50 text-green-500";
      case "checkup":
        return "bg-blue-50 text-blue-500";
      case "medication":
        return "bg-orange-50 text-orange-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const getEventTitle = (record) => {
    console.log(record, "record");

    if (record.title) return record.title;

    switch (record.type) {
      case "temperature":
        return `体温: ${record.data.temperature}℃`;
      case "vaccination":
        return `予防接種: ${record.vaccines.join("・")}`;
      case "checkup":
        return `健診: ${record.type}`;
      case "medication":
        return `服薬${record.endDate ? "終了" : "開始"}: ${record.name}`;
      default:
        return "記録";
    }
  };

  const shouldShowTime = (record) => {
    // 服薬記録と予防接種は時間を表示しない
    if (record.type === "medication" || record.type === "vaccination")
      return false;
    return true;
  };

  // 日付でグループ化
  const groupedRecords = recordsToShow.reduce((groups, record) => {
    const date = record.date || record.startDate || record.createdAt;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {});

  // 日付順にソート
  const sortedDates = Object.keys(groupedRecords).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="bg-white rounded-2xl shadow-warm p-6">
      <h3 className="text-xl font-bold mb-6">健康記録タイムライン</h3>

      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date} className="relative">
            <div className="sticky top-0 bg-white z-10 py-2 mb-4">
              <h4 className="text-sm font-bold text-gray-900">
                {formatDate(date)}
              </h4>
            </div>

            <div className="space-y-6 pl-4 border-l-2 border-gray-100">
              {groupedRecords[date].map((record, index) => (
                <div
                  key={record.id || index}
                  className="relative flex items-start space-x-4 pl-6"
                >
                  <div
                    className={`absolute left-0 top-0 -translate-x-[1.6rem] p-2 rounded-xl flex-shrink-0 bg-white shadow-warm ${getEventIconClass(
                      record.type
                    )}`}
                  >
                    {React.createElement(getEventIcon(record.type), {
                      className: "w-5 h-5",
                    })}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-gray-900">
                        {getEventTitle(record)}
                      </p>
                      {shouldShowTime(record) && (
                        <p className="text-sm text-gray-500 ml-4"></p>
                      )}
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                        {record.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {allRecords.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ActivityIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">記録がありません</p>
            <p className="text-sm text-gray-400 mt-1">
              新しい記録を追加してください
            </p>
          </div>
        )}

        {!showAll && allRecords.length > 10 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="btn bg-white text-primary-600 hover:bg-primary-50"
            >
              もっと見る ({allRecords.length - 10}件)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTimeline;
