import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../api";

// Movie Reviews (User Reviews)
export const useCreateMovieReview = () => {
  const queryClient = useQueryClient();
  const review = useMutation({
    mutationFn: async ({ movieId, rating, review }) => {
      const { data } = await apiInstance.post("/api/movie-reviews", {
        movieId,
        rating,
        review,
      });
      return data.data;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["movie-reviews", variables.movieId] });
    },
  });
  return review;
};

export const useGetMovieReviews = (movieId) => {
  const reviews = useQuery({
    queryKey: ["movie-reviews", movieId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/movies/${movieId}/reviews`);
      return data.data;
    },
    enabled: !!movieId,
  });
  return reviews;
};

// Critic Reviews
export const useGetCriticReviews = (movieId) => {
  const reviews = useQuery({
    queryKey: ["critic-reviews", movieId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/movies/${movieId}/critic-reviews`);
      return data.data;
    },
    enabled: !!movieId,
  });
  return reviews;
};

export const useCreateCriticReview = () => {
  const queryClient = useQueryClient();
  const review = useMutation({
    mutationFn: async ({ movieId, criticName, publication, rating, review }) => {
      const { data } = await apiInstance.post("/admin/critic-reviews", {
        movieId,
        criticName,
        publication,
        rating,
        review,
      });
      return data.data;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["critic-reviews", variables.movieId] });
    },
  });
  return review;
};

// Theatre Reviews
export const useCreateTheatreReview = () => {
  const queryClient = useQueryClient();
  const review = useMutation({
    mutationFn: async ({ theatreId, rating, review, categories }) => {
      const { data } = await apiInstance.post("/api/theatre-reviews", {
        theatreId,
        rating,
        review,
        categories,
      });
      return data.data;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["theatre-reviews", variables.theatreId] });
    },
  });
  return review;
};

export const useGetTheatreReviews = (theatreId) => {
  const reviews = useQuery({
    queryKey: ["theatre-reviews", theatreId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/theatres/${theatreId}/reviews`);
      return data.data;
    },
    enabled: !!theatreId,
  });
  return reviews;
};
