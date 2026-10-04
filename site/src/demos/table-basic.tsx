import type {
  FilterDropdownProps,
  FilterValue,
  SorterResult,
  TableColumnType,
} from "antd-octane";
import {
  Button,
  Checkbox,
  Divider,
  Empty,
  Input,
  Radio,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from "antd-octane";
import { useState } from "octane";

interface DataType {
  key: string | number;
  name: string;
  age: number;
  address: string;
  tags?: string[];
  description?: string;
  children?: DataType[];
}

interface JsxDataType {
  key: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableColumnType<DataType>[] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a href="#table">{text as string}</a>,
  },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Address", dataIndex: "address", key: "address" },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, record) => (
      <>
        {(record.tags ?? []).map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") color = "volcano";
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a href="#table">Invite {record.name}</a>
        <a href="#table">Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

export function BasicDemo() {
  return <Table<DataType> columns={columns} dataSource={data} />;
}

export function JsxDemo() {
  const jsxData: JsxDataType[] = [
    {
      key: "1",
      firstName: "John",
      lastName: "Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      firstName: "Jim",
      lastName: "Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      firstName: "Joe",
      lastName: "Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];
  return (
    <Table<JsxDataType> dataSource={jsxData}>
      <Table.ColumnGroup<JsxDataType> title="Name">
        <Table.Column<JsxDataType>
          title="First Name"
          dataIndex="firstName"
          key="firstName"
        />
        <Table.Column<JsxDataType>
          title="Last Name"
          dataIndex="lastName"
          key="lastName"
        />
      </Table.ColumnGroup>
      <Table.Column<JsxDataType> title="Age" dataIndex="age" key="age" />
      <Table.Column<JsxDataType>
        title="Address"
        dataIndex="address"
        key="address"
      />
      <Table.Column<JsxDataType>
        title="Tags"
        dataIndex="tags"
        key="tags"
        render={(tags: unknown) => (
          <>
            {(tags as string[]).map((tag) => (
              <Tag color={tag.length > 5 ? "geekblue" : "green"} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            ))}
          </>
        )}
      />
      <Table.Column<JsxDataType>
        title="Action"
        key="action"
        render={(_, record) => (
          <Space size="middle">
            <a href="#table">Invite {record.lastName}</a>
            <a href="#table">Delete</a>
          </Space>
        )}
      />
    </Table>
  );
}

const headColumns: TableColumnType<DataType>[] = [
  {
    title: "Name",
    dataIndex: "name",
    filters: [
      { text: "Joe", value: "Joe" },
      { text: "Jim", value: "Jim" },
      {
        text: "Submenu",
        value: "Submenu",
        children: [
          { text: "Green", value: "Green" },
          { text: "Black", value: "Black" },
        ],
      },
    ],
    onFilter: (value, record) => record.name.startsWith(String(value)),
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Age",
    dataIndex: "age",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Address",
    dataIndex: "address",
    filters: [
      { text: "London", value: "London" },
      { text: "New York", value: "New York" },
    ],
    onFilter: (value, record) => record.address.startsWith(String(value)),
  },
];

export function HeadDemo() {
  return (
    <Table<DataType>
      columns={headColumns}
      dataSource={[...data, { ...data[0], key: "4", name: "Jim Red" }]}
      showSorterTooltip={{ target: "sorter-icon" }}
    />
  );
}

const moneyColumns: TableColumnType<DataType>[] = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a href="#table">{text as string}</a>,
  },
  {
    title: "Cash Assets",
    className: "column-money",
    dataIndex: "address",
    align: "right",
  },
  { title: "Address", dataIndex: "address" },
];
const moneyData: DataType[] = [
  { key: "1", name: "John Brown", address: "￥300,000.00", age: 0 },
  { key: "2", name: "Jim Green", address: "￥1,256,000.00", age: 0 },
  { key: "3", name: "Joe Black", address: "￥120,000.00", age: 0 },
];

export function BorderedDemo() {
  return (
    <Table<DataType>
      columns={moneyColumns}
      dataSource={moneyData}
      bordered
      title={() => "Header"}
      footer={() => "Footer"}
    />
  );
}

const paginationTopOptions = [
  { label: "topLeft", value: "topLeft" },
  { label: "topCenter", value: "topCenter" },
  { label: "topRight", value: "topRight" },
  { label: "none", value: "none" },
];
const paginationBottomOptions = [
  { label: "bottomLeft", value: "bottomLeft" },
  { label: "bottomCenter", value: "bottomCenter" },
  { label: "bottomRight", value: "bottomRight" },
  { label: "none", value: "none" },
];

export function PaginationDemo() {
  const [top, setTop] = useState<"topLeft" | "topCenter" | "topRight" | "none">(
    "topLeft",
  );
  const [bottom, setBottom] = useState<
    "bottomLeft" | "bottomCenter" | "bottomRight" | "none"
  >("bottomRight");
  return (
    <div>
      <div>
        <Radio.Group
          style={{ marginBottom: 10 }}
          options={paginationTopOptions}
          value={top}
          onChange={(event) => setTop(event.target.value as typeof top)}
        />
      </div>
      <Radio.Group
        style={{ marginBottom: 10 }}
        options={paginationBottomOptions}
        value={bottom}
        onChange={(event) => setBottom(event.target.value as typeof bottom)}
      />
      <Table<DataType>
        columns={columns}
        pagination={{ position: [top, bottom] }}
        dataSource={data}
      />
    </div>
  );
}

export function SizeDemo() {
  const sizeColumns = columns.slice(0, 3);
  return (
    <>
      <Divider>Middle size table</Divider>
      <Table<DataType> columns={sizeColumns} dataSource={data} size="middle" />
      <Divider>Small size table</Divider>
      <Table<DataType> columns={sizeColumns} dataSource={data} size="small" />
    </>
  );
}

const selectionColumns: TableColumnType<DataType>[] = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a href="#table">{text as string}</a>,
  },
  { title: "Age", dataIndex: "age" },
  { title: "Address", dataIndex: "address" },
];
const selectionData: DataType[] = [
  ...data,
  {
    key: "4",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
  },
];

