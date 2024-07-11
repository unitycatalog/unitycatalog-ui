import { SearchOutlined } from '@ant-design/icons';
import { Flex, Input, Table, TableColumnsType } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { ReactNode, useMemo, useState } from 'react';

interface ListLayoutProps<T> {
  data: T[];
  columns: TableColumnsType<T>;
  title: ReactNode;
}

export default function ListLayout<T extends AnyObject = AnyObject>({
  data,
  columns,
  title,
}: ListLayoutProps<T>) {
  const [filterValue, setFilterValue] = useState('');

  const filteredData = useMemo(() => {
    if (!filterValue) return data;
    return data.filter((item) =>
      Object.values<string | boolean | number | null | undefined>(item).some(
        (value) =>
          String(value).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }, [data, filterValue]);

  return (
    <Flex gap="middle" vertical>
      {title}
      <span style={{ maxWidth: 300 }}>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </span>
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />
    </Flex>
  );
}
