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

enum TableActionsEnum {
  Delete,
  Rename
}


export default function TableActionsDropdown({
  catalog,
  schema,
  table,
  tableFullName,
}: TableActionDropdownProps) {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [action, setAction] = useState<TableActionsEnum | null>(null);

  const menuItems = useMemo(
    (): MenuProps['items'] => [
      {
        key: 'deleteTable',
        label: 'Delete Table',
        onClick: () => setAction(TableActionsEnum.Delete),
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
          icon={
          <MoreOutlined
            rotate={dropdownVisible ? 90 : 0}
            style={{ transition: 'transform 0.5s' }}
          />}  />
      </Dropdown>
      <DeleteTableModal
        open={action === TableActionsEnum.Delete}
        closeModal={() => setAction(null)}
        tableFullName={tableFullName}
        catalog={catalog}
        schema={schema}
        table={table} />
    </>
  );
}
