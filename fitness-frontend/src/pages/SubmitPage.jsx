// src/pages/SubmitPage.jsx
import { useState } from 'react';

const SubmitPage = () => {
  const [steps, setSteps] = useState('');
  const [skipping, setSkipping] = useState('');
  const [skippingProof, setSkippingProof] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('steps', steps);
    formData.append('skipping', skipping);
    if (skippingProof) {
      formData.append('skippingProof', skippingProof);
    }

    // TODO: Replace with actual API call
    //console.log('Submitted:', { steps, skipping, skippingProof });
    alert('Submission received!');
    setSteps('');
    setSkipping('');
    setSkippingProof(null);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Today’s Data</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Steps (from Health app)</label>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="e.g., 8000"
          />
        </div>

        <div>
          <label className="block font-medium">Skipping Count</label>
          <input
            type="number"
            value={skipping}
            onChange={(e) => setSkipping(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="e.g., 200"
          />
        </div>

        <div>
          <label className="block font-medium">Skipping Proof</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setSkippingProof(e.target.files[0])}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">Upload photo/video as proof</p>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitPage;
