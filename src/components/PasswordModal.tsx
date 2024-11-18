'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

interface PasswordModalProps {
  isAuthenticated: boolean
  onAuthenticate: (authenticated: boolean) => void
}

export default function PasswordModal({ isAuthenticated, onAuthenticate }: PasswordModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Correct password - in production, this should be properly secured
  const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD || 'your-secure-password'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === CORRECT_PASSWORD) {
      onAuthenticate(true)
      // Store authentication in localStorage
      localStorage.setItem('isAuthenticated', 'true')
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <>
      {/* Blur overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1200,
          display: isAuthenticated ? 'none' : 'block',
        }}
      />

      {/* Password Dialog */}
      <Dialog
        open={!isAuthenticated}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: '#1E1E1E',
            borderRadius: 2,
          }
        }}
        sx={{ zIndex: 1300 }}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              p: 2,
            }}>
              <Typography variant="h6" align="center" gutterBottom>
                Enter Password
              </Typography>
              
              <TextField
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                error={error}
                helperText={error ? 'Incorrect password' : ''}
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button 
                type="submit"
                variant="contained"
                fullWidth
              >
                Unlock
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
} 