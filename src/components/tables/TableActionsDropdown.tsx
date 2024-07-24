import { DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import { useMemo, useState } from 'react';
import { DeleteTableModal } from '../modals/DeleteTableModal';

interface TableActionDropdownProps {
  catalog: string;
  schema: string;
  table: string;
  tableFullName: string;
}


export default function TableActionsDropdown({
  catalog,
  schema,
  table,
  tableFullName,
}: TableActionDropdownProps) {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const menuItems = useMemo(
    (): MenuProps['items'] => [
      {
        key: 'deleteTable',
        label: 'Delete Table',
        onClick: () => setOpenModal(true),
        icon: <DeleteOutlined />,
        danger: true
      },
    ],
    []
  );

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        onOpenChange={() => setDropdownVisible(!dropdownVisible)}>
        <Button
          type="primary"
          shape='circle'
          icon={
          <MoreOutlined
            rotate={dropdownVisible ? 90 : 0}
            style={{ transition: 'transform 0.5s' }}
          />}  />
      </Dropdown>
      <DeleteTableModal
        open={openModal}
        closeModal={() => setOpenModal(false)}
        tableFullName={tableFullName}
        catalog={catalog}
        schema={schema}
        table={table} />
    </>
  );
}
