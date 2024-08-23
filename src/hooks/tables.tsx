import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { UC_API_PREFIX } from '../utils/constants';

interface ColumnInterface {
  name: string;
  type_text: string;
  type_name: string;
  created_at: number;
}

export interface TableInterface {
  table_id: string;
  table_type: string;
  catalog_name: string;
  schema_name: string;
  name: string;
  comment: string;
  created_at: number;
  updated_at: number | null;
  data_source_format: string;
  columns: ColumnInterface[];
}
interface ListTablesResponse {
  tables: TableInterface[];
  next_page_token: string | null;
}

interface ListTablesParams {
  catalog: string;
  schema: string;
  options?: Omit<UseQueryOptions<ListTablesResponse>, 'queryKey' | 'queryFn'>;
}

export function useListTables({ catalog, schema, options }: ListTablesParams) {
  return useQuery<ListTablesResponse>({
    queryKey: ['listTables', catalog, schema],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        catalog_name: catalog,
        schema_name: schema,
      });

      const response = await fetch(
        `${UC_API_PREFIX}/tables?${searchParams.toString()}`,
      );
      return response.json();
    },
    ...options,
  });
}

interface GetTableParams {
  catalog: string;
  schema: string;
  table: string;
}

export function useGetTable({ catalog, schema, table }: GetTableParams) {
  return useQuery<TableInterface>({
    queryKey: ['getTable', catalog, schema, table],
    queryFn: async () => {
      const fullName = [catalog, schema, table].join('.');

      const response = await fetch(`${UC_API_PREFIX}/tables/${fullName}`);
      return response.json();
    },
  });
}

interface UpdateTableParams {
  catalog: string;
  schema: string;
  table: string;
}
export interface UpdateTableMutationParams
  extends Pick<TableInterface, 'name' | 'comment'> {}

// Update a new table
export function useUpdateTable({ catalog, schema, table }: UpdateTableParams) {
  const queryClient = useQueryClient();

  return useMutation<TableInterface, Error, UpdateTableMutationParams>({
    mutationFn: async (params: UpdateTableMutationParams) => {
      const fullTableName = [catalog, schema, table].join('.');

      const response = await fetch(`${UC_API_PREFIX}/tables/${fullTableName}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update table');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getTable', catalog, schema, table],
      });
    },
  });
}

export interface DeleteTableMutationParams
  extends Pick<TableInterface, 'catalog_name' | 'schema_name' | 'name'> {}

interface DeleteTableParams {
  catalog: string;
  schema: string;
}

export function useDeleteTable({ catalog, schema }: DeleteTableParams) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteTableMutationParams>({
    mutationFn: async ({
      catalog_name,
      schema_name,
      name,
    }: DeleteTableMutationParams): Promise<void> => {
      const response = await fetch(
        `${UC_API_PREFIX}/tables/${catalog_name}.${schema_name}.${name}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to delete table');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listTables', catalog, schema],
      });
    },
  });
}
