import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosRequest from "../apiRequests/apiRequests";

const useFetchData = (
  endpoint = "",
  queryKey,
  paramsData = undefined,
  cacheTime = 300000
) => {
  //endpoint:string, querykey: string or an array with queryString and uniqueId, [aramsData:object of key value pairs you want to pass]
  const [httpStatus, setHttpStatus] = useState();
  const { data, isSuccess, isError, error, isLoading, isRefetching, refetch } =
    useQuery({
      //data.data.property to acces properties. data.status to access http codes
      queryKey: queryKey,
      cacheTime: cacheTime,
      queryFn: async () => {
        const response = await axios.get(
          `http://localhost:4000${endpoint}`,

          {
            params: paramsData && paramsData,
            withCredentials: true,
          }
        );
        setHttpStatus(response.status);
        return response.data;
      },
      keepPreviousData: true,

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
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: queryKey });
      }
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

  return { patchMutation };
};

export { usePatchData };

const useDeleteData = (endpoint = "", queryKey = undefined) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    async (id) => {
      return await axios.delete(`http://localhost:4000${endpoint}${id}`, {
        withCredentials: true,
      });
    },
    {
      onSuccess: () => {
        if (queryKey) {
          queryClient.invalidateQueries(queryKey);
        }
      },
    }
  );

  return { deleteMutation };
};

const useBatchDeleteData = (endpoint = "", queryKey = undefined) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    async (payload) => {
      return await axios.delete(`http://localhost:4000${endpoint}`, {
        data: payload,
        withCredentials: true,
      });
    },
    {
      onSuccess: () => {
        if (queryKey) {
          queryClient.invalidateQueries(queryKey);
        }
      },
    }
  );

  return { deleteMutation };
};

const usePagination = (
  endpoint,
  queryKey,
  page = 1,
  pageSize = 10,
  filterParams
) => {
  const {
    data,
    isError,
    error,
    isFetching,
    isLoading,
    isFetched,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const { data } = await axiosRequest("get", endpoint, undefined, {
        page: page,
        pageSize: pageSize,
        ...filterParams,
      });
      return data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  return {
    data,
    isError,
    error,
    isFetched,
    isFetching,
    isLoading,
    refetch,
    isSuccess,
  };
};

export {
  useDeleteData,
  usePagination,
  useBatchDeleteData,
  usePagination as usePagination1,
};
