import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const UsernameModal = ({ open, onStart }: { open: boolean, onStart: (username: string) => any }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('peexel-game-v1-username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem('peexel-game-v1-username', username);
    onStart(username);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
      >
        <DialogContent>
          <DialogContentText>
            To start the game, provide an username
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (username.trim().length >= 3)) {
                handleStart();
              }
            }} 
            label="Username"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleStart}
            disabled={username.trim().length < 3}
          >
            Start
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export default UsernameModal;
