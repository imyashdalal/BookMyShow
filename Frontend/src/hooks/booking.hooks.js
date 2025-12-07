import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiInstance } from "../api";

export const useCreatreBooking = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async ({ showId, seatNumber, paymentId, userId }) => {
        const { data } = await apiInstance.post("/booking/createBooking", {
            showId,
            seatNumber,
            paymentId,
            userId,
        });

        return data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["booking"] });
        await queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      },
    });
    return mutation;
  };

  export const useGetAllShowBooking = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async ({showId}) => {
        const { data } = await apiInstance.post("/booking/show", {
            showId,
        });

        return data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["booking"] });
      },
    });
    return mutation;
  };

  export const useGetUserBookings = () => {
    return useQuery({
      queryKey: ["user-bookings"],
      queryFn: async () => {
        const { data } = await apiInstance.get("/booking/my-bookings");
        return data;
      },
    });
  };

  export const useLockSeats = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async ({ showId, seatNumbers }) => {
        const { data } = await apiInstance.post("/booking/lock-seats", {
          showId,
          seatNumbers,
        });
        return data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["seat-status"] });
      },
    });
    return mutation;
  };

  export const useUnlockSeats = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async ({ showId }) => {
        const { data } = await apiInstance.post("/booking/unlock-seats", {
          showId,
        });
        return data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["seat-status"] });
      },
    });
    return mutation;
  };

  export const useGetSeatStatus = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async ({ showId }) => {
        const { data } = await apiInstance.post("/booking/seat-status", {
          showId,
        });
        return data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["seat-status"] });
      },
    });
    return mutation;
  };

