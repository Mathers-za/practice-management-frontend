import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

const useFetchData = (endpoint = "", queryKey, paramsData = "") => {
  const [httpStatus, setHttpStatus] = useState();
  const { data, isSuccess, isError, error, isLoading, isRefetching, refetch } =
    useQuery({
      //data.data.property to acces properties. data.status to access http codes
      queryKey: queryKey,
      queryFn: async () => {
        const response = await axios.get(
          `http://localhost:4000${endpoint}`,

          {
            params: paramsData,
            withCredentials: true,
          }
        );
        setHttpStatus(response.status);
        return response.data;
      },
      refetchOnWindowFocus: false,
    });

  return {
    data,
    isSuccess,
    isError,
    error,
    isLoading,
    httpStatus,
    isRefetching,
    refetch,
  };
};

export { useFetchData };

const usePostData = (endpoint = "", queryKey = undefined) => {
  const queryClient = useQueryClient();
  const [postHttpStatus, setPostHttpStatus] = useState();

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axios.post(
        `http://localhost:4000${endpoint}`,
        payload,
        {
          withCredentials: true,
        }
      );
      setPostHttpStatus(response.status);

      return response.data;
    },
    onSuccess: () => {
      queryKey && queryClient.invalidateQueries(queryKey);
    },
  });

  function handlePost(payload) {
    createMutation.mutate(payload);
  }

  return { handlePost, createMutation, postHttpStatus };
};

export { usePostData };

const usePatchData = (endpoint = "", queryKey = undefined) => {
  const queryClient = useQueryClient();
  const patchMutation = useMutation({
    mutationFn: async (payload) => {
      return await axios.patch(`http://localhost:4000${endpoint}`, payload, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryKey && queryClient.invalidateQueries(queryKey);
    },
  });

  function handlePatch(payload) {
    patchMutation.mutate(payload);
  }
  return { patchMutation, handlePatch };
};

export { usePatchData };

const useDeleteData = (endpoint = "", queryKey = undefined) => {
  console.log(queryKey);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    {
      mutationFn: async (id) => {
        return await axios.delete(`http://localhost:4000${endpoint}${id}`, {
          withCredentials: true,
        });
      },
    },

    {
      onSettled: () => {
        console.log("deletion was a success");
        queryKey && queryClient.invalidateQueries(queryKey);
      },
    }
  );
  return { deleteMutation };
};

const usePagination = (queryString, queryID, fetchData) => {
  return useQuery({
    queryKey: [queryString, queryID],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
    select: (data) => ({
      data: data?.data,
      metadata: data?.metadata,
    }),
  });
};
export { useDeleteData, usePagination };
