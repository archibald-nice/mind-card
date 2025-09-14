import {
  Add as AddIcon,
  Help as HelpIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';

interface HeaderProps {
  onCreateCard: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onCreateCard,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* 左侧标题区域 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
              >
                MC
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#111827',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  lineHeight: 1.2,
                }}
              >
                数字化卡片看板
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6b7280',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Mind Card Dashboard
              </Typography>
            </Box>
          </Box>

          {/* 中间搜索区域 */}
          <Box sx={{ flex: 1, maxWidth: 'xl', mx: 4 }}>
            <TextField
              fullWidth
              placeholder="搜索卡片标题或内容..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f9fafb',
                },
              }}
            />
          </Box>

          {/* 右侧按钮区域 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateCard}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              新建卡片
            </Button>

            <Button
              variant="contained"
              onClick={onCreateCard}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                minWidth: 'auto',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              <AddIcon />
            </Button>

            <IconButton size="small" sx={{ color: '#6b7280' }} title="设置">
              <SettingsIcon />
            </IconButton>

            <IconButton size="small" sx={{ color: '#6b7280' }} title="帮助">
              <HelpIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
