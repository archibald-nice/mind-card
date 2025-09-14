import { PageContainer } from '@ant-design/pro-components';
import { Typography } from 'antd';

const { Title } = Typography;

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Title level={2}>欢迎使用数字化卡片看板</Title>
        <p>这是一个基于 React 和 UmiJS 的思维卡片管理应用</p>
      </div>
    </PageContainer>
  );
};

export default HomePage;