export function SelectionDemo() {
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox",
  );
  return (
    <div>
      <Radio.Group
        value={selectionType}
        onChange={(event) =>
          setSelectionType(event.target.value as typeof selectionType)
        }
      >
        <Radio value="checkbox">Checkbox</Radio>
        <Radio value="radio">radio</Radio>
      </Radio.Group>
      <Divider />
      <Table<DataType>
        rowSelection={{
          type: selectionType,
          onChange: () => undefined,
          getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            name: record.name,
          }),
        }}
        columns={selectionColumns}
        dataSource={selectionData}
      />
    </div>
  );
}

export function RowSelectionOperationDemo() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    [],
  );
  return (
    <Table<DataType>
      rowSelection={{
        selectedRowKeys,
        selections: ["SELECT_ALL", "SELECT_INVERT", "SELECT_NONE"],
        onChange: (keys) => setSelectedRowKeys(keys),
      }}
      columns={selectionColumns}
      dataSource={selectionData}
    />
  );
}

export function RowSelectionCustomDemo() {
  return (
    <Table<DataType>
      rowSelection={{
        renderCell: (checked, _record, _index, originNode) => (
          <Tooltip title={checked ? "Selected" : "Select row"}>
            {originNode}
          </Tooltip>
        ),
        onChange: () => undefined,
      }}
      columns={selectionColumns}
      dataSource={selectionData}
    />
  );
}

const expandableColumns: TableColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "Action", key: "x", render: () => <a href="#table">Delete</a> },
];
const expandableData: DataType[] = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
  },
  {
    key: 3,
    name: "Not Expandable",
    age: 29,
    address: "Jiangsu No. 1 Lake Park",
    description: "This not expandable",
  },
  {
    key: 4,
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.",
  },
];

export function ExpandDemo() {
  return (
    <Table<DataType>
      columns={expandableColumns}
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0 }}>{record.description}</p>
        ),
        rowExpandable: (record) => record.name !== "Not Expandable",
      }}
      dataSource={expandableData}
    />
  );
}

const summaryColumns: TableColumnType<DataType>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Borrow", dataIndex: "age" },
  { title: "Repayment", dataIndex: "address" },
];
const summaryData: DataType[] = [
  { key: "1", name: "John Brown", age: 10, address: "33" },
  { key: "2", name: "Jim Green", age: 100, address: "0" },
  { key: "3", name: "Joe Black", age: 10, address: "10" },
  { key: "4", name: "Jim Red", age: 75, address: "45" },
];

