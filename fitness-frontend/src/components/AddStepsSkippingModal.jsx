import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddStepsSkippingModal = ({ isOpen, onClose, currentData, userId, onUpdate }) => {
  const [steps, setSteps] = useState(currentData?.steps || 0);
  const [skipping, setSkipping] = useState(currentData?.skipping || 0);
  const [newSteps, setNewSteps] = useState('');
  const [newSkipping, setNewSkipping] = useState('');
  const [stepsImage, setStepsImage] = useState(null);
  const [skippingImage, setSkippingImage] = useState(null);
  const token = localStorage.getItem("token");
  const [error, setError] = useState('');
  const BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    //console.log("Modal render - isOpen:", isOpen);
    if (isOpen) {
      //console.log("API URL inside modal:", process.env.REACT_APP_API_URL);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentData) {
      setSteps(currentData.steps || 0);
      setSkipping(currentData.skipping || 0);
      setNewSteps('');
      setNewSkipping('');
      setStepsImage(null);
      setSkippingImage(null);
      setError('');
    }
  }, [isOpen, currentData]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newSteps === '' && newSkipping === '') {
      setError('Please enter at least one new count.');
      return;
    }

    const ns = Number(newSteps);
    const nk = Number(newSkipping);

    if (newSteps !== '') {
      if (isNaN(ns) || ns < steps) {
        setError(`New Steps must be a number ≥ current steps (${steps}).`);
        return;
      }
      if (!stepsImage) {
        setError('Please attach a proof for Steps.');
        return;
      }
    }

    if (newSkipping !== '') {
      if (isNaN(nk) || nk < skipping) {
        setError(`New Skipping must be a number ≥ current skipping (${skipping}).`);
        return;
      }
      if (!skippingImage) {
        setError('Please attach a proof for Skipping.');
        return;
      }
    }

    const isVideo = (file) => file && file.type.startsWith('video/');
    const isStepsVideo = stepsImage && isVideo(stepsImage);
    const isSkippingVideo = skippingImage && isVideo(skippingImage);
    const isVideoUpload = isStepsVideo || isSkippingVideo;

    const formData = new FormData();
    formData.append('date', todayStr);
    formData.append('userId', userId);

    let endpoint = `${BASE_URL}/api/fitness/steps-skipping`;

    if (isVideoUpload) {
      endpoint = `${BASE_URL}/api/fitness/upload-video`;
      formData.append('video', isSkippingVideo ? skippingImage : stepsImage);
      formData.append('skipping', nk); // ✅ use correct field name
    } else {
      if (newSteps !== '') {
        formData.append('steps', ns);
        formData.append('stepsImage', stepsImage);
      }
      if (newSkipping !== '') {
        formData.append('skipping', nk);
        formData.append('skippingImage', skippingImage);
      }
    }

    try {
      const res = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,  // 🔥 this is what was missing
        },
      });
      if (res.data.success) {
        onUpdate(res.data.updatedData || res.data.updated); // handle both response shapes
        onClose();
      } else {
        setError(res.data.message || 'Failed to update.');
      }
    } catch (err) {
      setError('Error uploading data. Please try again.');
      console.error(err);
    }
  };



  const [year, month, day] = todayStr.split("-");
  const formattedToday = `${day}-${month}-${year}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          borderRadius: 8,
          padding: 24,
          width: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h2>Add Steps / Skipping for {formattedToday}</h2>

        <div>
          <strong>Current Steps:</strong> {steps}
        </div>
        <input
          type="number"
          min={steps}
          placeholder="New Steps (≥ current)"
          value={newSteps}
          onChange={(e) => setNewSteps(e.target.value)}
        />
        <div>
          <label htmlFor="stepsImage" style={{ display: 'block', marginBottom: 4 }}>
            Upload Image Proof for Steps *
          </label>
          <input
            id="stepsImage"
            type="file"
            accept="image/*"
            onChange={(e) => setStepsImage(e.target.files[0])}
          />
        </div>

        <div>
          <strong>Current Skipping:</strong> {skipping}
        </div>
        <input
          type="number"
          min={skipping}
          placeholder="New Skipping (≥ current)"
          value={newSkipping}
          onChange={(e) => setNewSkipping(e.target.value)}
        />
        <div style={{ marginTop: 12 }}>
          <label htmlFor="skippingImage" style={{ display: 'block', marginBottom: 4 }}>
            Upload Image Proof for Skipping *
          </label>
          <input
            id="skippingImage"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setSkippingImage(e.target.files[0])}
          />
        </div>


        {error && (
          <div style={{ color: 'red', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" onClick={onClose} style={{ flex: 1, marginRight: 8 }}>
            Cancel
          </button>
          <button type="submit" style={{ flex: 1 }}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStepsSkippingModal;
