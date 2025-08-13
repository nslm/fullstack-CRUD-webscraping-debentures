import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import AutomationsPage from './features/automations/pages/AutomationsPage'
import DebenturesPage from './features/debentures/pages/DebenturesPage'
import AnalyticsPage from './features/analytics/AnalyticsPage'
import TopBar from './components/layout/TopBar'
import NavDrawer from './components/layout/NavDrawer'
import { Box, Toolbar } from '@mui/material'

const drawerWidth = 240

export default function App() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  const handleToggle = () => setOpen((s) => !s)
  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <Box>
      <TopBar onMenuClick={handleToggle} />
      <NavDrawer open={open} onNavigate={handleNavigate} drawerWidth={drawerWidth} />
      <Box component="main" sx={{
          flexGrow: 1,
          p: 2,              
          transition: 'margin 0.3s',
          marginLeft: open ? `${drawerWidth}px` : `${drawerWidth/2}px`,
          marginRight: open ? 0: `${drawerWidth/2}px`
        }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<AutomationsPage />} />
          <Route path="/automacoes" element={<AutomationsPage />} />
          <Route path="/debentures" element={<DebenturesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Box>
    </Box>
  )
}
