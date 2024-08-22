import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import apiClient from '../context/client';
import { UC_API_PREFIX } from '../utils/constants';

export interface VolumeInterface {
  volume_id: string;
  volume_type: string;
  catalog_name: string;
  schema_name: string;
  name: string;
  comment: string;
  created_at: number;
  updated_at: number | null;
}

interface ListVolumesResponse {
  volumes: VolumeInterface[];
  next_page_token: string | null;
}

interface ListVolumesParams {
  catalog: string;
  schema: string;
  options?: Omit<UseQueryOptions<ListVolumesResponse>, 'queryKey' | 'queryFn'>;
}

export function useListVolumes({
  catalog,
  schema,
  options,
}: ListVolumesParams) {
  return useQuery<ListVolumesResponse>({
    queryKey: ['listVolumes', catalog, schema],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        catalog_name: catalog,
        schema_name: schema,
      });

      return apiClient
        .get(`/volumes?${searchParams.toString()}`)
        .then((response) => response.data);
    },
    ...options,
  });
}

interface GetVolumeParams {
  catalog: string;
  schema: string;
  volume: string;
}

export function useGetVolume({ catalog, schema, volume }: GetVolumeParams) {
  return useQuery<VolumeInterface>({
    queryKey: ['getVolume', catalog, schema, volume],
    queryFn: async () => {
      const fullVolumeName = [catalog, schema, volume].join('.');

      return apiClient
        .get(`/volumes/${fullVolumeName}`)
        .then((response) => response.data);
    },
  });
}

interface UpdateVolumeParams {
  catalog: string;
  schema: string;
  volume: string;
}

export interface UpdateVolumeMutationParams
  extends Pick<VolumeInterface, 'name' | 'comment'> {}

export function useUpdateVolume({
  catalog,
  schema,
  volume,
}: UpdateVolumeParams) {
  const queryClient = useQueryClient();

  return useMutation<VolumeInterface, Error, UpdateVolumeMutationParams>({
    mutationFn: async (params: UpdateVolumeMutationParams) => {
      const fullVolumeName = [catalog, schema, volume].join('.');

      const response = await fetch(
        `${UC_API_PREFIX}/volumes/${fullVolumeName}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update volume');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getVolume', catalog, schema, volume],
      });
    },
  });
}

export interface DeleteVolumeMutationParams
  extends Pick<VolumeInterface, 'catalog_name' | 'schema_name' | 'name'> {}

interface DeleteVolumeParams {
  catalog: string;
  schema: string;
}

// Delete a volume
export function useDeleteVolume({ catalog, schema }: DeleteVolumeParams) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteVolumeMutationParams>({
    mutationFn: async ({
      catalog_name,
      schema_name,
      name,
    }: DeleteVolumeMutationParams) => {
      return apiClient
        .delete(`/volumes/${catalog_name}.${schema_name}.${name}`)
        .then((response) => response.data)
        .catch((e) => {
          throw new Error(
            e.response?.data?.message || 'Failed to delete volume',
          );
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listVolumes', catalog, schema],
      });
    },
  });
}
