import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Button, Modal, Form, Input, Spin, Space, Table, message } from 'antd'
import { useAppSelector } from '@/app/hooks'
import { selectUser } from '@pages/login/slice'
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { HospitalList, HospitalItem } from '@/api/hospital/hospitalSet/model/hospitalTypes'
import { getHospitalSetListApi, addHospitalSetListApi } from '@/api/hospital/hospitalSet'

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
  const [isAddOrUpdateShow, setIsAddOrUpdateShow] = useState<boolean>(false)
  // form组件
  const [addForm] = Form.useForm()
  const [searchForm] = Form.useForm()

  // 请求医院列表
  async function getHospitalSetList(page: number, limit: number) {
    setLoading(true)
    const { hosname, hoscode } = searchForm.getFieldsValue()
    const res = await getHospitalSetListApi(page, limit, hosname, hoscode)
    setHospitalListData(res.records)
    setTotal(res.total)
    setLoading(false)
  }

  // 搜索医院
  const onFinish = (values: any) => {
    getHospitalSetList(current, pageSize)
    setCurrent(1)
  }
  const resetForm = () => {
    // 将表单值置空
    searchForm.setFieldsValue({ hosname: undefined, hoscode: undefined })
    // 重新渲染列表
    getHospitalSetList(current, pageSize)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  // 提交添加表单
  const onFinishModal = async (values: any) => {
    console.log('Success:', values)
    // setIsAddOrUpdateShow(false)
    await addHospitalSetListApi(values)
    setIsAddOrUpdateShow(false)
    getHospitalSetList(current, pageSize)
    message.success('添加医院成功')
  }
  const onFinishFailedModal = () => {}
  // 多选
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  // 页码或 pageSize 改变的回调
  const pageChange = (page: number, size: number) => {
    setCurrent(page)
    setPageSize(size)
    getHospitalSetList(page, size)
  }

  const searchHospital = () => {
    console.log(searchForm, 'a')
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
      <Form form={searchForm} name="basic" layout="inline" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
        <Form.Item name="hosname">
          <Input placeholder="医院名称" />
        </Form.Item>
        <Form.Item name="hoscode">
          <Input placeholder="医院编号" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={searchHospital}>
            <SearchOutlined />
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={resetForm}>清空</Button>
        </Form.Item>
      </Form>

      <Space style={{ marginTop: 20 }}>
        <Button type="primary" onClick={showModal}>
          添加
        </Button>
        {/* 危险按钮是属性而不是type */}
        <Button type="primary" danger>
          批量删除
        </Button>
      </Space>

      {/* 模态框 */}
      {/* visible控制可见性，版本大于4.23使用open属性 */}
      <Modal title="添加医院" visible={isAddOrUpdateShow} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Form form={addForm} name="basic" labelCol={{ span: 6, offset: 1 }} wrapperCol={{ span: 15 }} onFinish={onFinishModal} onFinishFailed={onFinishFailedModal}>
          <Form.Item label="医院名称" name="hosname" rules={[{ required: true, message: '请填写医院名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="医院编码" name="hoscode" rules={[{ required: true, message: '请填写医院编码' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="api基础路径" name="apiUrl" rules={[{ required: true, message: '请填写api基础路径' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="联系人名称" name="contactsName" rules={[{ required: true, message: '请填写联系人名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="联系人手机"
            name="contactsPhone"
            rules={[
              {
                required: true,
                message: '请填写手机号',
                pattern: /^1[3-9]\d{9}$/,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={handleCancel}>返回</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

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
