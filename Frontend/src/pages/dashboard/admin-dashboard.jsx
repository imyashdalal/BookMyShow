import { useState } from "react";

// Tabs
import CreateTheatreTab from "./components/admin/create-theatre";
import CreateMovieTab from "./components/admin/create-movie";
import CreateTheatreHallTab from "./components/admin/create-thatre-hall";
import CreateShowTab from "./components/admin/create-show";
import AnalyticsOverview from "./components/admin/analytics-overview";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  const selectTab = (id) => setSelectedTab(id);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-neutral p-6 shadow-xl">
        <div className="mb-8">
          <h5 className="text-xl font-bold text-primary mb-2">Admin Panel</h5>
          <div className="divider my-2"></div>
        </div>

        {/* Overview Section */}
        <div className="mb-6">
          <h6 className="font-bold text-lg mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard
          </h6>
          <ul className="menu bg-neutral rounded-box">
            <li onClick={() => selectTab("overview")}>
              <a className={selectedTab === "overview" ? "active" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
                Analytics Overview
              </a>
            </li>
          </ul>
        </div>

        {/* Create Section */}
        <div className="mb-6">
          <h6 className="font-bold text-lg mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create
          </h6>
          <ul className="menu bg-neutral rounded-box">
            <li onClick={() => selectTab("create-theatre")}>
              <a className={selectedTab === "create-theatre" ? "active" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Theatre
              </a>
            </li>
            <li onClick={() => selectTab("create-theatre-halls")}>
              <a className={selectedTab === "create-theatre-halls" ? "active" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                Theatre Halls
              </a>
            </li>
            <li onClick={() => selectTab("create-movie")}>
              <a className={selectedTab === "create-movie" ? "active" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                Movies
              </a>
            </li>
          </ul>
        </div>

        {/* Manage Section */}
        <div>
          <h6 className="font-bold text-lg mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Manage
          </h6>
          <ul className="menu bg-neutral rounded-box">
            <li onClick={() => selectTab("create-show")}>
              <a className={selectedTab === "create-show" ? "active" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Create Show
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-base-100 text-primary overflow-auto">
        {selectedTab === "overview" && <AnalyticsOverview />}
        {selectedTab === "create-theatre" && <CreateTheatreTab />}
        {selectedTab === "create-theatre-halls" && <CreateTheatreHallTab />}
        {selectedTab === "create-movie" && <CreateMovieTab />}
        {selectedTab === "create-show" && <CreateShowTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;