export function SummaryDemo() {
  return (
    <Table<DataType>
      bordered
      columns={summaryColumns}
      dataSource={summaryData}
      pagination={false}
      summary={(pageData) => {
        const totalBorrow = pageData.reduce((sum, row) => sum + row.age, 0);
        const totalRepayment = pageData.reduce(
          (sum, row) => sum + Number(row.address),
          0,
        );
        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>{totalBorrow}</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {totalRepayment}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Balance</Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2}>
                {totalBorrow - totalRepayment}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
}

const responsiveColumns: TableColumnType<DataType>[] = [
  {
    title: "Name (all screens)",
    dataIndex: "name",
    render: (text) => <a href="#table">{text as string}</a>,
  },
  {
    title: "Age (medium screen or bigger)",
    dataIndex: "age",
    responsive: ["md"],
  },
  {
    title: "Address (large screen or bigger)",
    dataIndex: "address",
    responsive: ["lg"],
  },
];
export function ResponsiveDemo() {
  return <Table<DataType> columns={responsiveColumns} dataSource={[data[0]]} />;
}

const treeData: DataType[] = [
  {
    key: 1,
    name: "John Brown sr.",
    age: 60,
    address: "New York No. 1 Lake Park",
    tags: [],
    description: "",
    children: [
      {
        key: 11,
        name: "John Brown",
        age: 42,
        address: "New York No. 2 Lake Park",
      },
      {
        key: 12,
        name: "John Brown jr.",
        age: 30,
        address: "New York No. 3 Lake Park",
        children: [
          {
            key: 121,
            name: "Jimmy Brown",
            age: 16,
            address: "New York No. 3 Lake Park",
          },
        ],
      },
      {
        key: 13,
        name: "Jim Green sr.",
        age: 72,
        address: "London No. 1 Lake Park",
        children: [
          {
            key: 131,
            name: "Jim Green",
            age: 42,
            address: "London No. 2 Lake Park",
          },
        ],
      },
    ],
  },
  { key: 2, name: "Joe Black", age: 32, address: "Sydney No. 1 Lake Park" },
];

export function TreeDataDemo() {
  const [checkStrictly, setCheckStrictly] = useState(false);
  return (
    <>
      <Space align="center" style={{ marginBottom: 16 }}>
        CheckStrictly:{" "}
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Table<DataType>
        columns={selectionColumns}
        rowSelection={{
          type: "checkbox",
          checkStrictly,
          onChange: () => undefined,
        }}
        dataSource={treeData}
      />
    </>
  );
}

export function RemoteDemo() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const tickets = Array.from({ length: 23 }, (_, index) => ({
    key: `T-${String(index + 1).padStart(3, "0")}`,
    name: `资料整理任务 ${index + 1}`,
    age: index + 1,
    address: ["林青", "周然", "许安"][index % 3],
  }));
  const pageRows = tickets.slice((current - 1) * pageSize, current * pageSize);
  return (
    <Table<DataType>
      rowKey="key"
      columns={[
        { title: "编号", dataIndex: "key" },
        { title: "任务", dataIndex: "name" },
        { title: "负责人", dataIndex: "address" },
      ]}
      dataSource={pageRows}
      pagination={{
        current,
        pageSize,
        total: tickets.length,
        showSizeChanger: true,
        pageSizeOptions: [5, 10],
        showTotal: (total) => `共 ${total} 条远端记录`,
      }}
      onChange={(pagination) => {
        setCurrent(pagination.current ?? 1);
        setPageSize(pagination.pageSize ?? 5);
      }}
    />
  );
}

const filterSearchData: DataType[] = [
  ...data,
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];

const filterSearchColumns: TableColumnType<DataType>[] = [
  {
    title: "Name",
    dataIndex: "name",
    filters: [
      { text: "Joe", value: "Joe" },
      {
        text: "Category 1",
        value: "Category 1",
        children: [
          { text: "Jim", value: "Jim" },
          { text: "John", value: "John" },
        ],
      },
      { text: "Category 2", value: "Category 2" },
    ],
    filterMode: "tree",
    filterSearch: true,
    onFilter: (value, record) => record.name.startsWith(String(value)),
    width: "30%",
  },
  {
    title: "Age",
    dataIndex: "age",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Address",
    dataIndex: "address",
    filters: [
      { text: "London", value: "London" },
      { text: "New York", value: "New York" },
    ],
    onFilter: (value, record) => record.address.startsWith(String(value)),
    filterSearch: true,
    width: "40%",
  },
];

export function FilterSearchDemo() {
  return (
    <Table<DataType>
      columns={filterSearchColumns}
      dataSource={filterSearchData}
    />
  );
}

const filterTreeColumns: TableColumnType<DataType>[] = [
  {
    title: "Name",
    dataIndex: "name",
    filters: [
      { text: "Joe", value: "Joe" },
      {
        text: "Category 1",
        value: "Category 1",
        children: [
          { text: "Yellow", value: "Yellow" },
          { text: "Pink", value: "Pink" },
        ],
      },
      {
        text: "Category 2",
        value: "Category 2",
        children: [
          { text: "Green", value: "Green" },
          { text: "Black", value: "Black" },
        ],
      },
    ],
    filterMode: "tree",
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(String(value)),
    width: "30%",
  },
  {
    title: "Age",
    dataIndex: "age",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Address",
    dataIndex: "address",
    filters: [
      { text: "London", value: "London" },
      { text: "New York", value: "New York" },
    ],
    onFilter: (value, record) => record.address.startsWith(String(value)),
    filterSearch: true,
    width: "40%",
  },
];

export function FilterInTreeDemo() {
  return (
    <Table<DataType>
      columns={filterTreeColumns}
      dataSource={filterSearchData}
    />
  );
}

const customFilterData: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  { key: "2", name: "Joe Black", age: 42, address: "London No. 1 Lake Park" },
  { key: "3", name: "Jim Green", age: 32, address: "Sydney No. 1 Lake Park" },
  { key: "4", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
];

function customSearchColumn(
  dataIndex: keyof DataType,
): TableColumnType<DataType> {
  return {
    title: String(dataIndex).replace(/^./, (value) => value.toUpperCase()),
    dataIndex,
    filterDropdown: ({
      selectedKeys,
      setSelectedKeys,
      confirm,
      clearFilters,
      close,
    }: FilterDropdownProps<DataType>) => (
      <div style={{ padding: 8 }}>
        <Input
          autoFocus
          placeholder={`Search ${String(dataIndex)}`}
          value={String(selectedKeys[0] ?? "")}
          onChange={(event) =>
            setSelectedKeys(event.target.value ? [event.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button type="primary" size="small" onClick={() => confirm()}>
            Search
          </Button>
          <Button size="small" onClick={() => clearFilters()}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => confirm({ closeDropdown: false })}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <span style={{ color: filtered ? "#1677ff" : undefined }}>⌕</span>
    ),
    onFilter: (value, record) =>
      String(record[dataIndex] ?? "")
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  };
}

export function CustomFilterPanelDemo() {
  return (
    <Table<DataType>
      columns={[customSearchColumn("name"), customSearchColumn("address")]}
      dataSource={customFilterData}
    />
  );
}

interface ScoreData {
  key: string;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

const scoreData: ScoreData[] = [
  { key: "1", name: "John Brown", chinese: 98, math: 60, english: 70 },
  { key: "2", name: "Jim Green", chinese: 98, math: 66, english: 89 },
  { key: "3", name: "Joe Black", chinese: 98, math: 90, english: 70 },
  { key: "4", name: "Jim Red", chinese: 88, math: 99, english: 89 },
];

const scoreColumns: TableColumnType<ScoreData>[] = [
  { title: "Name", dataIndex: "name" },
  {
    title: "Chinese Score",
    dataIndex: "chinese",
    sorter: { compare: (a, b) => a.chinese - b.chinese, multiple: 3 },
  },
  {
    title: "Math Score",
    dataIndex: "math",
    sorter: { compare: (a, b) => a.math - b.math, multiple: 2 },
  },
  {
    title: "English Score",
    dataIndex: "english",
    sorter: { compare: (a, b) => a.english - b.english, multiple: 1 },
  },
];

export function MultipleSorterDemo() {
  return <Table<ScoreData> columns={scoreColumns} dataSource={scoreData} />;
}

const controlledTableData: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  { key: "2", name: "Jim Green", age: 42, address: "London No. 1 Lake Park" },
  { key: "3", name: "Joe Black", age: 32, address: "Sydney No. 1 Lake Park" },
  { key: "4", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
];

export function ResetFilterDemo() {
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});

  const columns: TableColumnType<DataType>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filters: [
        { text: "Joe", value: "Joe" },
        { text: "Jim", value: "Jim" },
      ],
      filteredValue: filteredInfo.name ?? null,
      onFilter: (value, record) => record.name.includes(String(value)),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filters: [
        { text: "London", value: "London" },
        { text: "New York", value: "New York" },
      ],
      filteredValue: filteredInfo.address ?? null,
      onFilter: (value, record) => record.address.includes(String(value)),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button
          onClick={() => setSortedInfo({ order: "descend", columnKey: "age" })}
        >
          Sort age
        </Button>
        <Button onClick={() => setFilteredInfo({})}>Clear filters</Button>
        <Button
          onClick={() => {
            setFilteredInfo({});
            setSortedInfo({});
          }}
        >
          Clear filters and sorters
        </Button>
      </Space>
      <Table<DataType>
        columns={columns}
        dataSource={controlledTableData}
        onChange={(_pagination, filters, sorter) => {
          setFilteredInfo(filters);
          setSortedInfo(Array.isArray(sorter) ? (sorter[0] ?? {}) : sorter);
        }}
      />
    </>
  );
}

const fixedHeaderData = Array.from({ length: 100 }, (_, index) => ({
  key: index,
  name: `Edward King ${index}`,
  age: 32,
  address: `London, Park Lane no. ${index}`,
}));

export function FixedHeaderDemo() {
  return (
    <Table<DataType>
      columns={[
        { title: "Name", dataIndex: "name", width: 150 },
        { title: "Age", dataIndex: "age", width: 150 },
        { title: "Address", dataIndex: "address" },
      ]}
      dataSource={fixedHeaderData}
      pagination={{ pageSize: 50 }}
      scroll={{ y: 275 }}
    />
  );
}

export function FixedColumnsDemo() {
  const columns: TableColumnType<DataType>[] = [
    { title: "Full Name", width: 100, dataIndex: "name", fixed: "left" },
    { title: "Age", width: 100, dataIndex: "age", fixed: "left", sorter: true },
    ...Array.from({ length: 20 }, (_, index) => ({
      title: `Column ${index + 1}`,
      dataIndex: "address" as const,
      key: String(index + 1),
    })),
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: () => <a href="#table">action</a>,
    },
  ];
  return (
    <Table<DataType>
      pagination={false}
      columns={columns}
      dataSource={[
        { key: "1", name: "Olivia", age: 32, address: "New York Park" },
        { key: "2", name: "Ethan", age: 40, address: "London Park" },
      ]}
      scroll={{ x: "max-content" }}
    />
  );
}

