import {
  batchDeleteCards,
  createCard,
  deleteCard,
  getCards,
  getCardsByStatus,
  getStatistics,
  searchCards,
  toggleFavorite,
  togglePublic,
  updateCard,
  updateCardStatus,
  type CardDTO,
} from '@/services/card';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  GlobalOutlined,
  HeartFilled,
  HeartOutlined,
  LockOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const CardManagement: React.FC = () => {
  const [cards, setCards] = useState<CardDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState<CardDTO | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [statistics, setStatistics] = useState<Record<string, number>>({});
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [form] = Form.useForm();

  // 加载卡片数据
  const loadCards = async (page = 1, size = 10, keyword = '', status = '') => {
    setLoading(true);
    try {
      let response;
      if (keyword) {
        response = await searchCards({
          keyword,
          page: page - 1,
          size,
        });
      } else if (status) {
        response = await getCardsByStatus({
          status,
          page: page - 1,
          size,
        });
      } else {
        response = await getCards({
          page: page - 1,
          size,
          sortBy: 'createdAt',
          sortDir: 'desc',
        });
      }

      if (response.success) {
        setCards(response.data.content);
        setPagination({
          current: page,
          pageSize: size,
          total: response.data.totalElements,
        });
      }
    } catch (error) {
      message.error('加载卡片失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载统计信息
  const loadStatistics = async () => {
    try {
      const response = await getStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  };

  useEffect(() => {
    loadCards(1, 10, '', '');
    loadStatistics();
  }, []);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setStatusFilter(''); // 清空状态筛选
    loadCards(1, pagination.pageSize, value, '');
  };

  // 处理状态筛选
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setSearchKeyword(''); // 清空搜索关键词
    loadCards(1, pagination.pageSize, '', value);
  };

  // 处理分页变化
  const handleTableChange = (paginationInfo: TablePaginationConfig) => {
    if (paginationInfo?.current && paginationInfo?.pageSize) {
      loadCards(
        paginationInfo.current,
        paginationInfo.pageSize,
        searchKeyword,
        statusFilter,
      );
    }
  };

  // 打开新增/编辑模态框
  const openModal = (card?: CardDTO) => {
    setEditingCard(card || null);
    setModalVisible(true);
    if (card) {
      form.setFieldsValue(card);
    } else {
      form.resetFields();
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setModalVisible(false);
    setEditingCard(null);
    form.resetFields();
  };

  // 保存卡片
  const handleSave = async (
    values: Omit<
      CardDTO,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'viewCount'
    >,
  ) => {
    try {
      if (editingCard) {
        if (editingCard.id) {
          await updateCard(editingCard.id, values);
          message.success('更新卡片成功');
        } else {
          message.error('卡片ID不存在，无法更新');
          return;
        }
      } else {
        await createCard(values);
        message.success('创建卡片成功');
      }
      closeModal();
      loadCards(
        pagination.current,
        pagination.pageSize,
        searchKeyword,
        statusFilter,
      );
      loadStatistics();
    } catch (error) {
      message.error(editingCard ? '更新卡片失败' : '创建卡片失败');
    }
  };

  // 删除卡片
  const handleDelete = async (id: number) => {
    try {
      await deleteCard(id);
      message.success('删除卡片成功');
      loadCards(
        pagination.current,
        pagination.pageSize,
        searchKeyword,
        statusFilter,
      );
      loadStatistics();
    } catch (error) {
      message.error('删除卡片失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的卡片');
      return;
    }
    try {
      await batchDeleteCards(selectedRowKeys as number[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      loadCards(
        pagination.current,
        pagination.pageSize,
        searchKeyword,
        statusFilter,
      );
      loadStatistics();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = async (id: number) => {
    try {
      await toggleFavorite(id);
      loadCards(
        pagination.current,
        pagination.pageSize,
        searchKeyword,
        statusFilter,
      );
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 切换公开状态
  const handleTogglePublic = async (id: number) => {
    try {
      await togglePublic(id);
      loadCards(
        pagination.current,
        pagination.pageSize,
        searchKeyword,
        statusFilter,
      );
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 更新状态
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateCardStatus(id, status);
      loadCards(
        pagination.current,
        pagination.pageSize,
        searchKeyword,
        statusFilter,
      );
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'default';
      case 'PUBLISHED':
        return 'success';
      case 'ARCHIVED':
        return 'warning';
      default:
        return 'default';
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'red';
    if (priority >= 3) return 'orange';
    if (priority >= 2) return 'blue';
    return 'default';
  };

  const columns: ColumnsType<CardDTO> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (text: string, record: CardDTO) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          {record.category && <Tag color="blue">{record.category}</Tag>}
        </div>
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxHeight: '60px', overflow: 'hidden' }}>
          {text || '无内容'}
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string) => {
        if (!tags) return '-';
        return tags
          .split(',')
          .map((tag, index) => <Tag key={index}>{tag.trim()}</Tag>);
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      align: 'center',
      render: (priority: number) => (
        <Badge
          count={priority || 0}
          color={getPriorityColor(priority || 0)}
          showZero
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: CardDTO) => (
        <Select
          size="small"
          value={status}
          style={{ width: '100%' }}
          onChange={value => record.id && handleStatusChange(record.id, value)}
        >
          <Option value="DRAFT">
            <Tag color={getStatusColor('DRAFT')}>草稿</Tag>
          </Option>
          <Option value="PUBLISHED">
            <Tag color={getStatusColor('PUBLISHED')}>已发布</Tag>
          </Option>
          <Option value="ARCHIVED">
            <Tag color={getStatusColor('ARCHIVED')}>已归档</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: '查看次数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      align: 'center',
      render: (count: number) => (
        <span>
          <EyeOutlined /> {count || 0}
        </span>
      ),
    },
    {
      title: '状态',
      key: 'flags',
      width: 100,
      render: (_, record: CardDTO) => (
        <Space>
          <Tooltip title={record.isFavorite ? '取消收藏' : '收藏'}>
            <Button
              type="text"
              size="small"
              icon={
                record.isFavorite ? (
                  <HeartFilled style={{ color: 'red' }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={() => record.id && handleToggleFavorite(record.id)}
            />
          </Tooltip>
          <Tooltip title={record.isPublic ? '设为私有' : '设为公开'}>
            <Button
              type="text"
              size="small"
              icon={
                record.isPublic ? (
                  <GlobalOutlined style={{ color: 'green' }} />
                ) : (
                  <LockOutlined />
                )
              }
              onClick={() => record.id && handleTogglePublic(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => (date ? new Date(date).toLocaleString() : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record: CardDTO) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这张卡片吗？"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <PageContainer title="卡片管理">
      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总卡片数" value={statistics.totalCards || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已发布" value={statistics.publishedCards || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="草稿" value={statistics.draftCards || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="收藏数" value={statistics.favoriteCards || 0} />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* 工具栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="搜索卡片标题或内容"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="状态筛选"
              allowClear
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <Option value="DRAFT">草稿</Option>
              <Option value="PUBLISHED">已发布</Option>
              <Option value="ARCHIVED">已归档</Option>
            </Select>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
              >
                新建卡片
              </Button>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={`确定要删除选中的 ${selectedRowKeys.length} 张卡片吗？`}
                  onConfirm={handleBatchDelete}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger>批量删除 ({selectedRowKeys.length})</Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={cards}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingCard ? '编辑卡片' : '新建卡片'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            status: 'DRAFT',
            priority: 1,
            isFavorite: false,
            isPublic: false,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input placeholder="请输入卡片标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="分类">
                <Input placeholder="请输入分类" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="content" label="内容">
            <TextArea rows={6} placeholder="请输入卡片内容" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tags" label="标签">
                <Input placeholder="多个标签用逗号分隔" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="priority" label="优先级">
                <Select>
                  <Option value={1}>低</Option>
                  <Option value={2}>中</Option>
                  <Option value={3}>高</Option>
                  <Option value={4}>紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态">
                <Select>
                  <Option value="DRAFT">草稿</Option>
                  <Option value="PUBLISHED">已发布</Option>
                  <Option value="ARCHIVED">已归档</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="color" label="颜色">
                <Input placeholder="颜色代码，如 #FF5722" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isFavorite" label="收藏" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isPublic" label="公开" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={closeModal}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingCard ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default CardManagement;
