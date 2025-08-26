import React, { useState, useEffect } from "react";
import axios from "axios";

const AddMealImageModal = ({ isOpen, onClose, userId, onUpdate }) => {
  const [mealType, setMealType] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const BASE_URL = process.env.REACT_APP_API_URL;
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (isOpen) {
      setMealType("");
      setImages([]);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!mealType) {
      setError("Please select a meal type.");
      return;
    }

    if (!images.length) {
      setError("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("mealType", mealType);
    for (const file of images) {
      formData.append("mealImages", file); // must match backend
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/api/meals`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      onUpdate?.(res.data.meal);
      onClose();
    } catch (err) {
      setError("Error uploading meal image. Please try again.");
      console.error(err);
    }
  };

  const [year, month, day] = todayStr.split("-");
  const formattedToday = `${day}-${month}-${year}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold text-center mb-2">
          Upload Meal for {formattedToday}
        </h2>

        <div>
          <label htmlFor="mealType" className="block font-medium mb-1">
            Meal Type *
          </label>
          <select
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Meal --</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        <div>
          <label htmlFor="mealImages" className="block font-medium mb-1">
            Upload Meal Images *
          </label>
          <input
            id="mealImages"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="w-full"
          />
        </div>

        {error && (
          <div className="text-red-600 font-semibold text-sm">{error}</div>
        )}

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMealImageModal;