export function GroupingColumnsDemo() {
  return (
    <Table<DataType>
      bordered
      columns={[
        { title: "Name", dataIndex: "name", width: 150 },
        {
          title: "Other",
          children: [
            {
              title: "Age",
              dataIndex: "age",
              width: 100,
              sorter: (a, b) => a.age - b.age,
            },
            {
              title: "Address",
              children: [
                { title: "Street", dataIndex: "address", width: 150 },
                { title: "Block", dataIndex: "address", width: 100 },
              ],
            },
          ],
        },
        { title: "Gender", dataIndex: "name", width: 80 },
      ]}
      dataSource={controlledTableData}
    />
  );
}

const mergedCell = (_record: DataType, index = 0) =>
  index === 1 ? { colSpan: 0 } : {};

export function ColspanRowspanDemo() {
  const mergedColumns: TableColumnType<DataType>[] = [
    { title: "Row head", dataIndex: "key", rowScope: "row" },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a href="#table">{String(text)}</a>,
      onCell: (_, index) => ({ colSpan: index === 1 ? 5 : 1 }),
    },
    { title: "Age", dataIndex: "age", onCell: mergedCell },
    {
      title: "Home phone",
      dataIndex: "address",
      colSpan: 2,
      onCell: (_, index) => {
        if (index === 3) return { rowSpan: 2 };
        if (index === 4) return { rowSpan: 0 };
        if (index === 1) return { colSpan: 0 };
        return {};
      },
    },
    { title: "Phone", dataIndex: "age", colSpan: 0, onCell: mergedCell },
    { title: "Address", dataIndex: "address", onCell: mergedCell },
  ];
  return <Table<DataType> bordered columns={mergedColumns} dataSource={data} />;
}

