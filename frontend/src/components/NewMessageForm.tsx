import { useState } from "react";
import { TextField, Button } from "@mui/material";

export const NewMessageForm = ({ handleSendMessage }: { handleSendMessage: (message: string) => any }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = () => {
        handleSendMessage(newMessage);
        setNewMessage('');
    };

    return (
        <div id='new-message-form'>
            <TextField
                fullWidth={true}
                value={newMessage}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                    }
                }}
                onChange={(e) => setNewMessage(e.target.value.slice(0, 255))}
                placeholder="Type a message"
            />
            <Button
                onClick={handleSubmit}
                variant='contained'
                disabled={newMessage.length === 0}
                fullWidth={true}
                sx={{
                    textTransform: 'none'  // Prevents text from being capitalized
                }}
            >Send</Button>
        </div>
    )
}