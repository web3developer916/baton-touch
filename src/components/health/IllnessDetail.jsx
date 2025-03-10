import React from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import {
  X as XIcon,
  PencilIcon,
  TrashIcon,
  Plus as PlusIcon,
  Check as CheckIcon,
} from "lucide-react";

const IllnessDetail = ({
  illness,
  onClose,
  onEdit,
  onDelete,
  onToggleSymptomRecovery,
  onMarkAsRecovered,
  onAddSymptom,
  onAddVisit,
  onAddMedication,
  onEditVisit,
  onEditMedication,
}) => {
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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{illness.name}</h3>
            <p className="text-sm text-gray-500">
              {formatDate(illness.start_date)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(illness)}
              className="p-2 text-gray-400 hover:text-primary-500"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(illness.id)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* 症状 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">症状</h4>
              <button
                onClick={onAddSymptom}
                className="p-2 text-primary-600 hover:text-primary-700"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {illness.symptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{symptom.type}</p>
                      <p className="text-sm text-gray-600">
                        発症日:{" "}
                        {formatDate(symptom.onsetDate || illness.start_date)}
                      </p>
                      {symptom.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {symptom.description}
                        </p>
                      )}
                      {symptom.recoveryDate && (
                        <p className="text-sm text-green-600 mt-1">
                          完治日: {formatDate(symptom.recoveryDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          onToggleSymptomRecovery(illness, symptom)
                        }
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          symptom.recovered
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {symptom.recovered ? "完治" : "治療中"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 受診記録 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">受診記録</h4>
              <button
                onClick={onAddVisit}
                className="p-2 text-primary-600 hover:text-primary-700"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {illness.hospitalVisits?.map((visit) => (
                <div
                  key={visit.id}
                  onClick={() => onEditVisit(visit)}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{visit.hospitalName}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(visit.visitDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 完治記録 */}
          {!illness.endDate && (
            <div className="mt-4">
              <button
                onClick={() => onMarkAsRecovered(illness)}
                className="w-full flex items-center justify-center space-x-2 py-2 
                               btn bg-background text-primary-600 hover:bg-primary-50"
              >
                <CheckIcon className="w-4 h-4" />
                <span>完治を記録</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IllnessDetail;
