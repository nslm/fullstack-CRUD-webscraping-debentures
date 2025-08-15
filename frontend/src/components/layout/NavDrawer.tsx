import React from 'react'
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
import AutomationIcon from '@mui/icons-material/DownloadForOffline';
import MonetizationOnIcon from '@mui/icons-material/Receipt';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useLocation } from 'react-router-dom';

type Props = { open: boolean; onNavigate: (path: string) => void; drawerWidth: number }


const NavDrawer: React.FC<Props> = ({ open, onNavigate, drawerWidth }) => {

  const location = useLocation()
  const items = [
    { text: 'Automações', icon: <AutomationIcon />, path: '/automacoes' },
    { text: 'Debentures', icon: <MonetizationOnIcon />, path: '/debentures' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' }
  ]

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              onNavigate(item.path);
            }}
            sx={{px:4, mt:0}}
          >
            <ListItemIcon sx={{mt:2, mb:2}}>{item.icon}</ListItemIcon>
            <ListItemText sx={{mt:2, mb:2}} primary={item.text} primaryTypographyProps={{ fontWeight: 'bold' }}/>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}

export default NavDrawer
