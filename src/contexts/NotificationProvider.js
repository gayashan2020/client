// src/contexts/NotificationProvider.js

import React, { createContext, useState, useEffect } from 'react';
import { fetchUnreadMessagesCount } from "@/services/conversations"; // Assuming this service exists
import { fetchPendingUserApprovals } from "@/services/users"; // Assuming this service exists
import { fetchPendingMenteeApprovals } from "@/services/mentorService"; // Assuming this service exists

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [pendingUserApprovals, setPendingUserApprovals] = useState(0);
    const [pendingMenteeApprovals, setPendingMenteeApprovals] = useState(0);
  
    const updateUnreadMessagesCount = async (userId) => {
      try {
        // Assuming fetchUnreadMessagesCount is a function that fetches the unread message count
        const count = await fetchUnreadMessagesCount(userId);
        setUnreadMessagesCount(count);
      } catch (error) {
        console.error('Failed to update unread messages count:', error);
      }
    };
  
    return (
      <NotificationContext.Provider
        value={{
          unreadMessagesCount,
          pendingUserApprovals,
          pendingMenteeApprovals,
          setUnreadMessagesCount,
          updateUnreadMessagesCount,
          setPendingUserApprovals,
          setPendingMenteeApprovals,
        }}
      >
        {children}
      </NotificationContext.Provider>
    );
  };