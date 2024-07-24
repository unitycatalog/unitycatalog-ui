import { Modal, Typography } from 'antd';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteTable } from '../../hooks/tables';
import { useNotification } from '../../utils/NotificationContext';

interface DeleteTableModalProps {
  open: boolean;
  closeModal: () => void;
  tableFullName: string;
  catalog: string;
  schema: string;
  table: string;
}

export function DeleteTableModal({
  open,
  closeModal,
  tableFullName,
  catalog,
  schema,
  table,
}: DeleteTableModalProps) {
  const navigate = useNavigate();
  const { setNotification } = useNotification();
  const mutation = useDeleteTable({
    onSuccessCallback: () => {
      setNotification(`${table} table successfully deleted`, 'success');
      navigate(`/data/${catalog}/${schema}`);
    },
  });

  const handleSubmit = useCallback(() => {
    mutation.mutate({ catalog_name: catalog, schema_name: schema, name: table } );
  }, [mutation, catalog, schema, table]);

  return (
    <Modal
      title={<Typography.Title type={'danger'} level={4}>Delete table</Typography.Title>}
      okText="Delete"
      okType="danger"
      cancelText="Cancel"
      open={open}
      destroyOnClose
      onCancel={closeModal}
      onOk={handleSubmit}
      okButtonProps={{ loading: mutation.isPending }}
    >
      <Typography.Text>
        {`Are you sure you want to delete the table `}
      </Typography.Text>
      <Typography.Text strong>
        {tableFullName}
      </Typography.Text>
      <Typography.Text>
        {`? This operation cannot be undone. `}
      </Typography.Text>

    </Modal>
  );
}
