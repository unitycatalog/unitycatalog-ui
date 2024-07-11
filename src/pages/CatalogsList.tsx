import React from 'react';
import { useListCatalogs } from '../hooks/catalog';
import ListLayout from '../components/ListLayout';
import { Typography } from 'antd';

export default function CatalogsList() {
  const { data } = useListCatalogs();

  if (!data) return null;

  return (
    <ListLayout
      title={<Typography.Title level={2}>Catalogs</Typography.Title>}
      data={data.catalogs}
      columns={[
        { title: 'Name', dataIndex: 'name', key: 'name', width: '60%' },
        {
          title: 'Created At',
          dataIndex: 'created_at',
          key: 'created_at',
          width: '40%',
          render: (value) =>
            new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            }).format(new Date(value)),
        },
      ]}
    />
  );
}
