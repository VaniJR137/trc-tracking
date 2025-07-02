// RemarksPopup.jsx
import React from "react";

const RemarksPopup = ({ onCancel, onSubmit, remarkText, setRemarkText }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg text-center font-bold mb-4">Comment here!</h2>
        <textarea
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
          placeholder="Enter reason "
        ></textarea>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-1 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-1 rounded"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemarksPopup;
