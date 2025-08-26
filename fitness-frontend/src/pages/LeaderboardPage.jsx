import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/DashboardService";
import UserViewModal from "../components/UserViewModal";

const periodMap = {
  today: "daily",
  yesterday: "yesterday",
  wtd: "weekly",
  mtd: "monthly",
  lastMonth: "lastMonth",
};

const LeaderboardPage = () => {
  const [period, setPeriod] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [viewingUserId, setViewingUserId] = useState(null);

  const role = localStorage.getItem("activeRole")?.toLowerCase();

  useEffect(() => {
    const fetch = async () => {
      try {
        const apiPeriod = periodMap[period] || "";
        const data = await getLeaderboard(apiPeriod);
        setEntries(data?.leaderboard || []);
        setError("");
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setError("Failed to load leaderboard.");
        setEntries([]);
      }
    };
    fetch();
  }, [period]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Leaderboard
      </h1>

      {/* Filter dropdown */}
      <div className="flex justify-center mb-6">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-full sm:w-auto border px-4 py-2 rounded shadow"
        >
          <option value="">All Users</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="wtd">Week to Date</option>
          <option value="mtd">Month to Date</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {entries.length === 0 ? (
        <p className="text-gray-500 text-center">No data available.</p>
      ) : (
        <>
          {/* Desktop/tablet view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  {period && <th className="py-3 px-4 text-left">Ranking</th>}
                  <th className="py-3 px-4 text-left">Steps</th>
                  <th className="py-3 px-4 text-left">Skipping</th>
                  {role === "excom" && (
                    <th className="py-3 px-4 text-left">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => {
                  const uid = entry.userId || entry._id || entry.id;

                  return (
                    <tr
                      key={uid || idx}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{entry.name}</td>
                      {period && <td className="py-3 px-4">{idx + 1}</td>}
                      <td className="py-3 px-4">{entry.totalSteps || 0}</td>
                      <td className="py-3 px-4">{entry.totalSkipping || 0}</td>
                      {period && role === "excom" && (
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setViewingUserId(uid)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            View
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="sm:hidden space-y-4">
            {entries.map((entry, idx) => {
              const uid = entry.userId || entry._id || entry.id;
              return (
                <div
                  key={uid || idx}
                  className="p-4 bg-white rounded shadow border"
                >
                  <p>
                    <strong>Name:</strong> {entry.name}
                  </p>
                  {period && (
                    <p>
                      <strong>Ranking:</strong> {idx + 1}
                    </p>
                  )}
                  <p>
                    <strong>Steps:</strong> {entry.totalSteps || 0}
                  </p>
                  <p>
                    <strong>Skipping:</strong> {entry.totalSkipping || 0}
                  </p>
                  {period && role === "excom" && (
                    <button
                      onClick={() => setViewingUserId(uid)}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                    >
                      View
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal section */}
          {viewingUserId && (
            <UserViewModal
              isOpen={true}
              userId={viewingUserId}
              period={period}
              onClose={() => setViewingUserId(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
