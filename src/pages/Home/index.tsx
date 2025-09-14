import { PageContainer } from '@ant-design/pro-components';
import { Apps as AppsIcon, Home as HomeIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Typography } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <PageContainer>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
          }}
        >
          欢迎使用数字化卡片看板
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
          基于 React 和 UmiJS 的思维卡片管理应用
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          justifyContent: 'center',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <Box sx={{ flex: 1, maxWidth: { md: '50%', lg: '40%' } }}>
          <Card sx={{ p: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AppsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    卡片看板
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    可视化卡片管理，支持拖拽和嵌套
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                通过直观的界面管理您的思维卡片，支持：
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  拖拽式卡片布局
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  嵌套式卡片结构
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  实时搜索和过滤
                </Typography>
                <Typography component="li" variant="body2">
                  响应式设计
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1, maxWidth: { md: '50%', lg: '40%' } }}>
          <Card sx={{ p: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <HomeIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }}
                />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    快速开始
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    立即开始使用卡片看板
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                点击顶部的导航栏，您可以：
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  访问首页查看应用介绍
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  进入卡片看板开始管理
                </Typography>
                <Typography component="li" variant="body2">
                  享受现代化的用户体验
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default HomePage;
