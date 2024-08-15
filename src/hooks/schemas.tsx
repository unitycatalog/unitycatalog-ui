import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import apiClient from '../context/client';

export interface SchemaInterface {
  schema_id: string;
  catalog_name: string;
  name: string;
  comment: string;
  created_at: number;
  updated_at: number | null;
}
interface ListSchemasResponse {
  schemas: SchemaInterface[];
  next_page_token: string | null;
}

interface ListSchemasParams {
  catalog: string;
  options?: Omit<UseQueryOptions<ListSchemasResponse>, 'queryKey' | 'queryFn'>;
}

export function useListSchemas({ catalog, options }: ListSchemasParams) {
  return useQuery<ListSchemasResponse>({
    queryKey: ['listSchemas', catalog],
    queryFn: async () => {
      const searchParams = new URLSearchParams({ catalog_name: catalog });

      return apiClient
        .get(`/schemas?${searchParams.toString()}`)
        .then((response) => response.data);
    },
    ...options,
  });
}

interface GetSchemaParams {
  catalog: string;
  schema: string;
}
export function useGetSchema({ catalog, schema }: GetSchemaParams) {
  return useQuery<SchemaInterface>({
    queryKey: ['getSchema', catalog, schema],
    queryFn: async () => {
      const fullName = [catalog, schema].join('.');

      return apiClient
        .get(`/schemas/${fullName}`)
        .then((response) => response.data);
    },
  });
}

export interface CreateSchemaMutationParams
  extends Pick<SchemaInterface, 'name' | 'catalog_name' | 'comment'> {}

export function useCreateSchema() {
  const queryClient = useQueryClient();

  return useMutation<SchemaInterface, Error, CreateSchemaMutationParams>({
    mutationFn: async (params: CreateSchemaMutationParams) => {
      return apiClient
        .post(`/schemas`, JSON.stringify(params))
        .then((response) => response.data)
        .catch((e) => {
          throw new Error(
            e.response?.data?.message || 'Failed to create schema',
          );
        });
    },
    onSuccess: (schema) => {
      queryClient.invalidateQueries({
        queryKey: ['listSchemas', schema.catalog_name],
      });
    },
  });
}

export interface DeleteSchemaMutationParams
  extends Pick<SchemaInterface, 'catalog_name' | 'name'> {}

interface DeleteSchemaParams {
  catalog: string;
}

export function useDeleteSchema({ catalog }: DeleteSchemaParams) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteSchemaMutationParams>({
    mutationFn: async (params: DeleteSchemaMutationParams) => {
      return apiClient
        .delete(`/schemas/${params.catalog_name}.${params.name}`)
        .then((response) => response.data)
        .catch((e) => {
          throw new Error(
            e.response?.data?.message || 'Failed to delete schema',
          );
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchemas', catalog],
      });
    },
  });
}
