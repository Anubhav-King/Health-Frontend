import React, { useState, useEffect } from "react";
import axios from "axios";

const AddStepsSkippingModal = ({ isOpen, onClose, currentData, userId, onUpdate }) => {
  const [steps, setSteps] = useState(currentData?.steps || 0);
  const [skipping, setSkipping] = useState(currentData?.skipping || 0);
  const [newSteps, setNewSteps] = useState("");
  const [newSkipping, setNewSkipping] = useState("");
  const [stepsImage, setStepsImage] = useState(null);
  const [skippingImage, setSkippingImage] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const BASE_URL = process.env.REACT_APP_API_URL;

  const todayStr = new Date().toISOString().slice(0, 10);
  const [year, month, day] = todayStr.split("-");
  const formattedToday = `${day}-${month}-${year}`;

  useEffect(() => {
    if (isOpen && currentData) {
      setSteps(currentData.steps || 0);
      setSkipping(currentData.skipping || 0);
      setNewSteps("");
      setNewSkipping("");
      setStepsImage(null);
      setSkippingImage(null);
      setError("");
    }
  }, [isOpen, currentData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newSteps === "" && newSkipping === "") {
      setError("Please enter at least one new count.");
      return;
    }

    const ns = Number(newSteps);
    const nk = Number(newSkipping);

    if (newSteps !== "") {
      if (isNaN(ns) || ns < steps) {
        setError(`New Steps must be ≥ current steps (${steps}).`);
        return;
      }
      if (!stepsImage) {
        setError("Please attach a proof for Steps.");
        return;
      }
    }

    if (newSkipping !== "") {
      if (isNaN(nk) || nk < skipping) {
        setError(`New Skipping must be ≥ current skipping (${skipping}).`);
        return;
      }
      if (!skippingImage) {
        setError("Please attach a proof for Skipping.");
        return;
      }
    }

    const isVideo = (file) => file && file.type.startsWith("video/");
    const isStepsVideo = stepsImage && isVideo(stepsImage);
    const isSkippingVideo = skippingImage && isVideo(skippingImage);
    const isVideoUpload = isStepsVideo || isSkippingVideo;

    const formData = new FormData();
    formData.append("date", todayStr);
    formData.append("userId", userId);

    let endpoint = `${BASE_URL}/api/fitness/steps-skipping`;

    if (isVideoUpload) {
      endpoint = `${BASE_URL}/api/fitness/upload-video`;
      formData.append("video", isSkippingVideo ? skippingImage : stepsImage);
      formData.append("skipping", nk);
    } else {
      if (newSteps !== "") {
        formData.append("steps", ns);
        formData.append("stepsImage", stepsImage);
      }
      if (newSkipping !== "") {
        formData.append("skipping", nk);
        formData.append("skippingImage", skippingImage);
      }
    }

    try {
      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        onUpdate(res.data.updatedData || res.data.updated);
        onClose();
      } else {
        setError(res.data.message || "Failed to update.");
      }
    } catch (err) {
      setError("Error uploading data. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold text-center mb-2">
          Add Steps / Skipping for {formattedToday}
        </h2>

        {/* Steps Section */}
        <div>
          <p className="font-medium">Current Steps: {steps}</p>
          <input
            type="number"
            min={steps}
            placeholder="New Steps (≥ current)"
            value={newSteps}
            onChange={(e) => setNewSteps(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
          <label
            htmlFor="stepsImage"
            className="block font-medium mt-2 mb-1"
          >
            Upload Proof for Steps *
          </label>
          <input
            id="stepsImage"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setStepsImage(e.target.files[0])}
            className="w-full"
          />
        </div>

        {/* Skipping Section */}
        <div>
          <p className="font-medium">Current Skipping: {skipping}</p>
          <input
            type="number"
            min={skipping}
            placeholder="New Skipping (≥ current)"
            value={newSkipping}
            onChange={(e) => setNewSkipping(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
          <label
            htmlFor="skippingImage"
            className="block font-medium mt-2 mb-1"
          >
            Upload Proof for Skipping *
          </label>
          <input
            id="skippingImage"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setSkippingImage(e.target.files[0])}
            className="w-full"
          />
        </div>

        {error && <div className="text-red-600 font-semibold text-sm">{error}</div>}

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

export default AddStepsSkippingModal;
