import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChildStore } from "../stores/useChildStore";
import DevelopmentRecordComponent from "../components/child/DevelopmentRecord";
import { ArrowLeft as ArrowLeftIcon, Milestone } from "lucide-react";

const DevelopmentRecord = () => {
  const navigate = useNavigate();
  const childStore = useChildStore();

  const selectedChild = childStore.children.find(
    (child) => child.id === childStore.selectedChildId
  );

  const updateDevelopmentRecord = (update) => {
    const updateDevelopmentData = {
      child_id: selectedChild.id,
      milestone: update.name,
      achieved_date: update.date,
    };
    childStore.updateDevelopmentInfo(updateDevelopmentData);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">発達記録</h1>
      </div>

      <DevelopmentRecordComponent onUpdate={updateDevelopmentRecord} />
    </div>
  );
};

export default DevelopmentRecord;
