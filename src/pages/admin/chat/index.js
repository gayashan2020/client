import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import { fetchCurrentUser, fetchUsers, fetchUserById } from "@/services/users";
import {
  fetchConversationsWithNames,
  fetchMessages,
  sendMessage,
} from "@/services/conversations";
import Layout from "@/components/Layout";
import { LoadingContext } from "@/contexts/LoadingContext";
import { userRoles } from "@/assets/constants/authConstants";
import { useTheme } from "@mui/material/styles"; // Import useTheme hook
import { set } from "mongoose";

// You need to import or define the 'fetchUsers' service function
// which should return all users that can be messaged

export default function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [responder, setResponder] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { setLoading } = useContext(LoadingContext);

  const theme = useTheme();

  const styles = {
    sidebar: {
      width: "25%",
      height: "100vh",
      overflowY: "auto",
      bgcolor: theme.palette.background.paper,
      padding: theme.spacing(1),
      boxSizing: "border-box", // Make sure padding doesn't affect the width
    },
    chatWindow: {
      flexGrow: 1,
      overflowY: "auto",
      height: `calc(100vh - ${theme.spacing(8)})`, // Adjust for input height and padding
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      boxSizing: "border-box", // Include padding in height calculation
    },
    messageInputContainer: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      padding: theme.spacing(2),
      background: theme.palette.background.default,
      zIndex: 2,
      opacity: selectedConversation ? 1 : 0.5,
      pointerEvents: selectedConversation ? "auto" : "none",
    },
    messageInputBox: {
      flexGrow: 1,
    },
    addConversationButton: {
      position: "fixed",
      right: theme.spacing(2),
      bottom: theme.spacing(10), // Position above the input container
      zIndex: 2,
    },
    conversationList: {
      width: "25%", // increase width for better visibility
      minWidth: "200px", // minimum width for the conversation list
      height: "100vh",
      overflowY: "auto", // enable scrolling for long lists
      bgcolor: theme.palette.background.paper,
    },
  };

  const messageBubble = (isCurrentUser) => ({
    maxWidth: "70%",
    minWidth: "100px",
    padding: theme.spacing(1),
    borderRadius: "10px",
    bgcolor: isCurrentUser
      ? theme.palette.primary.light
      : theme.palette.grey[300],
    color: isCurrentUser
      ? theme.palette.common.white
      : theme.palette.text.primary,
    margin: theme.spacing(1),
    marginLeft: isCurrentUser ? "auto" : theme.spacing(2),
    marginRight: isCurrentUser ? theme.spacing(2) : "auto",
  });

  useEffect(() => {
    // Define a function to fetch all required data
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
        if (user?._id) {
          await updateConversations(user._id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [setLoading]);

  // A function to update the conversations list
  const updateConversations = async (userId) => {
    const conversationsWithNames = await fetchConversationsWithNames(userId);
    setConversations(conversationsWithNames);

    // If a conversation is currently selected, refresh its messages
    if (selectedConversation) {
      const currentConversation = conversationsWithNames.find(
        (c) => c._id === selectedConversation._id
      );
      if (currentConversation) {
        handleSelectConversation(currentConversation);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const conversation = await sendMessage(
      currentUser._id,
      responder,
      newMessage
    );
    if (conversation) {
      if (!selectedConversation) {
        setLoading(true);
        const conversationsWithNames = await fetchConversationsWithNames(currentUser._id);
        setLoading(false);
        const currentConversation = conversationsWithNames.find(
          (c) => c._id === conversation.conversationId
        );
        setSelectedConversation(currentConversation);
        if (currentConversation) {
          handleSelectConversation(currentConversation);
        }
      }
      // Update the conversations list
      setNewMessage(""); // Clear the input after sending
      await updateConversations(currentUser._id);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Fetch messages for the selected conversation
    fetchMessages(conversation._id).then(setMessages);
    // Set responder ID based on the selected conversation
    setResponder(
      conversation.initiator === currentUser._id
        ? conversation.responder
        : conversation.initiator
    );
  };

  const handleCreateConversation = async () => {
    if (!selectedUser) return;

    setResponder(selectedUser);
    setDialogOpen(false);
    setSelectedConversation(null);
  };

  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    setFilteredUsers([]); // Clear the current users

    if (role) {
      setLoading(true);
      fetchUsers("", role)
        .then((fetchedUsers) => {
          setFilteredUsers(fetchedUsers);
        })
        .catch((error) => {
          console.error("Error fetching users by role:", error);
          // Handle the error properly here
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Layout>
      <Box height="100vh">
        <Box display="flex">
          {/* Sidebar with Conversations */}
          <Box className={styles.sidebar}>
            <Typography variant="h6" component="div" sx={{ p: 1 }}>
              Conversations
            </Typography>
            <Divider />
            {/* <Box className={styles.sidebar}> */}
            <List>
              {conversations.map((conversation) => (
                <ListItem
                  button
                  key={conversation._id}
                  selected={selectedConversation?._id === conversation._id} // This line highlights the selected conversation
                  onClick={() => handleSelectConversation(conversation)}
                  sx={{
                    bgcolor: "background.paper",
                    my: 1,
                    borderRadius: "4px",
                    "&.Mui-selected": {
                      // This style will apply when the item is selected
                      backgroundColor: theme.palette.action.selected, // You can choose the color you prefer
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: theme.palette.action.hover, // Also for hover state
                    },
                  }}
                >
                  <ListItemText primary={conversation.partnerName} />
                </ListItem>
              ))}
            </List>
            {/* </Box> */}
          </Box>
          <Box
            flexGrow={1}
            // height="100vh"
            display="flex"
            flexDirection="column"
          >
            {selectedConversation && (
              <>
                <Typography variant="h5" gutterBottom sx={{ p: 1 }}>
                  Conversation with {selectedConversation?.partnerName}
                </Typography>
                <Divider />
                <List className={styles.chatWindow}>
                  {messages.map((message, index) => (
                    <ListItem key={index} disableGutters>
                      <Box
                        sx={messageBubble(message.sender === currentUser._id)}
                      >
                        <Typography variant="body2">
                          {message.message}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        </Box>{" "}
        {/* Chat Section */}
        <Box
          className={styles.messageInputContainer}
          component="form"
          onSubmit={handleSendMessage}
          display={"flex"}
          //   sx={{ pointerEvents: selectedConversation ? 'auto' : 'none' }}
        >
          <TextField
            fullWidth
            id="message-field"
            label="Type a message"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" ? handleSendMessage(e) : null
            }
            className={styles.messageInputBox}
            disabled={!selectedConversation && !selectedUser}
          />
          <Box display={"flex"}>
            <IconButton
              type="submit"
              sx={{ p: "10px" }} // padding around the icon
              aria-label="send"
              disabled={!selectedConversation && !selectedUser}
            >
              <SendIcon />
            </IconButton>
            <IconButton
              className={styles.addConversationButton}
              onClick={() => setDialogOpen(true)}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Select a user to start a conversation</DialogTitle>
        <DialogContent>
          <InputLabel id="select-role-label">Role</InputLabel>
          <Select
            labelId="select-role-label"
            id="select-role"
            value={selectedRole}
            onChange={handleRoleChange}
            fullWidth
          >
            {Object.values(userRoles).map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          <InputLabel id="select-user-label">User</InputLabel>
          <Select
            labelId="select-user-label"
            id="select-user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            fullWidth
          >
            {filteredUsers.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user?.fullName
                  ? user.fullName
                  : user.firstName + " " + user.lastName}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleCreateConversation}>Start Conversation</Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
