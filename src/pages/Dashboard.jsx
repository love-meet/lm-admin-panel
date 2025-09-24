import React from "react";

const Dashboard = () => {
  const stats = [
    { title: "Total Users", value: "1,245", color: "bg-blue-500" },
    { title: "Active Subscriptions", value: "865", color: "bg-green-500" },
    { title: "Transactions", value: "$12,430", color: "bg-yellow-500" },
    { title: "Reports", value: "34", color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here’s an overview of the system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} text-white rounded-xl p-6 shadow-md`}
          >
            <h2 className="text-lg font-medium">{item.title}</h2>
            <p className="text-2xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          <li className="flex justify-between border-b pb-2">
            <span className="text-gray-700">New user registered</span>
            <span className="text-sm text-gray-500">2 mins ago</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="text-gray-700">Admin updated settings</span>
            <span className="text-sm text-gray-500">15 mins ago</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-700">Payment processed</span>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
