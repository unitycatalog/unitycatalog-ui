import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailsLayout from '../components/layouts/DetailsLayout';
import FunctionSidebar from '../components/functions/FunctionSidebar';
import { useGetFunction, useUpdateFunction } from '../hooks/functions';
import DescriptionBox from '../components/DescriptionBox';
import { Flex, Typography } from 'antd';
import { FunctionOutlined } from '@ant-design/icons';
import CodeBox from '../components/CodeBox';
import FunctionActionsDropdown from '../components/functions/FunctionActionsDropdown';

import { useNotification } from '../utils/NotificationContext';
import { EditFunctionDescriptionModal } from '../components/modals/EditFunctionDescriptionModal';

export default function FunctionDetails() {
  const { catalog, schema, ucFunction } = useParams();
  if (!catalog) throw new Error('Catalog name is required');
  if (!schema) throw new Error('Schema name is required');
  if (!ucFunction) throw new Error('Function name is required');

  const { data } = useGetFunction({ catalog, schema, ucFunction });
  const [open, setOpen] = useState<boolean>(false);
  const { setNotification } = useNotification();
  const mutation = useUpdateFunction({ catalog, schema, ucFunction });

  if (!data) return null;

  return (
    <>
      <DetailsLayout
        title={
          <Flex justify="space-between" align="flex-start" gap="middle">
            <Typography.Title level={3}>
              <FunctionOutlined /> {ucFunction}
            </Typography.Title>
            <FunctionActionsDropdown
              catalog={catalog}
              schema={schema}
              ucFunction={ucFunction}
            />
          </Flex>
        }
        breadcrumbs={[
          { title: <Link to="/">Catalogs</Link>, key: '_home' },
          {
            title: <Link to={`/data/${catalog}`}>{catalog}</Link>,
            key: '_catalog',
          },
          {
            title: <Link to={`/data/${catalog}/${schema}`}>{schema}</Link>,
            key: '_schema',
          },
          { title: ucFunction, key: '_ucFunction' },
        ]}
      >
        <DetailsLayout.Content>
          <Flex vertical gap="middle">
            <DescriptionBox
              comment={data?.comment}
              onEdit={() => setOpen(true)}
            />
            <CodeBox definition={data.routine_definition} />
          </Flex>
        </DetailsLayout.Content>
        <DetailsLayout.Aside>
          <FunctionSidebar
            catalog={catalog}
            schema={schema}
            ucFunction={ucFunction}
          />
        </DetailsLayout.Aside>
      </DetailsLayout>
      <EditFunctionDescriptionModal
        open={open}
        ucFunction={data}
        closeModal={() => setOpen(false)}
        onSubmit={(values) =>
          mutation.mutate(
            { ...values, name: ucFunction },
            {
              onError: (error: Error) => {
                setNotification(error.message, 'error');
              },
              onSuccess: (ucFunction) => {
                setNotification(
                  `${ucFunction.name} function successfully updated`,
                  'success',
                );
                setOpen(false);
              },
            },
          )
        }
        loading={mutation.isPending}
      />
    </>
  );
}
