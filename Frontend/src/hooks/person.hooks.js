import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../api";

export const useCreatePerson = () => {
  const queryClient = useQueryClient();
  const person = useMutation({
    mutationFn: async (personData) => {
      const { data } = await apiInstance.post("/admin/persons", personData);
      return data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["persons"] });
    },
  });
  return person;
};

export const useGetAllPersons = () => {
  const persons = useQuery({
    queryKey: ["persons"],
    queryFn: async () => {
      const { data } = await apiInstance.get("/api/persons");
      return data.data;
    },
  });
  return persons;
};

export const useGetPersonById = (personId) => {
  const person = useQuery({
    queryKey: ["person", personId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/persons/${personId}`);
      return data.data;
    },
    enabled: !!personId,
  });
  return person;
};

export const useGetMoviesByPerson = (personId) => {
  const movies = useQuery({
    queryKey: ["person-movies", personId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/api/persons/${personId}/movies`);
      return data.data;
    },
    enabled: !!personId,
  });
  return movies;
};
