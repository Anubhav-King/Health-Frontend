// src/pages/RulesPage.jsx
const RulesPage = () => {
    return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Challenge Rules</h1>

      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>The challenge runs for 30 days from the start date.</li>
        <li>You must log in daily to submit your step count or skipping data.</li>
        <li>Only steps tracked via Health app or approved devices will be accepted.</li>
        <li>Skipping must be verified via HaloHop smart rope or photo/video upload.</li>
        <li>Daily and weekly leaderboard rankings will be based on total steps.</li>
        <li>Any suspicious data will be reviewed and may be disqualified.</li>
        <li>All decisions by the admins are final.</li>
      </ul>

      <div className="mt-6 text-sm text-gray-500">
        For any issues, contact the challenge coordinator or reach out via the group WhatsApp.
      </div>
    </div>
  );
};

export default RulesPage;
