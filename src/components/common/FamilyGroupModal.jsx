import React from "react";
import { X as XIcon, Check as CheckIcon } from "lucide-react";
import { useFamilyStore } from "../../stores/useFamilyStore";

const FamilyGroupModal = ({ onClose }) => {
  const familyStore = useFamilyStore();
  const families = familyStore.families;
  const selectedFamilyId = familyStore.selectedFamilyId;

  const selectFamily = (family) => {
    // Update the store using the update method
    console.log(family, "family");
    familyStore.updateSelectedFamily(family.id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header flex justify-between items-center">
          <h3 className="text-xl font-bold">家族グループを切り替え</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-2">
            {families.map((family) => (
              <div
                key={family.id}
                onClick={() => selectFamily(family)}
                className={`w-full p-4 rounded-xl transition-colors cursor-pointer ${
                  family.id === selectedFamilyId
                    ? "bg-primary-50"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{family.name}</h4>
                    <p className="text-sm text-gray-500">
                      メンバー: {family.family_members?.length || 0}人
                    </p>
                  </div>
                  {family.id === selectedFamilyId && (
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-primary-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyGroupModal;
