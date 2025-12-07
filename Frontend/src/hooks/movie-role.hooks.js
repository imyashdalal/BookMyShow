import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../api";

export const useCreateMovieRole = () => {
  const queryClient = useQueryClient();
  const movieRole = useMutation({
    mutationFn: async (roleData) => {
      const { data } = await apiInstance.post("/admin/movie-roles", roleData);
      return data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["movie-roles"] });
    },
  });
  return movieRole;
};

export const useGetMovieRoles = (movieId) => {
  const roles = useQuery({
    queryKey: ["movie-roles", movieId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/movies/${movieId}/roles`);
      return data.data;
    },
    enabled: !!movieId,
  });
  return roles;
};

export const useGetMovieCast = (movieId) => {
  const cast = useQuery({
    queryKey: ["movie-cast", movieId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/movies/${movieId}/cast`);
      return data.data;
    },
    enabled: !!movieId,
  });
  return cast;
};

export const useGetMovieCrew = (movieId) => {
  const crew = useQuery({
    queryKey: ["movie-crew", movieId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/movies/${movieId}/crew`);
      return data.data;
    },
    enabled: !!movieId,
  });
  return crew;
};
