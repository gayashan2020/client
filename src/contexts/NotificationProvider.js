// src/contexts/NotificationProvider.js

import React, { createContext, useState, useEffect } from 'react';
import { fetchUnreadMessagesCount } from "@/services/conversations";
import { fetchUsers } from "@/services/users";
import { fetchMenteesByMentor } from "@/services/mentorService";
import { userRoles, userStatus } from "@/assets/constants/authConstants";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [pendingUserApprovals, setPendingUserApprovals] = useState(0);
  const [pendingMenteeApprovals, setPendingMenteeApprovals] = useState(0);

  // Function to update unread messages count
  const updateUnreadMessagesCount = async (userId) => {
    try {
      const count = await fetchUnreadMessagesCount(userId);
      setUnreadMessagesCount(count);
    } catch (error) {
      console.error('Failed to update unread messages count:', error);
    }
  };

  // Function to update pending user approvals count
  const updatePendingUserApprovals = async () => {
    try {
      const users = await fetchUsers();
      const pendingCount = users.filter((user) => {
        const statusKey = user.status ? user.status.toUpperCase() : "";
        const statusInfo = userStatus[statusKey];
        return (
          (!statusInfo || statusInfo.value !== userStatus.ACTIVE.value) &&
          statusKey !== userStatus.DELETED_NO_APPEAL.value
        );
      }).length;
      setPendingUserApprovals(pendingCount);
    } catch (error) {
      console.error('Failed to update pending user approvals count:', error);
    }
  };

  // Function to update pending mentee approvals count
  const updatePendingMenteeApprovals = async (userId) => {
    try {
      const mentees = await fetchMenteesByMentor(userId);
      const pendingCount = mentees.filter((mentee) => mentee.mentorApprovalStatus !== true).length;
      setPendingMenteeApprovals(pendingCount);
    } catch (error) {
      console.error('Failed to update pending mentee approvals count:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadMessagesCount,
        pendingUserApprovals,
        pendingMenteeApprovals,
        setUnreadMessagesCount,
        setPendingUserApprovals,
        setPendingMenteeApprovals,
        updateUnreadMessagesCount,
        updatePendingUserApprovals,
        updatePendingMenteeApprovals,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
