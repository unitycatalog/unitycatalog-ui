import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
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
        `${UC_API_PREFIX}/tables?${searchParams.toString()}`
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

export interface DeleteTableMutationParams extends Pick<TableInterface, 'catalog_name' | 'schema_name' | 'name'> {}

interface DeleteTableParams {
  onSuccessCallback?: (success: boolean) => void;
}

export function useDeleteTable({ onSuccessCallback }: DeleteTableParams = {}) {
  const queryClient = useQueryClient();

  return useMutation<TableInterface, unknown, DeleteTableMutationParams>({
    mutationFn: async (params: DeleteTableMutationParams) => {
      const response = await fetch(`${UC_API_PREFIX}/tables/${params.catalog_name}.${params.schema_name}.${params.name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete table');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listTables'] });
      onSuccessCallback?.(true);
    },
  });
}
