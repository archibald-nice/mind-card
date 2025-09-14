import { Card } from '@/types/card';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { Box, Breadcrumbs, Chip, Container, Tooltip } from '@mui/material';
import React from 'react';

interface BreadcrumbProps {
  currentPath: Card[];
  onNavigateBack: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentPath,
  onNavigateBack,
}) => {
  const items = [
    <Chip
      key="home"
      icon={<HomeIcon fontSize="small" />}
      label="根目录"
      clickable
      onClick={() => onNavigateBack(-1)}
      size="small"
      sx={{
        backgroundColor: 'transparent',
        border: '1px solid #e0e0e0',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      }}
    />,
    ...currentPath.map((card, index) => (
      <Tooltip key={card.id} title={card.title} arrow>
        <Chip
          label={card.title}
          clickable
          onClick={() => onNavigateBack(index)}
          size="small"
          sx={{
            maxWidth: 200,
            backgroundColor: 'transparent',
            border: '1px solid #e0e0e0',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            '& .MuiChip-label': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          }}
        />
      </Tooltip>
    )),
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        py: 1,
      }}
    >
      <Container maxWidth="xl">
        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" sx={{ color: '#9e9e9e' }} />
          }
          sx={{
            '& .MuiBreadcrumbs-ol': {
              flexWrap: 'nowrap',
            },
          }}
        >
          {items}
        </Breadcrumbs>
      </Container>
    </Box>
  );
};

export default Breadcrumb;