export function NarrowDemo() {
  const narrowData = Array.from({ length: 30 }, (_, key) => ({
    key,
    name: "Sample Name",
    age: 30 + (key % 5),
    address: `Sample Address ${key}`,
  }));
  return (
    <div style={{ width: 300 }}>
      <Table<DataType>
        columns={selectionColumns}
        dataSource={narrowData}
        size="small"
        pagination={{ defaultCurrent: 2 }}
      />
    </div>
  );
}

export function FixedGappedColumnsDemo() {
  const fixedColumns: TableColumnType<DataType>[] = [
    { title: "Name", dataIndex: "name", width: 140, fixed: "left" },
    { title: "Age", dataIndex: "age", width: 100, fixed: "left" },
    ...Array.from({ length: 6 }, (_, index) => ({
      title: `Column ${index + 1}`,
      dataIndex: "address" as const,
      key: String(index + 1),
      width: 150,
    })),
    { title: "Action", dataIndex: "name", width: 120, fixed: "right" },
  ];
  return (
    <Table<DataType>
      columns={fixedColumns}
      dataSource={data}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
}

const hiddenColumnDefinitions: TableColumnType<DataType>[] = Array.from(
  { length: 8 },
  (_, index) => ({
    title: `Column ${index + 1}`,
    dataIndex: "address",
    key: String(index + 1),
  }),
);

export function HiddenColumnsDemo() {
  const [visible, setVisible] = useState<string[]>(
    hiddenColumnDefinitions.map((column) => String(column.key)),
  );
  const options = hiddenColumnDefinitions.map((column) => ({
    label: String(column.title),
    value: String(column.key),
  }));
  const columns = hiddenColumnDefinitions.map((column) => ({
    ...column,
    hidden: !visible.includes(String(column.key)),
  }));
  return (
    <>
      <Divider>Columns displayed</Divider>
      <Checkbox.Group
        value={visible}
        options={options}
        onChange={(values) => setVisible(values.map(String))}
      />
      <Table<DataType>
        columns={columns}
        dataSource={data.slice(0, 2)}
        style={{ marginTop: 24 }}
      />
    </>
  );
}

export function EllipsisCustomTooltipDemo() {
  const longAddress = "New York No. 1 Lake Park, New York No. 1 Lake Park";
  const columns: TableColumnType<DataType>[] = [
    { title: "Name", dataIndex: "name", width: 150 },
    { title: "Age", dataIndex: "age", width: 80 },
    ...Array.from({ length: 3 }, (_, index) => ({
      title: `Long Column ${index + 1}`,
      dataIndex: "address" as const,
      ellipsis: { showTitle: false },
      render: (address: unknown) => (
        <Tooltip placement="topLeft" title={String(address)}>
          {String(address)}
        </Tooltip>
      ),
    })),
  ];
  return (
    <Table<DataType>
      columns={columns}
      dataSource={[
        { ...data[0], address: longAddress },
        {
          ...data[1],
          address: "London No. 2 Lake Park, London No. 2 Lake Park",
        },
      ]}
    />
  );
}

export function CustomEmptyDemo() {
  const [hasData, setHasData] = useState(true);
  const emptyAction = (
    <Button type="primary" onClick={() => setHasData((value) => !value)}>
      {hasData ? "Clear data" : "Load data"}
    </Button>
  );
  return (
    <Table<DataType>
      bordered
      dataSource={hasData ? data : []}
      columns={selectionColumns}
      locale={{ emptyText: <Empty description="No Data">{emptyAction}</Empty> }}
    />
  );
}

export function VirtualListDemo() {
  const virtualData = Array.from({ length: 1000 }, (_, key) => ({
    key,
    name: `First ${key}`,
    age: 25 + (key % 10),
    address: `New York No. ${key} Lake Park`,
  }));
  return (
    <Table<DataType>
      virtual
      scroll={{ y: 240, x: 700 }}
      pagination={false}
      columns={selectionColumns}
      dataSource={virtualData}
    />
  );
}

export function StickyDemo() {
  const [fixedTop, setFixedTop] = useState(false);
  return (
    <Table<DataType>
      columns={fixedColumnsForSticky}
      dataSource={fixedHeaderData}
      pagination={false}
      scroll={{ x: 1200 }}
      sticky={{ offsetHeader: 0 }}
      summary={() => (
        <Table.Summary fixed={fixedTop ? "top" : "bottom"}>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <Switch checked={fixedTop} onChange={setFixedTop} /> Fixed Top
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={3}>
              Scroll Context
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
}

const fixedColumnsForSticky: TableColumnType<DataType>[] = [
  { title: "Full Name", dataIndex: "name", width: 120, fixed: "left" },
  { title: "Age", dataIndex: "age", width: 90, fixed: "left" },
  ...Array.from({ length: 6 }, (_, index) => ({
    title: `Column ${index + 1}`,
    dataIndex: "address" as const,
    key: String(index + 1),
    width: 150,
  })),
  { title: "Action", dataIndex: "name", width: 100, fixed: "right" },
];

export function AjaxDemo() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rows = Array.from({ length: 100 }, (_, index) => ({
    key: index,
    name: `User ${index + 1}`,
    age: 20 + (index % 30),
    address: index % 2 ? "Female" : "Male",
  }));
  return (
    <Table<DataType>
      loading={loading}
      columns={[
        { title: "Name", dataIndex: "name", sorter: true },
        {
          title: "Gender",
          dataIndex: "address",
          filters: [
            { text: "Male", value: "Male" },
            { text: "Female", value: "Female" },
          ],
          onFilter: (value, record) => record.address === String(value),
        },
        { title: "Age", dataIndex: "age" },
      ]}
      dataSource={rows.slice((page - 1) * 10, page * 10)}
      pagination={{ current: page, total: rows.length, pageSize: 10 }}
      onChange={(pagination) => {
        setLoading(true);
        setPage(pagination.current ?? 1);
        window.setTimeout(() => setLoading(false), 300);
      }}
    />
  );
}

export function FixedColumnsHeaderDemo() {
  return (
    <Table<DataType>
      columns={fixedColumnsForSticky}
      dataSource={fixedHeaderData}
      pagination={false}
      scroll={{ x: 1400, y: 240 }}
      sticky
    />
  );
}

export function TreeTableEllipsisDemo() {
  const [fixed, setFixed] = useState(true);
  const ellipsisTreeData: DataType[] = [
    {
      key: 1,
      name: "John Brown sr. John Brown sr. John Brown sr.",
      age: 60,
      address: "New York No. 1 Lake Park",
      children: [
        {
          key: 11,
          name: "John Brown jr. John Brown jr. John Brown jr.",
          age: 42,
          address: "New York No. 2 Lake Park",
        },
      ],
    },
    { key: 2, name: "Joe Black", age: 32, address: "Sydney No. 1 Lake Park" },
  ];
  return (
    <>
      <Space align="center" style={{ marginBottom: 12 }}>
        Fixed first column <Switch checked={fixed} onChange={setFixed} />
      </Space>
      <Table<DataType>
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            width: 180,
            ellipsis: true,
            fixed: fixed ? "left" : undefined,
          },
          { title: "Age", dataIndex: "age", width: 100 },
          { title: "Address", dataIndex: "address" },
        ]}
        dataSource={ellipsisTreeData}
        scroll={{ x: 560 }}
      />
    </>
  );
}

