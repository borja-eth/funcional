import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'

interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmationDialog({ 
  open, 
  onClose, 
  onConfirm 
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#1E1E1E',
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle>Delete Trade</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this trade? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => {
            onConfirm()
            onClose()
          }} 
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
} 