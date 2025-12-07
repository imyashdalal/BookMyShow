import { useState, useEffect } from 'react';
import api from '../api';

/**
 * Custom hook for fetching analytics data
 */
export const useAnalytics = () => {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [topMovies, setTopMovies] = useState([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [theatreStats, setTheatreStats] = useState(null);
    const [platformStats, setPlatformStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics/dashboard');
            return response.data;
        } catch (err) {
            console.error('Error fetching dashboard analytics:', err);
            throw err;
        }
    };

    const fetchRecentBookings = async (limit = 5) => {
        try {
            const response = await api.get(`/admin/analytics/recent-bookings?limit=${limit}`);
            return response.data;
        } catch (err) {
            console.error('Error fetching recent bookings:', err);
            throw err;
        }
    };

    const fetchTopMovies = async (limit = 5) => {
        try {
            const response = await api.get(`/admin/analytics/top-movies?limit=${limit}`);
            return response.data;
        } catch (err) {
            console.error('Error fetching top movies:', err);
            throw err;
        }
    };

    const fetchMonthlyRevenue = async (months = 6) => {
        try {
            const response = await api.get(`/admin/analytics/monthly-revenue?months=${months}`);
            return response.data;
        } catch (err) {
            console.error('Error fetching monthly revenue:', err);
            throw err;
        }
    };

    const fetchTheatreStats = async () => {
        try {
            const response = await api.get('/admin/analytics/theatre-stats');
            return response.data;
        } catch (err) {
            console.error('Error fetching theatre stats:', err);
            throw err;
        }
    };

    const fetchPlatformStats = async () => {
        try {
            const response = await api.get('/admin/analytics/platform-stats');
            return response.data;
        } catch (err) {
            console.error('Error fetching platform stats:', err);
            throw err;
        }
    };

    const loadAllAnalytics = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [
                dashboard,
                bookings,
                movies,
                revenue,
                theatre,
                platform
            ] = await Promise.all([
                fetchDashboardAnalytics(),
                fetchRecentBookings(5),
                fetchTopMovies(5),
                fetchMonthlyRevenue(6),
                fetchTheatreStats(),
                fetchPlatformStats()
            ]);

            setDashboardStats(dashboard);
            setRecentBookings(bookings);
            setTopMovies(movies);
            setMonthlyRevenue(revenue);
            setTheatreStats(theatre);
            setPlatformStats(platform);
        } catch (err) {
            setError(err.message || 'Failed to load analytics');
            console.error('Error loading analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshAnalytics = () => {
        loadAllAnalytics();
    };

    useEffect(() => {
        loadAllAnalytics();
    }, []);

    return {
        dashboardStats,
        recentBookings,
        topMovies,
        monthlyRevenue,
        theatreStats,
        platformStats,
        loading,
        error,
        refreshAnalytics
    };
};

export default useAnalytics;