interface NestedExpandedData {
  key: string;
  date: string;
  name: string;
  status: string;
  upgrade: string;
}

export function NestedTableDemo() {
  const nestedRows: NestedExpandedData[] = [
    {
      key: "0",
      date: "2014-12-24 23:12:00",
      name: "Production",
      status: "Finished",
      upgrade: "56",
    },
    {
      key: "1",
      date: "2014-12-25 23:12:00",
      name: "Staging",
      status: "Running",
      upgrade: "12",
    },
  ];
  const expandedRowRender = () => (
    <Table<NestedExpandedData>
      columns={[
        { title: "Date", dataIndex: "date" },
        { title: "Name", dataIndex: "name" },
        { title: "Status", dataIndex: "status" },
        { title: "Upgrade Status", dataIndex: "upgrade" },
      ]}
      dataSource={nestedRows}
      pagination={false}
      size="small"
    />
  );
  const nestedData: DataType[] = [
    { key: "0", name: "Screen", age: 10, address: "iOS" },
    { key: "1", name: "Dashboard", age: 12, address: "Android" },
    { key: "2", name: "Settings", age: 8, address: "Web" },
  ];
  return (
    <Table<DataType>
      columns={[
        { title: "Name", dataIndex: "name" },
        { title: "Platform", dataIndex: "address" },
        { title: "Version", dataIndex: "age" },
      ]}
      expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
      dataSource={nestedData}
    />
  );
}

export function EllipsisDemo() {
  return (
    <Table<DataType>
      columns={[
        { title: "Name", dataIndex: "name", width: 150 },
        { title: "Age", dataIndex: "age", width: 80 },
        { title: "Address", dataIndex: "address", ellipsis: true },
        {
          title: "Long Column Long Column",
          dataIndex: "address",
          ellipsis: true,
        },
      ]}
      dataSource={[
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New York No. 1 Lake Park, New York No. 1 Lake Park",
        },
        {
          key: "2",
          name: "Jim Green",
          age: 42,
          address: "London No. 2 Lake Park, London No. 2 Lake Park",
        },
      ]}
    />
  );
}

const orderedColumnData: DataType[] = [...expandableData];

