import {  Modal, Typography } from 'antd';
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteTable } from '../../hooks/tables';

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
  const mutation = useDeleteTable({
    onSuccessCallback: (result) => {
      console.log('Table deleted', result);
      navigate(`/data/${catalog}/${schema}`);
    },
  });

  const handleSubmit = useCallback(() => {
    mutation.mutate({ catalog_name: catalog, schema_name: schema, name: table });
  }, [mutation, catalog, schema, tableFullName]);

  return (
    <Modal
      title={<Typography.Title level={4}>Delete table</Typography.Title>}
      okText="Delete"
      okType="danger"
      cancelText="Cancel"
      open={open}
      destroyOnClose
      onCancel={closeModal}
      onOk={handleSubmit}
      okButtonProps={{ loading: mutation.isPending }}
    >
      <Typography.Paragraph type="danger">
        {`Are you sure you want to delete the table ${tableFullName}? This operation cannot be undone.`}
      </Typography.Paragraph>

    </Modal>
  );
}
