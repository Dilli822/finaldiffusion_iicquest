import React, { useState, useEffect } from 'react';
import './Notification.css';
import '@fortawesome/fontawesome-free/css/all.min.css';



const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBellIcon, setShowBellIcon] = useState(true);

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();
  }, []);

  useEffect(() => {
    const unreadCount = notifications.filter(notification => !notification.read).length;
    document.title = unreadCount > 0 ? `(${unreadCount}) Notifications` : 'Notifications';
  }, [notifications]);

  const fetchNotifications = () => {
    // Mock API call to fetch notifications
    // In a real-world scenario, replace this with an actual API call
    const mockNotifications = [
      { id: 1, message: "Notification 1", read: false, expanded: false },
      { id: 2, message: "Notification 2", read: false, expanded: false },
      { id: 3, message: "Notification 3", read: false, expanded: false }
    ];

    setNotifications(mockNotifications);
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowBellIcon(!showBellIcon); // Toggle between bell and cross icons
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => {
      return { ...notification, read: true };
    });
    setNotifications(updatedNotifications);
  };

  const handleNotificationClick = (id) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id) {
        return { ...notification, expanded: !notification.expanded, read: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={handleToggleNotifications}>
        {showBellIcon ? (
          <i className="fas fa-bell"></i>
        ) : (
          <i className="fas fa-times"></i>
        )}
        {unreadCount > 0 && (
          <span className="unread-count">{unreadCount}</span>
        )}
      </div>
      {showNotifications && (
        <div className="notifications-dropdown">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.expanded ? 'expanded' : ''}`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              {notification.message.substring(0, 30)}{notification.expanded ? notification.message.substring(30) : '...'}
            </div>
          ))}
          <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;