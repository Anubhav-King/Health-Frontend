  // src/pages/DashboardPage.jsx
  import { useEffect, useState } from "react";
  import { getDashboardData } from "../services/DashboardService";
  import { useNavigate } from "react-router-dom";
  import AddStepsSkippingModal from "../components/AddStepsSkippingModal";
import AddMealImageModal from "../components/AddMealImageModal";

  const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [stepsModalOpen, setStepsModalOpen] = useState(false);
    const [mealModalOpen, setMealModalOpen] = useState(false);
    const [stepsSkippingData, setStepsSkippingData] = useState({
      steps: 0,
      skipping: 0,
    });
    const [user, setUser] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
      const fetch = async () => {
        try {
          const res = await getDashboardData();
          setData(res);

          // ✅ Add this line to extract user
          setUser(res.user);

          // Initialize steps/skipping from fetched data
          setStepsSkippingData({
            steps: res.todaySteps || 0,
            skipping: res.todaySkips || 0,
          });
        } catch (err) {
          console.error("Dashboard fetch error:", err);
          setError("Failed to load dashboard.");
        }
      };
      fetch();
    }, []);


    const handleUpdate = (updatedData) => {
      // Update local state after successful modal submit
      setStepsSkippingData({
        steps: updatedData.steps,
        skipping: updatedData.skipping,
      });
      // Optionally update main dashboard data too
      setData((prev) => ({
        ...prev,
        todaySteps: updatedData.steps,
        todaySkips: updatedData.skipping,
      }));
    };

    if (error) {
      return <p className="text-center text-red-500 mt-6">{error}</p>;
    }

    if (!data) {
      return <p className="text-center mt-6">Loading...</p>;
    }

    const {
      stepGoal,
      skipGoal,
      weeklySteps,
      weeklySkips,
    } = data;

    //console.log("USER ID passed to modal:", user?.id);

    const handleLogout = () => {
      localStorage.clear(); // or localStorage.removeItem('token') if you're only storing token
      window.location.href = "/login"; // or use navigate("/login") if you're using react-router
    };



    return (
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}</h1>

        <div className="bg-white shadow rounded p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Today's Progress</h2>
          <p>
            <strong>Steps:</strong> {data.todaySteps} / {data.stepGoal}{" "}
            ({Math.round((data.todaySteps / data.stepGoal) * 100)}%)
          </p>
          <p>
            <strong>Skips:</strong> {data.todaySkips} / {data.skipGoal}{" "}
            ({Math.round((data.todaySkips / data.skipGoal) * 100)}%)
          </p>
        </div>

        <div className="bg-white shadow rounded p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">This Week</h2>
          <p>Total Steps: {weeklySteps}</p>
          <p>Total Skips: {weeklySkips}</p>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            className="bg-blue-600 text-white py-2 rounded"
            onClick={() => navigate("/leaderboard")}
          >
            View Leaderboard
          </button>

          <button
            className="bg-green-600 text-white py-2 rounded"
            onClick={() => navigate("/rules")}
          >
            Challenge Rules
          </button>

          <button
            className="bg-gray-800 text-white py-2 rounded"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>

          <button
            className="bg-indigo-600 text-white py-2 rounded"
            onClick={() => setStepsModalOpen(true)}
          >
            Add Steps / Skipping
          </button>

          <button
            className="bg-yellow-600 text-white py-2 rounded"
            onClick={() => setMealModalOpen(true)}
          >
            Upload Meal Image
          </button>


          {user && (
            <AddStepsSkippingModal
              isOpen={stepsModalOpen}
              onClose={() => setStepsModalOpen(false)}
              currentData={stepsSkippingData}
              userId={user.id}
              onUpdate={handleUpdate}
            />
          )}

          {user && (
            <AddMealImageModal
              isOpen={mealModalOpen}
              onClose={() => setMealModalOpen(false)}
              userId={user.id}
              onUpdate={() => {}} // optional
            />
          )}

        </div>
      </div>
    );
  };

  export default DashboardPage;
