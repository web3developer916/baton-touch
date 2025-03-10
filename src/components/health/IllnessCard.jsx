import React from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronRight as ChevronRightIcon } from "lucide-react";

const IllnessCard = ({ illness, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = parseISO(dateString);
      return format(date, "M月d日(E)", { locale: ja });
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "";
    }
  };

  return (
    <div
      onClick={() => onClick(illness)}
      className="bg-white rounded-2xl p-4 shadow-warm hover:shadow-warm-lg 
                  transition-all cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">{illness.name}</h3>
          <p className="text-sm text-gray-500">
            {formatDate(illness.start_date)}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            illness.endDate
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {illness.endDate ? "完治" : "治療中"}
        </div>
      </div>
    </div>
  );
};

export default IllnessCard;
