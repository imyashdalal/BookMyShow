import { useEffect, useCallback, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook to manage real-time seat updates for a specific show
 * @param {string} showId - The show ID to watch
 * @param {string} currentUserId - Current user's ID
 * @returns {object} - Seat status and handlers
 */
export const useRealtimeSeats = (showId, currentUserId) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [myLockedSeats, setMyLockedSeats] = useState([]);

  // Join show room when component mounts
  useEffect(() => {
    if (socket && showId && isConnected) {
      console.log('Joining show room:', showId);
      socket.emit('join-show', showId);

      // Cleanup: leave room on unmount
      return () => {
        console.log('Leaving show room:', showId);
        socket.emit('leave-show', showId);
      };
    }
  }, [socket, showId, isConnected]);

  // Handle seats locked event
  const handleSeatsLocked = useCallback((data) => {
    if (data.showId !== showId) return;

    console.log('Seats locked event:', data);

    if (data.userId === currentUserId) {
      // Current user locked these seats
      setMyLockedSeats(prev => {
        const newSeats = [...new Set([...prev, ...data.seatNumbers])];
        return newSeats;
      });
    } else {
      // Another user locked these seats
      setLockedSeats(prev => {
        const newSeats = [...new Set([...prev, ...data.seatNumbers])];
        return newSeats;
      });
    }

    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['seat-status', showId] });
  }, [showId, currentUserId, queryClient]);

  // Handle seats unlocked event
  const handleSeatsUnlocked = useCallback((data) => {
    if (data.showId !== showId) return;

    console.log('Seats unlocked event:', data);

    if (data.userId === currentUserId) {
      // Current user unlocked these seats
      setMyLockedSeats(prev => 
        prev.filter(seat => !data.seatNumbers.includes(seat))
      );
    } else {
      // Another user unlocked these seats
      setLockedSeats(prev => 
        prev.filter(seat => !data.seatNumbers.includes(seat))
      );
    }

    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['seat-status', showId] });
  }, [showId, currentUserId, queryClient]);

  // Handle seats booked event
  const handleSeatsBooked = useCallback((data) => {
    if (data.showId !== showId) return;

    console.log('Seats booked event:', data);

    // Add to booked seats
    setBookedSeats(prev => {
      const newSeats = [...new Set([...prev, ...data.seatNumbers])];
      return newSeats;
    });

    // Remove from locked seats if they were locked
    setLockedSeats(prev => 
      prev.filter(seat => !data.seatNumbers.includes(seat))
    );
    setMyLockedSeats(prev => 
      prev.filter(seat => !data.seatNumbers.includes(seat))
    );

    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['seat-status', showId] });
    queryClient.invalidateQueries({ queryKey: ['booking', showId] });
  }, [showId, queryClient]);

  // Handle complete seat status update
  const handleSeatStatusUpdate = useCallback((data) => {
    if (data.showId !== showId) return;

    console.log('Seat status update:', data);

    setBookedSeats(data.bookedSeats || []);
    
    const lockedByOthers = [];
    const lockedByMe = [];
    
    data.lockedSeats?.forEach(lock => {
      if (lock.userId === currentUserId || lock.isLockedByCurrentUser) {
        lockedByMe.push(lock.seatNumber);
      } else {
        lockedByOthers.push(lock.seatNumber);
      }
    });

    setLockedSeats(lockedByOthers);
    setMyLockedSeats(lockedByMe);
  }, [showId, currentUserId]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('seats-locked', handleSeatsLocked);
    socket.on('seats-unlocked', handleSeatsUnlocked);
    socket.on('seats-booked', handleSeatsBooked);
    socket.on('seat-status-update', handleSeatStatusUpdate);

    // Cleanup listeners
    return () => {
      socket.off('seats-locked', handleSeatsLocked);
      socket.off('seats-unlocked', handleSeatsUnlocked);
      socket.off('seats-booked', handleSeatsBooked);
      socket.off('seat-status-update', handleSeatStatusUpdate);
    };
  }, [socket, isConnected, handleSeatsLocked, handleSeatsUnlocked, handleSeatsBooked, handleSeatStatusUpdate]);

  return {
    bookedSeats,
    lockedSeats,
    myLockedSeats,
    isConnected,
    setBookedSeats,
    setLockedSeats,
    setMyLockedSeats
  };
};
