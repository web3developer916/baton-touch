import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChildStore } from "../stores/useChildStore";
import GrowthRecordComponent from "../components/child/GrowthRecord";
import { ArrowLeft as ArrowLeftIcon } from "lucide-react";

const GrowthRecord = () => {
  const navigate = useNavigate();
  const childStore = useChildStore();
  const selectedChild = childStore.children.find(
    (child) => child.id === childStore.selectedChildId
  );
  const growthRecords = selectedChild?.growthRecords || [];

  const addGrowthRecord = (record) => {
    console.log(record, "record");
    childStore.updateChild(childStore.selectedChildId, {
      ...selectedChild,
      growthRecords: [
        ...growthRecords,
        {
          id: Date.now(),
          ...record,
        },
      ],
    });
  };

  const updateGrowthRecord = (record) => {
    const updatedRecords = growthRecords.map((r) =>
      r.id === record.id ? record : r
    );
    childStore.updateChild(childStore.selectedChildId, {
      ...selectedChild,
      growthRecords: updatedRecords,
    });
  };

  const deleteGrowthRecord = (recordId) => {
    const updatedRecords = growthRecords.filter((r) => r.id !== recordId);
    childStore.updateChild(childStore.selectedChildId, {
      ...selectedChild,
      growthRecords: updatedRecords,
    });
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
        <h1 className="text-2xl font-bold">成長記録</h1>
      </div>

      <GrowthRecordComponent
        records={growthRecords}
        onAdd={addGrowthRecord}
        onUpdate={updateGrowthRecord}
        onDelete={deleteGrowthRecord}
      />
    </div>
  );
};

export default GrowthRecord;
