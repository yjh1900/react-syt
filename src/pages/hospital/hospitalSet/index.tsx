import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Button, Modal, Form, Input, Spin, Space, Table } from 'antd'
import { useAppSelector } from '@/app/hooks'
import { selectUser } from '@pages/login/slice'
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { HospitalList, HospitalItem } from '@/api/hospital/hospitalSet/model/hospitalTypes'
import { getHospitalSetListApi } from '@/api/hospital/hospitalSet'

const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const columns: ColumnsType<HospitalItem> = [
  //  title: 'Name', // 决定了表头要展示的信息
  //  // 如果我们既写了dataIndex,又写了render.则dataIndex的值决定了render函数第一次参数接收到什么数据
  //  // 比如此时写了name,则render函数中第一个参数就是每一个data数组中对象的name属性的值
  //  // 如果我们不写dataIndex,则render函数中第一个参数,就是data中的每一个数据对象
  //  dataIndex: 'address',
  //  key: 'name',
  //  // 1. 如果写了render属性,则这一列到底要展示什么数据,有render函数的返回值决定
  //  // 2. 如果不写render,只写了dataIndex,则这一列到底展示什么数据,有dataIndex的值决定.dataIndex的值应该是data数据中每一个对象的属性
  //  // render: (text, record, index) => {
  //  //   // text 收到了dataIndex的影响
  //  //   // record一定是data数组中的每一个数据对象
  //  //   // index 一定是data数组中的每一个数据对象的下标
  //  //   console.log(text, record, index)
  //  //   return 1
  //  // },
  {
    title: '序号',
    render(a, b, index) {
      return index + 1
    },
    width: 80,
    align: 'center',
  },
  {
    title: '医院名称',
    dataIndex: 'hosname',
    key: 'hosname',
  },
  {
    title: '医院编码',
    dataIndex: 'hoscode',
    key: 'hoscode',
  },
  {
    title: 'api基础路径',
    dataIndex: 'apiUrl',
    key: 'apiUrl',
  },
  {
    title: '签名',
    dataIndex: 'signKey',
    key: 'signKey',
  },
  {
    title: '联系人名称',
    dataIndex: 'contactsName',
    key: 'contactsName',
  },
  {
    title: '联系人手机号',
    dataIndex: 'contactsPhone',
    key: 'contactsPhone',
  },
  {
    title: '操作',
    // 粘滞在右侧
    fixed: 'right',
    width: 100,
    render: (_, row) => (
      <>
        <Space>
          <Button type="primary" icon={<EditOutlined />}></Button>
          <Button type="primary" danger icon={<DeleteOutlined />}></Button>
        </Space>
      </>
    ),
  },
]

function HospitalSet() {
  const user = useAppSelector(selectUser)
  const { t } = useTranslation(['app'])
  const [hospitalListData, setHospitalListData] = useState<HospitalList>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [total, setTotal] = useState<number>()
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const [loading, setLoading] = useState(false)
  const [isAddOrUpdateShow, setIsAddOrUpdateShow] = useState(false)

  // 请求医院列表
  async function getHospitalSetList(page: number, limit: number) {
    setLoading(true)
    const res = await getHospitalSetListApi(page, limit)
    setHospitalListData(res.records)
    setTotal(res.total)
    setLoading(false)
  }

  // 多选
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  // 页码或 pageSize 改变的回调
  const pageChange = (page: number, size: number) => {
    setCurrent(page)
    setPageSize(size)
    getHospitalSetList(page, size)
  }

  const showModal = () => {
    setIsAddOrUpdateShow(true)
  }

  const handleOk = () => {
    setIsAddOrUpdateShow(false)
  }

  const handleCancel = () => {
    setIsAddOrUpdateShow(false)
  }
  /* 
       如果在useEffect的第二个参数,传入一个空的数组,
       则useEffect只相当于componentDidMount
       数组中可以传入state或porps数据,传入到数组的数据,
       就是被监听的数据,只要这些数据中有一个的值发生变化,这个函数才会重新执  
  */
  useEffect(() => {
    getHospitalSetList(current, pageSize)
  }, [])
  return (
    <Card style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Form name="basic" layout="inline" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder="医院名称" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input placeholder="医院编号" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <SearchOutlined />
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">清空</Button>
        </Form.Item>
      </Form>

      <Space style={{ marginTop: 20 }}>
        <Button type="primary">添加</Button>
        {/* 危险按钮是属性而不是type */}
        <Button type="primary" danger>
          批量删除
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table
          scroll={{ x: 1300 }}
          bordered
          // 给表格数据的每一行加key
          // 值写一个字符串的id,则表示每一行的key就是 这条数据的id
          // 值写一个字符串的hoscode,则表示每一行的key就是 这条数据的hoscode
          rowKey="id"
          style={{ marginTop: 20 }}
          columns={columns}
          dataSource={hospitalListData}
          pagination={{
            total: total,
            showTotal: (total) => `共 ${total} 条数据`,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: [5, 10, 20],
            pageSize: pageSize, // 每页条数
            current: current, // 当前页数
            onChange: pageChange,
          }}
          rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        />
      </Spin>
    </Card>
  )
}

export default HospitalSet
