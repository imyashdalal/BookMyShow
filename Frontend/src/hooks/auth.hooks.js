import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiInstance } from "../api";
import { tokenStorage } from "../utils/secureStorage";

export const useSignup = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ firstname, lastname, email, password }) => {
      const { data } = await apiInstance.post("/auth/sign-up", {
        firstname,
        lastname,
        email,
        password,
      });
      const token = data.data.token;
      if (token) tokenStorage.set(token);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error('Signup failed:', error.response?.data?.error || error.message);
    },
  });
  return mutation;
};

export const useSignin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await apiInstance.post("/auth/sign-in", {
        email,
        password,
      });
      const token = data.data.token;
      if (token) tokenStorage.set(token);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error('Signin failed:', error.response?.data?.error || error.message);
    },
  });
  return mutation;
};

export const useLoggedInUser = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiInstance.get("/auth/me");
      if (!data.isLoggedIn) return false;
      return data.data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  return query;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ firstname, lastname }) => {
      const { data } = await apiInstance.put("/auth/update-profile", {
        firstname,
        lastname,
      });
      return data.data.user;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error('Profile update failed:', error.response?.data?.error || error.message);
    },
  });
  return mutation;
};