export function OrderColumnDemo() {
  return (
    <Table<DataType>
      columns={[
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Age", dataIndex: "age", key: "age" },
        { title: "Address", dataIndex: "address", key: "address" },
      ]}
      rowSelection={{ onChange: () => undefined }}
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0 }}>{record.description}</p>
        ),
      }}
      dataSource={orderedColumnData}
    />
  );
}

interface EditableTableData {
  key: string;
  name: string;
  age: string;
  address: string;
}

const editableTableSeed: EditableTableData[] = [
  {
    key: "0",
    name: "Edward King 0",
    age: "32",
    address: "London, Park Lane no. 0",
  },
  {
    key: "1",
    name: "Edward King 1",
    age: "32",
    address: "London, Park Lane no. 1",
  },
];

export function EditCellDemo() {
  const [rows, setRows] = useState(editableTableSeed);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableTableData | null>(null);

  const startEdit = (row: EditableTableData) => {
    setEditingKey(row.key);
    setDraft({ ...row });
  };
  const save = () => {
    if (!draft) return;
    setRows((current) =>
      current.map((row) => (row.key === draft.key ? draft : row)),
    );
    setEditingKey(null);
    setDraft(null);
  };
  const cancel = () => {
    setEditingKey(null);
    setDraft(null);
  };
  const columns: TableColumnType<EditableTableData>[] = [
    ...(["name", "age", "address"] as const).map((field) => ({
      title: field,
      dataIndex: field,
      render: (value: unknown, row: EditableTableData) =>
        editingKey === row.key ? (
          <Input
            value={draft?.[field] ?? ""}
            onChange={(event) =>
              setDraft((current) =>
                current ? { ...current, [field]: event.target.value } : current,
              )
            }
            onPressEnter={save}
          />
        ) : (
          <Button
            type="link"
            onClick={() => startEdit(row)}
            style={{ padding: 0, cursor: "text" }}
          >
            {String(value ?? "")}
          </Button>
        ),
    })),
    {
      title: "operation",
      key: "operation",
      render: (_value, row) =>
        editingKey === row.key ? (
          <Space size="small">
            <Button type="link" onClick={save}>
              Save
            </Button>
            <Button type="link" onClick={cancel}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Button type="link" onClick={() => startEdit(row)}>
            Edit
          </Button>
        ),
    },
  ];
  return (
    <>
      <Button
        type="primary"
        onClick={() => startEdit(rows[0])}
        style={{ marginBottom: 16 }}
      >
        Edit first row
      </Button>
      <Table<EditableTableData> bordered dataSource={rows} columns={columns} />
    </>
  );
}

export function EditRowDemo() {
  const [rows, setRows] = useState(
    Array.from({ length: 5 }, (_, index) => ({
      key: String(index),
      name: `Edward ${index}`,
      age: 32,
      address: `London Park no. ${index}`,
    })),
  );
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<(typeof rows)[number] | null>(null);
  const columns: TableColumnType<(typeof rows)[number]>[] = [
    {
      title: "name",
      dataIndex: "name",
      render: (value, row) =>
        editingKey === row.key ? (
          <Input
            value={draft?.name ?? ""}
            onChange={(event) =>
              setDraft((current) =>
                current ? { ...current, name: event.target.value } : current,
              )
            }
          />
        ) : (
          value
        ),
    },
    {
      title: "age",
      dataIndex: "age",
      render: (value, row) =>
        editingKey === row.key ? (
          <Input
            value={String(draft?.age ?? "")}
            onChange={(event) =>
              setDraft((current) =>
                current
                  ? { ...current, age: Number(event.target.value) || 0 }
                  : current,
              )
            }
          />
        ) : (
          value
        ),
    },
    {
      title: "address",
      dataIndex: "address",
      render: (value, row) =>
        editingKey === row.key ? (
          <Input
            value={draft?.address ?? ""}
            onChange={(event) =>
              setDraft((current) =>
                current ? { ...current, address: event.target.value } : current,
              )
            }
          />
        ) : (
          value
        ),
    },
    {
      title: "operation",
      key: "operation",
      render: (_value, row) =>
        editingKey === row.key ? (
          <Space size="small">
            <Button
              type="link"
              onClick={() => {
                if (draft)
                  setRows((current) =>
                    current.map((item) =>
                      item.key === draft.key ? draft : item,
                    ),
                  );
                setEditingKey(null);
                setDraft(null);
              }}
            >
              Save
            </Button>
            <Button
              type="link"
              onClick={() => {
                setEditingKey(null);
                setDraft(null);
              }}
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Button
            type="link"
            disabled={editingKey !== null}
            onClick={() => {
              setEditingKey(row.key);
              setDraft({ ...row });
            }}
          >
            Edit
          </Button>
        ),
    },
  ];
  return (
    <Table bordered dataSource={rows} columns={columns} pagination={false} />
  );
}

interface DraggableRow {
  key: string;
  name: string;
  age: number;
  address: string;
}

const draggableRows: DraggableRow[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "Long text Long text Long text",
  },
  { key: "2", name: "Jim Green", age: 42, address: "London No. 1 Lake Park" },
  { key: "3", name: "Joe Black", age: 32, address: "Sydney No. 1 Lake Park" },
];

const draggableColumns: TableColumnType<DraggableRow>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Age", dataIndex: "age" },
  { title: "Address", dataIndex: "address" },
];

