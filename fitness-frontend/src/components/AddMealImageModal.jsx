import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMealImageModal = ({ isOpen, onClose, userId, onUpdate }) => {
  const [mealType, setMealType] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const BASE_URL = process.env.REACT_APP_API_URL;
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (isOpen) {
      setMealType('');
      setImages([]);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mealType) {
      setError('Please select a meal type.');
      return;
    }

    if (!images.length) {
      setError('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('mealType', mealType);
    for (const file of images) {
      formData.append('mealImages', file);  // must be 'mealImages' to match backend
    }

    try {
      const token = localStorage.getItem('token'); // assuming token is stored here
      const res = await axios.post(`${BASE_URL}/api/meals`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      onUpdate?.(res.data.meal); // backend returns { message, meal }
      onClose();
    } catch (err) {
      setError('Error uploading meal image. Please try again.');
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
        <h2>Upload Meal for {formattedToday}</h2>

        <label htmlFor="mealType">Meal Type *</label>
        <select
          id="mealType"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        >
          <option value="">-- Select Meal --</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>

        <div>
          <label htmlFor="mealImages" style={{ display: 'block', marginBottom: 4 }}>
            Upload Meal Images *
          </label>
          <input
            id="mealImages"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
        </div>

        {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}

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

export default AddMealImageModal;
