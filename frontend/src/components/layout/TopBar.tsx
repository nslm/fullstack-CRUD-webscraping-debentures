import React from 'react'
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

type Props = { onMenuClick: () => void }

const TopBar: React.FC<Props> = ({ onMenuClick }) => (
  <AppBar position="fixed" sx={{ backgroundColor: '#0723c0ff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <IconButton edge="start" color="inherit" onClick={onMenuClick} aria-label="menu" sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div">Vite MUI Debentures</Typography>
    </Toolbar>
  </AppBar>
)

export default TopBar