export function DragSortingDemo() {
  const [rows, setRows] = useState(draggableRows);
  const [dragging, setDragging] = useState<string | null>(null);
  const move = (target: DraggableRow) => {
    if (!dragging || dragging === target.key) return;
    setRows((current) => {
      const from = current.findIndex((row) => row.key === dragging);
      const to = current.findIndex((row) => row.key === target.key);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDragging(null);
  };
  return (
    <Table<DraggableRow>
      rowKey="key"
      columns={draggableColumns}
      dataSource={rows}
      onRow={(record) => ({
        draggable: true,
        style: { cursor: "move" },
        onDragStart: () => setDragging(record.key),
        onDragOver: (event) => event.preventDefault(),
        onDrop: () => move(record),
        onDragEnd: () => setDragging(null),
      })}
    />
  );
}

export function DragColumnSortingDemo() {
  const [columns, setColumns] = useState(
    ["Name", "Gender", "Age", "Email", "Address"].map((title, index) => ({
      title,
      key: String(index),
      dataIndex: title.toLowerCase(),
    })),
  );
  const [dragging, setDragging] = useState<string | null>(null);
  const move = (key: string) => {
    if (!dragging || dragging === key) return;
    setColumns((current) => {
      const from = current.findIndex((column) => column.key === dragging);
      const to = current.findIndex((column) => column.key === key);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDragging(null);
  };
  const dataSource = draggableRows.map((row) => ({
    ...row,
    gender: row.key === "1" ? "male" : "female",
    email: `${row.name.toLowerCase().replace(" ", ".")}@example.com`,
  }));
  return (
    <Table
      rowKey="key"
      columns={columns.map((column) => ({
        ...column,
        onHeaderCell: () => ({
          draggable: true,
          style: { cursor: "move" },
          onDragStart: () => setDragging(column.key),
          onDragOver: (event) => event.preventDefault(),
          onDrop: () => move(column.key),
          onDragEnd: () => setDragging(null),
        }),
      }))}
      dataSource={dataSource}
    />
  );
}

export function DragSortingHandlerDemo() {
  const [rows, setRows] = useState(draggableRows);
  const [dragging, setDragging] = useState<string | null>(null);
  const move = (target: DraggableRow) => {
    if (!dragging || dragging === target.key) return;
    setRows((current) => {
      const from = current.findIndex((row) => row.key === dragging);
      const to = current.findIndex((row) => row.key === target.key);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDragging(null);
  };
  return (
    <Table<DraggableRow>
      rowKey="key"
      columns={[
        {
          key: "sort",
          title: "",
          width: 64,
          render: () => (
            <Button type="text" aria-label="Drag row">
              ☷
            </Button>
          ),
        },
        ...draggableColumns,
      ]}
      dataSource={rows}
      onRow={(record) => ({
        draggable: true,
        onDragStart: () => setDragging(record.key),
        onDragOver: (event) => event.preventDefault(),
        onDrop: () => move(record),
        onDragEnd: () => setDragging(null),
      })}
    />
  );
}

export function DynamicSettingsDemo() {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [expandable, setExpandable] = useState(true);
  const [rowSelection, setRowSelection] = useState(true);
  const [hasData, setHasData] = useState(true);
  const [ellipsis, setEllipsis] = useState(false);
  const [size, setSize] = useState<"large" | "middle" | "small">("large");
  const [yScroll, setYScroll] = useState(false);
  const controls = [
    ["Bordered", bordered, setBordered],
    ["Loading", loading, setLoading],
    ["Title", showTitle, setShowTitle],
    ["Column header", showHeader, setShowHeader],
    ["Footer", showFooter, setShowFooter],
    ["Expandable", expandable, setExpandable],
    ["Checkbox", rowSelection, setRowSelection],
    ["Fixed header", yScroll, setYScroll],
    ["Has data", hasData, setHasData],
    ["Ellipsis", ellipsis, setEllipsis],
  ] as const;
  const columns: TableColumnType<DataType>[] = selectionColumns.map(
    (column) => ({
      ...column,
      ellipsis,
    }),
  );
  return (
    <>
      <Space wrap style={{ marginBottom: 16 }}>
        {controls.map(([label, checked, onChange]) => (
          <Space key={label} size={4}>
            <span>{label}</span>
            <Switch checked={checked} onChange={onChange} />
          </Space>
        ))}
        <Radio.Group
          value={size}
          onChange={(event) => setSize(event.target.value as typeof size)}
        >
          <Radio.Button value="large">Large</Radio.Button>
          <Radio.Button value="middle">Middle</Radio.Button>
          <Radio.Button value="small">Small</Radio.Button>
        </Radio.Group>
      </Space>
      <Table<DataType>
        bordered={bordered}
        loading={loading}
        size={size}
        showHeader={showHeader}
        title={showTitle ? () => "Here is title" : undefined}
        footer={showFooter ? () => "Here is footer" : undefined}
        rowSelection={rowSelection ? { onChange: () => undefined } : undefined}
        expandable={
          expandable
            ? { expandedRowRender: (record) => <p>{record.description}</p> }
            : undefined
        }
        scroll={yScroll ? { y: 240 } : undefined}
        columns={columns}
        dataSource={hasData ? data : []}
      />
    </>
  );
}
