import React, { useState, useEffect } from "react";
import {
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import { useChildStore } from "../../stores/useChildStore";

const DevelopmentRecord = ({ onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { developmentInfo } = useChildStore();

  // 月齢の選択肢を生成
  const months = Array.from({ length: 36 }, (_, i) => {
    const month = i + 1;
    return `${month}ヶ月頃`;
  });

  const [milestones, setMilestones] = useState([
    { id: 1, name: "首すわり", achieved: false, date: "", note: "" },
    { id: 2, name: "寝返り", achieved: false, date: "", note: "" },
    { id: 3, name: "ずりばい", achieved: false, date: "", note: "" },
    { id: 4, name: "お座り", achieved: false, date: "", note: "" },
    { id: 5, name: "ハイハイ", achieved: false, date: "", note: "" },
    { id: 6, name: "つかまり立ち", achieved: false, date: "", note: "" },
    { id: 7, name: "一人歩き", achieved: false, date: "", note: "" },
    { id: 8, name: "おしゃべり（単語）", achieved: false, date: "", note: "" },
    {
      id: 9,
      name: "トイレ（夜はおむつ）",
      achieved: false,
      date: "",
      note: "",
    },
    { id: 10, name: "おむつ卒業", achieved: false, date: "", note: "" },
    { id: 11, name: "会話", achieved: false, date: "", note: "" },
  ]);

  useEffect(() => {
    if (developmentInfo?.length) {
      setMilestones((prevMilestones) =>
        prevMilestones.map((milestone) => {
          const matchingInfo = developmentInfo.find(
            (info) => info.milestone === milestone.name
          );
          return matchingInfo
            ? {
                ...milestone,
                date: matchingInfo.achieved_date,
              }
            : milestone;
        })
      );
    }
  }, [developmentInfo]);

  const [updatedMilestone, setUpdatedMilestone] = useState(null);

  useEffect(() => {
    if (updatedMilestone) {
      onUpdate(updatedMilestone);
      setUpdatedMilestone(null);
    }
  }, [updatedMilestone]);

  const toggleAchieved = (id) => {
    setMilestones((prev) =>
      prev.map((milestone) =>
        milestone.id === id
          ? { ...milestone, achieved: !milestone.achieved }
          : milestone
      )
    );
  };

  const updateMilestoneDate = (id, date) => {
    setMilestones((prev) =>
      prev.map((milestone) => {
        if (milestone.id === id) {
          const updatedMilestone = { ...milestone, date, achieved: false };
          setUpdatedMilestone(updatedMilestone);
          return updatedMilestone;
        }
        return milestone;
      })
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">発達記録</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:text-primary-600 transition-colors"
        >
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-white rounded-xl p-4 shadow-warm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{milestone.name}</span>
                <span>{milestone.date}</span>
                <input
                  type="checkbox"
                  checked={milestone.achieved}
                  onChange={() => toggleAchieved(milestone.id)}
                  className="input"
                />
              </div>
              {milestone.achieved && (
                <div className="mt-2">
                  <select
                    value={milestone.date}
                    onChange={(e) =>
                      updateMilestoneDate(milestone.id, e.target.value)
                    }
                    className="input w-full text-sm py-1.5"
                  >
                    <option value="">時期: 不明</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        時期: {month}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DevelopmentRecord;
