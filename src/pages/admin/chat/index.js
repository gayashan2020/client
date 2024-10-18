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
import SendIcon from "@mui/icons-material/Send";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { fetchCurrentUser, fetchUsers } from "@/services/users";
import {
  fetchConversationsWithNames,
  fetchMessages,
  sendMessage,
  createConversation, // Import this if you have a service to create conversations
} from "@/services/conversations";
import Layout from "@/components/Layout";
import { LoadingContext } from "@/contexts/LoadingContext";
import { userRoles } from "@/assets/constants/authConstants";
import { useTheme } from "@mui/material/styles";
import { darkTheme } from "@/styles/theme";
import PhotoIcon from "@mui/icons-material/Photo";
import { uploadImage } from "@/services/image";
import DOMPurify from 'dompurify';

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

  const theme = darkTheme;

  const formatRole = (role) => {
    if (!role) return role;
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      backgroundColor: theme.palette.background.default,
    },
    sidebar: {
      width: "25%",
      backgroundColor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`,
      display: "flex",
      flexDirection: "column",
    },
    chatList: {
      overflowY: "auto",
      flexGrow: 1,
      padding: theme.spacing(1),
    },
    chatArea: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.background.default,
    },
    chatHeader: {
      padding: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    chatMessages: {
      flexGrow: 1,
      overflowY: "auto",
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    messageInputContainer: {
      padding: theme.spacing(2),
      display: "flex",
      alignItems: "center",
      backgroundColor: theme.palette.background.paper,
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    messageInput: {
      flexGrow: 1,
      marginRight: theme.spacing(1),
    },
  };

  const messageBubble = (isCurrentUser) => ({
    maxWidth: "70%",
    minWidth: "100px",
    padding: theme.spacing(1),
    borderRadius: "10px",
    bgcolor: isCurrentUser
      ? theme.palette.primary.main
      : theme.palette.grey[800],
    color: theme.palette.common.white,
    margin: `${theme.spacing(1)} ${isCurrentUser ? theme.spacing(2) : "auto"
      } ${theme.spacing(1)} ${isCurrentUser ? "auto" : theme.spacing(2)}`,
    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  });

  useEffect(() => {
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

  const updateConversations = async (userId) => {
    const conversationsWithNames = await fetchConversationsWithNames(userId);
    setConversations(conversationsWithNames);

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
        const conversationsWithNames = await fetchConversationsWithNames(
          currentUser._id
        );
        setLoading(false);
        const currentConversation = conversationsWithNames.find(
          (c) => c._id === conversation.conversationId
        );
        setSelectedConversation(currentConversation);
        if (currentConversation) {
          handleSelectConversation(currentConversation);
        }
      }
      setNewMessage("");
      await updateConversations(currentUser._id);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id).then(setMessages);
    setResponder(
      conversation.initiator === currentUser._id
        ? conversation.responder
        : conversation.initiator
    );
  };

  const handleCreateConversation = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const initialMessage = `Hello, ${currentUser.fullName
        } (Role: ${formatRole(currentUser.role)}) has started this conversation.`;
      // Send the initial message
      const conversation = await sendMessage(
        currentUser._id,
        selectedUser,
        initialMessage
      );
      if (conversation) {
        if (!selectedConversation) {
          setLoading(true);
          const conversationsWithNames = await fetchConversationsWithNames(
            currentUser._id
          );
          setLoading(false);
          const currentConversation = conversationsWithNames.find(
            (c) => c._id === conversation.conversationId
          );
          setSelectedConversation(currentConversation);
          if (currentConversation) {
            handleSelectConversation(currentConversation);
          }
        }
        setNewMessage("");
        await updateConversations(currentUser._id);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const handleRoleChange = async (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    setFilteredUsers([]);

    if (role) {
      setLoading(true);
      try {
        const fetchedUsers = await fetchUsers("", role);

        const existingConversationUserIds = conversations.flatMap(
          (conversation) => [conversation.initiator, conversation.responder]
        );

        const usersWithoutConversation = fetchedUsers.filter(
          (user) => !existingConversationUserIds.includes(user._id)
        );

        setFilteredUsers(usersWithoutConversation);
      } catch (error) {
        console.error("Error fetching users by role:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageUpload = async (event) => {
    console.log('File input changed'); // Debugging line to check if the function is called
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected'); // Debugging line
      return;
    }

    console.log('File selected:', file);

    // Assuming you have an upload service that returns the uploaded image URL
    setLoading(true);
    try {
      const imageUrl = await uploadImage(file); // You need to implement this function

      const conversation = await sendMessage(
        currentUser._id,
        responder,
        null, // No text message
        imageUrl // Send the image URL as part of the message
      );

      if (conversation) {
        await updateConversations(currentUser._id);
        setSelectedConversation(conversation);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box style={styles.container}>
        <Box style={styles.sidebar}>
          <Typography variant="h6" component="div" sx={{ p: 2 }}>
            Chats
          </Typography>
          <Divider />
          <Box style={styles.chatList}>
            {conversations.length > 0 ? (
              <List>
                {conversations.map((conversation) => (
                  <ListItem
                    button
                    key={conversation._id}
                    selected={selectedConversation?._id === conversation._id}
                    onClick={() => handleSelectConversation(conversation)}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.action.selected,
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemText primary={conversation.partnerName} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <List>No chats currently</List>
            )}
          </Box>
        </Box>
        <Box style={styles.chatArea}>
          {selectedConversation ? (
            <>
              <Box style={styles.chatHeader}>
                <Typography variant="h5" gutterBottom>
                  Conversation with {selectedConversation?.partnerName}
                </Typography>
              </Box>
              <Box style={styles.chatMessages}>
                <List>
                  {messages.map((message, index) => (
                    <ListItem key={index} disableGutters>
                      <Box
                        sx={messageBubble(message.sender === currentUser._id)}
                      >
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl}
                            alt="attachment"
                            style={{
                              maxWidth: "250px",
                              borderRadius: "10px",
                              marginBottom: theme.spacing(1),
                            }}
                          />
                        )}
                        {message.message && (
                          <Typography
                            variant="body2"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(message.message),
                            }}
                          />
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          ) : (
            <Box
              flexGrow={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Typography variant="h4" gutterBottom sx={{ p: 1 }}>
                Select a chat to begin messaging
              </Typography>
              <Typography variant="h7" gutterBottom sx={{ p: 1 }}>
                Choose a conversation from the left sidebar.
              </Typography>
            </Box>
          )}
          <Box
            component="form"
            onSubmit={handleSendMessage}
            style={styles.messageInputContainer}
          >
            <IconButton
              onClick={() => setDialogOpen(true)}
              sx={{ marginRight: theme.spacing(1) }}
            >
              <GroupAddIcon />
            </IconButton>
            {selectedConversation && (<input
              accept="image/*"
              style={{ display: "none" }}
              id="file-input"
              type="file"
              onChange={handleImageUpload}
            />)}
            <label htmlFor="file-input">
              <IconButton
                component="span"
                sx={{ marginRight: theme.spacing(1) }}
              >
                <PhotoIcon />
              </IconButton>
            </label>
            <TextField
              fullWidth
              id="message-field"
              placeholder="Type a message"
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!selectedConversation && !selectedUser}
              style={styles.messageInput}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!selectedConversation && !selectedUser}
            >
              <SendIcon />
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
            {Object.entries(userRoles).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {formatRole(value)}
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
