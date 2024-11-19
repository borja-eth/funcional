import { Box } from '@mui/material'
import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box sx={{ 
      flexGrow: 1, 
      bgcolor: 'background.default', 
      minHeight: '100vh', 
      p: 3 
    }}>
      {children}
    </Box>
  )
} 