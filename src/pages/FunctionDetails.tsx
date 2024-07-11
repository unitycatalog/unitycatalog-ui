import React from 'react';
import { useParams } from 'react-router-dom';
import DetailsLayout from '../components/layouts/DetailsLayout';
import FunctionSidebar from '../components/functions/FunctionSidebar';
import { useGetFunction } from '../hooks/functions';
import DescriptionBox from '../components/DescriptionBox';
import { Typography } from 'antd';

export default function FunctionDetails() {
  const { catalog, schema, ucFunction } = useParams();
  if (!catalog) throw new Error('Catalog name is required');
  if (!schema) throw new Error('Schema name is required');
  if (!ucFunction) throw new Error('Function name is required');

  const { data } = useGetFunction({ catalog, schema, ucFunction });

  if (!data) return null;

  return (
    <DetailsLayout
      title={<Typography.Title level={3}>{ucFunction}</Typography.Title>}
    >
      <DetailsLayout.Content>
        <DescriptionBox comment={data?.comment} />
      </DetailsLayout.Content>
      <DetailsLayout.Aside>
        <FunctionSidebar
          catalog={catalog}
          schema={schema}
          ucFunction={ucFunction}
        />
      </DetailsLayout.Aside>
    </DetailsLayout>
  );
}
