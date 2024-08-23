import { Button, Form, Modal, Typography } from 'antd';
import React, { useCallback, useRef } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { UpdateFunctionMutationParams } from '../../hooks/functions';

interface EditFunctionDescriptionModalProps {
  open: boolean;
  ucFunction: UpdateFunctionMutationParams;
  closeModal: () => void;
  onSubmit: (comment: UpdateFunctionMutationParams) => void;
  loading: boolean;
}

export function EditFunctionDescriptionModal({
  open,
  ucFunction,
  closeModal,
  onSubmit,
  loading,
}: EditFunctionDescriptionModalProps) {
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = useCallback(() => {
    submitRef.current?.click();
  }, []);

  return (
    <Modal
      title={<Typography.Title level={4}>Edit description</Typography.Title>}
      okText="Save"
      cancelText="Cancel"
      open={open}
      destroyOnClose
      onCancel={closeModal}
      onOk={handleSubmit}
      okButtonProps={{ loading: loading }}
    >
      <Typography.Paragraph type="secondary">
        Function description
      </Typography.Paragraph>
      <Form<UpdateFunctionMutationParams>
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values);
        }}
        name="Edit description form"
        initialValues={{ comment: ucFunction.comment }}
      >
        <Form.Item name="comment">
          <TextArea />
        </Form.Item>
        <Form.Item hidden>
          <Button type="primary" htmlType="submit" ref={submitRef}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
