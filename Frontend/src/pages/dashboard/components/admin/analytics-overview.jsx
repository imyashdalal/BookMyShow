import { useAnalytics } from "../../../../hooks/analytics.hooks";

const AnalyticsOverview = () => {
  const {
    dashboardStats,
    recentBookings,
    topMovies,
    monthlyRevenue,
    theatreStats,
    platformStats,
    loading,
    error,
    refreshAnalytics
  } = useAnalytics();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading analytics: {error}</span>
        <button className="btn btn-sm" onClick={refreshAnalytics}>Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Overview</h1>
          <p className="text-secondary mt-1">Monitor your platform performance</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button className="btn btn-primary btn-sm" onClick={refreshAnalytics}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="stats shadow bg-gradient-to-br from-primary to-primary-focus text-primary-content">
          <div className="stat">
            <div className="stat-figure text-primary-content/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div className="stat-title text-primary-content/70">Total Bookings</div>
            <div className="stat-value">{formatNumber(dashboardStats?.totalBookings || 0)}</div>
            <div className="stat-desc text-primary-content/70">
              <span className={`font-semibold ${dashboardStats?.bookingGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                {dashboardStats?.bookingGrowth >= 0 ? '↗︎' : '↘︎'} {Math.abs(dashboardStats?.bookingGrowth || 0)}%
              </span> vs last month
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="stats shadow bg-gradient-to-br from-success to-success-focus text-success-content">
          <div className="stat">
            <div className="stat-figure text-success-content/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title text-success-content/70">Total Revenue</div>
            <div className="stat-value text-2xl">{formatCurrency(dashboardStats?.totalRevenue || 0)}</div>
            <div className="stat-desc text-success-content/70">
              <span className={`font-semibold ${dashboardStats?.revenueGrowth >= 0 ? 'text-warning' : 'text-error'}`}>
                {dashboardStats?.revenueGrowth >= 0 ? '↗︎' : '↘︎'} {Math.abs(dashboardStats?.revenueGrowth || 0)}%
              </span> vs last month
            </div>
          </div>
        </div>

        {/* Active Shows */}
        <div className="stats shadow bg-gradient-to-br from-info to-info-focus text-info-content">
          <div className="stat">
            <div className="stat-figure text-info-content/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="stat-title text-info-content/70">Active Shows</div>
            <div className="stat-value">{dashboardStats?.activeShows || 0}</div>
            <div className="stat-desc text-info-content/70">
              {dashboardStats?.totalMovies || 0} movies across {dashboardStats?.totalTheatres || 0} theatres
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="stats shadow bg-gradient-to-br from-warning to-warning-focus text-warning-content">
          <div className="stat">
            <div className="stat-figure text-warning-content/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="stat-title text-warning-content/70">Total Users</div>
            <div className="stat-value">{formatNumber(dashboardStats?.totalUsers || 0)}</div>
            <div className="stat-desc text-warning-content/70">Registered platform users</div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card bg-neutral shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Monthly Revenue
            </h2>
            {monthlyRevenue && monthlyRevenue.length > 0 ? (
              <div className="flex items-end justify-between h-64 gap-2 mt-4">
                {monthlyRevenue.map((data, index) => {
                  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));
                  const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 group">
                      <div className="tooltip tooltip-top" data-tip={formatCurrency(data.revenue)}>
                        <div 
                          className="w-full bg-gradient-to-t from-primary to-primary-focus rounded-t-lg transition-all duration-300 hover:from-primary-focus hover:to-primary cursor-pointer"
                          style={{ height: `${Math.max(height, 5)}%`, minHeight: '20px' }}
                        ></div>
                      </div>
                      <div className="text-xs mt-2 font-semibold">{data.month}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-secondary">No revenue data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Movies */}
        <div className="card bg-neutral shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Top Performing Movies
            </h2>
            {topMovies && topMovies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Movie</th>
                      <th>Bookings</th>
                      <th>Revenue</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMovies.map((movie, index) => (
                      <tr key={movie.id || movie._id} className="hover">
                        <td>
                          <div className="badge badge-primary badge-sm">{index + 1}</div>
                        </td>
                        <td className="font-semibold">{movie.title}</td>
                        <td>{formatNumber(movie.bookings)}</td>
                        <td className="text-success font-semibold">{formatCurrency(movie.revenue)}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold">{movie.rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-secondary">No movie data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card bg-neutral shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Bookings
          </h2>
          {recentBookings && recentBookings.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Movie</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking, index) => (
                      <tr key={booking.id || index} className="hover">
                        <td>
                          <div className="font-mono text-xs">#{index + 1}</div>
                        </td>
                        <td className="font-semibold">{booking.movie}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span className="text-xs">
                                  {booking.user.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div>{booking.user}</div>
                          </div>
                        </td>
                        <td className="font-semibold text-success">{formatCurrency(booking.amount)}</td>
                        <td className="text-sm opacity-70">{booking.time}</td>
                        <td>
                          <div className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'} gap-2`}>
                            {booking.status === 'confirmed' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {booking.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-ghost btn-sm">View All Bookings →</button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-secondary">No recent bookings</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-neutral shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Total Movies</p>
                <p className="text-3xl font-bold">{dashboardStats?.totalMovies || 0}</p>
              </div>
              <div 
                className="radial-progress text-primary" 
                style={{"--value": platformStats?.capacityUtilization || 0}} 
                role="progressbar"
              >
                {platformStats?.capacityUtilization || 0}%
              </div>
            </div>
            <p className="text-xs opacity-60 mt-2">Platform capacity utilization</p>
          </div>
        </div>

        <div className="card bg-neutral shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Total Theatres</p>
                <p className="text-3xl font-bold">{dashboardStats?.totalTheatres || 0}</p>
              </div>
              <div 
                className="radial-progress text-success" 
                style={{"--value": theatreStats?.utilizationRate || 0}} 
                role="progressbar"
              >
                {theatreStats?.utilizationRate || 0}%
              </div>
            </div>
            <p className="text-xs opacity-60 mt-2">
              {theatreStats?.totalHalls || 0} halls ({theatreStats?.avgHallsPerTheatre || 0} avg/theatre)
            </p>
          </div>
        </div>

        <div className="card bg-neutral shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Avg. Rating</p>
                <p className="text-3xl font-bold">{platformStats?.avgRating || 0}</p>
              </div>
              <div 
                className="radial-progress text-warning" 
                style={{"--value": platformStats?.satisfactionScore || 0}} 
                role="progressbar"
              >
                {platformStats?.satisfactionScore || 0}%
              </div>
            </div>
            <p className="text-xs opacity-60 mt-2">Customer satisfaction score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
