// import React, { useState, useEffect } from 'react';
// import styles from './Notification.module.css';
// import { useThemeTrigger } from '../../ThemeTrigger'; // adjust path

// const Notification = () => {
//   const { darkMode } = useThemeTrigger();
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   useEffect(() => {
//     const mockNotifications = [
//       { id: 1, message: 'Your order has been confirmed and is being prepared', read: false, time: '2 minutes ago' },
//       { id: 2, message: 'New menu items available for this week! Check them out', read: true, time: '1 hour ago' },
//       { id: 3, message: 'Special discount this weekend - 20% off all orders', read: false, time: '3 hours ago' }
//     ];
//     setNotifications(mockNotifications);
//   }, []);

//   const unreadCount = notifications.filter(notif => !notif.read).length;

//   const toggleDropdown = () => setShowDropdown(!showDropdown);
//   const closeDropdown = () => setShowDropdown(false);
//   const markAsRead = (id) => {
//     setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
//   };
//   const markAllAsRead = () => {
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//   };

//   return (
//     <div className={`${styles.notificationContainer} ${darkMode ? styles.dark : styles.light}`}>
//       <button 
//         className={styles.notificationBell}
//         onClick={toggleDropdown}
//         aria-label="Notifications"
//       >
//         <span className={styles.bellIcon}>🔔</span>
//         {unreadCount > 0 && (
//           <span className={styles.notificationBadge}>{unreadCount}</span>
//         )}
//       </button>

//       {showDropdown && (
//         <>
//           <div className={styles.notificationBackdrop} onClick={closeDropdown} />
//           <div className={styles.notificationDropdown}>
//             <div className={styles.dropdownHeader}>
//               <h3>Notifications</h3>
//               {unreadCount > 0 && (
//                 <button 
//                   className={styles.markAllRead}
//                   onClick={markAllAsRead}
//                 >
//                   Mark all read
//                 </button>
//               )}
//               <button 
//                 className={styles.closeButton}
//                 onClick={closeDropdown}
//                 aria-label="Close notifications"
//               >
//                 ✕
//               </button>
//             </div>

//             {notifications.length === 0 ? (
//               <p className={styles.noNotifications}>No notifications yet</p>
//             ) : (
//               <div className={styles.notificationList}>
//                 {notifications.map(notification => (
//                   <div
//                     key={notification.id}
//                     className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
//                     onClick={() => markAsRead(notification.id)}
//                   >
//                     <div className={styles.notificationContent}>
//                       <p className={styles.notificationMessage}>
//                         {notification.message}
//                       </p>
//                       <span className={styles.notificationTime}>
//                         {notification.time}
//                       </span>
//                       {!notification.read && (
//                         <div className={styles.unreadIndicator}>
//                           <span className={styles.unreadDot}></span>
//                           <span className={styles.unreadText}>Unread</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Notification;













// -----------------------------------------notification using Api----------------------------------------------------




// Updated Notification.js component using the API


// import React, { useState, useEffect } from 'react';
// import styles from './Notification.module.css';
// import { useThemeTrigger } from '../../ThemeTrigger'; // adjust path
// import { 
//   getUserNotifications, 
//   markAsRead, 
//   markAllAsRead,
//   getUnreadCount 
// } from '../../Api/NotificationApi'; // adjust path

// const Notification = ({ userId }) => {
//   const { darkMode } = useThemeTrigger();
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // Fetch notifications and unread count
//   const fetchNotifications = async () => {
//     if (!userId) return;
    
//     try {
//       setLoading(true);
//       const [notificationsResponse, unreadCountResponse] = await Promise.all([
//         getUserNotifications(userId, 1, 10), // Get first 10 notifications
//         getUnreadCount(userId)
//       ]);
      
//       setNotifications(notificationsResponse.data || []);
//       setUnreadCount(unreadCountResponse);
//     } catch (error) {
//       console.error('Failed to fetch notifications:', error);
//       // Fallback to empty state
//       setNotifications([]);
//       setUnreadCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchNotifications();
//     }
//   }, [userId]);

//   const toggleDropdown = async () => {
//     if (!showDropdown && userId) {
//       await fetchNotifications();
//     }
//     setShowDropdown(!showDropdown);
//   };

//   const closeDropdown = () => setShowDropdown(false);

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       await markAsRead(notificationId);
//       setNotifications(prev => 
//         prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error('Failed to mark notification as read:', error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await markAllAsRead(userId);
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//       setUnreadCount(0);
//     } catch (error) {
//       console.error('Failed to mark all notifications as read:', error);
//     }
//   };

//   const formatTime = (createdAt) => {
//     if (!createdAt) return 'Recently';
    
//     const now = new Date();
//     const created = new Date(createdAt);
//     const diffInMinutes = Math.floor((now - created) / (1000 * 60));
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     const diffInDays = Math.floor(diffInHours / 24);

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
//     if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
//     if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
//     return created.toLocaleDateString();
//   };

//   const getPriorityIcon = (priority) => {
//     switch (priority) {
//       case 'high': return '🔴';
//       case 'medium': return '🟡';
//       case 'low': return '🟢';
//       default: return '⚪';
//     }
//   };

//   return (
//     <div className={`${styles.notificationContainer} ${darkMode ? styles.dark : styles.light}`}>
//       <button 
//         className={styles.notificationBell}
//         onClick={toggleDropdown}
//         aria-label="Notifications"
//         disabled={!userId}
//       >
//         <span className={styles.bellIcon}>🔔</span>
//         {unreadCount > 0 && (
//           <span className={styles.notificationBadge}>
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {showDropdown && (
//         <>
//           <div className={styles.notificationBackdrop} onClick={closeDropdown} />
//           <div className={styles.notificationDropdown}>
//             <div className={styles.dropdownHeader}>
//               <h3>Notifications</h3>
//               <div className={styles.headerActions}>
//                 {unreadCount > 0 && (
//                   <button 
//                     className={styles.markAllRead}
//                     onClick={handleMarkAllAsRead}
//                     disabled={loading}
//                   >
//                     Mark all read
//                   </button>
//                 )}
//                 <button 
//                   className={styles.closeButton}
//                   onClick={closeDropdown}
//                   aria-label="Close notifications"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className={styles.loadingState}>
//                 <p>Loading notifications...</p>
//               </div>
//             ) : !userId ? (
//               <div className={styles.errorState}>
//                 <p>Please log in to view notifications</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <p className={styles.noNotifications}>No notifications yet</p>
//             ) : (
//               <div className={styles.notificationList}>
//                 {notifications.map(notification => (
//                   <div
//                     key={notification._id}
//                     className={`${styles.notificationItem} ${
//                       !notification.read ? styles.unread : ''
//                     } ${styles[`priority-${notification.priority}`]}`}
//                     onClick={() => !notification.read && handleMarkAsRead(notification._id)}
//                   >
//                     <div className={styles.notificationContent}>
//                       <div className={styles.notificationHeader}>
//                         <span className={styles.priorityIcon}>
//                           {getPriorityIcon(notification.priority)}
//                         </span>
//                         <span className={styles.notificationType}>
//                           {notification.type}
//                         </span>
//                       </div>
//                       <p className={styles.notificationMessage}>
//                         {notification.message}
//                       </p>
//                       <div className={styles.notificationFooter}>
//                         <span className={styles.notificationTime}>
//                           {formatTime(notification.createdAt)}
//                         </span>
//                         {!notification.read && (
//                           <div className={styles.unreadIndicator}>
//                             <span className={styles.unreadDot}></span>
//                             <span className={styles.unreadText}>Unread</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Notification;













// -------------------------------------notification that responses to sample notification button----------------------------------------



// import React, { useState, useEffect } from 'react';
// import styles from './Notification.module.css';
// import { useThemeTrigger } from '../../ThemeTrigger'; // adjust path
// import { 
//   getUserNotifications, 
//   markAsRead, 
//   markAllAsRead,
//   getUnreadCount 
// } from '../../Api/NotificationApi'; // adjust path
// import { useSocket } from '../../SocketContext';
// import { useAuth } from '../../AuthContext';

// const Notification = () => {
//   const { darkMode } = useThemeTrigger();
//   const { user } = useAuth();
//   const socket = useSocket();

//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const userId = user?._id;

//   // Fetch notifications & unread count
//   const fetchNotifications = async () => {
//     if (!userId) return;
//     try {
//       setLoading(true);
//       const [notificationsResponse, unreadCountResponse] = await Promise.all([
//         getUserNotifications(userId, 1, 10),
//         getUnreadCount(userId)
//       ]);

//       setNotifications(notificationsResponse.data || []);
//       setUnreadCount(unreadCountResponse || 0);
//     } catch (error) {
//       console.error('Failed to fetch notifications:', error);
//       setNotifications([]);
//       setUnreadCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     if (userId) fetchNotifications();
//   }, [userId]);

//   // Listen to Socket.io events
//   useEffect(() => {
//     if (!socket || !userId) return;

//     const handleNewNotification = (data) => {
//       // Only add notification if it belongs to the current user
//       if (data.notification.user === userId || data.notification.user._id === userId) {
//         setNotifications(prev => [data.notification, ...prev]);
//         setUnreadCount(prev => prev + 1);
//       }
//     };

//     socket.on('notification_created', handleNewNotification);

//     return () => {
//       socket.off('notification_created', handleNewNotification);
//     };
//   }, [socket, userId]);

//   const toggleDropdown = async () => {
//     if (!showDropdown && userId) {
//       await fetchNotifications();
//     }
//     setShowDropdown(!showDropdown);
//   };

//   const closeDropdown = () => setShowDropdown(false);

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       await markAsRead(notificationId);
//       setNotifications(prev =>
//         prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error('Failed to mark notification as read:', error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await markAllAsRead(userId);
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//       setUnreadCount(0);
//     } catch (error) {
//       console.error('Failed to mark all notifications as read:', error);
//     }
//   };

//   const formatTime = (createdAt) => {
//     if (!createdAt) return 'Recently';
//     const now = new Date();
//     const created = new Date(createdAt);
//     const diffInMinutes = Math.floor((now - created) / (1000 * 60));
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     const diffInDays = Math.floor(diffInHours / 24);

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
//     if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
//     if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
//     return created.toLocaleDateString();
//   };

//   const getPriorityIcon = (priority) => {
//     switch (priority) {
//       case 'high': return '🔴';
//       case 'medium': return '🟡';
//       case 'low': return '🟢';
//       default: return '⚪';
//     }
//   };

//   return (
//     <div className={`${styles.notificationContainer} ${darkMode ? styles.dark : styles.light}`}>
//       <button
//         className={styles.notificationBell}
//         onClick={toggleDropdown}
//         aria-label="Notifications"
//         disabled={!userId}
//       >
//         <span className={styles.bellIcon}>🔔</span>
//         {unreadCount > 0 && (
//           <span className={styles.notificationBadge}>
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {showDropdown && (
//         <>
//           <div className={styles.notificationBackdrop} onClick={closeDropdown} />
//           <div className={styles.notificationDropdown}>
//             <div className={styles.dropdownHeader}>
//               <h3>Notifications</h3>
//               <div className={styles.headerActions}>
//                 {unreadCount > 0 && (
//                   <button
//                     className={styles.markAllRead}
//                     onClick={handleMarkAllAsRead}
//                     disabled={loading}
//                   >
//                     Mark all read
//                   </button>
//                 )}
//                 <button
//                   className={styles.closeButton}
//                   onClick={closeDropdown}
//                   aria-label="Close notifications"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className={styles.loadingState}>
//                 <p>Loading notifications...</p>
//               </div>
//             ) : !userId ? (
//               <div className={styles.errorState}>
//                 <p>Please log in to view notifications</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <p className={styles.noNotifications}>No notifications yet</p>
//             ) : (
//               <div className={styles.notificationList}>
//                 {notifications.map(notification => (
//                   <div
//                     key={notification._id}
//                     className={`${styles.notificationItem} ${
//                       !notification.read ? styles.unread : ''
//                     } ${styles[`priority-${notification.priority}`]}`}
//                     onClick={() => !notification.read && handleMarkAsRead(notification._id)}
//                   >
//                     <div className={styles.notificationContent}>
//                       <div className={styles.notificationHeader}>
//                         <span className={styles.priorityIcon}>
//                           {getPriorityIcon(notification.priority)}
//                         </span>
//                         <span className={styles.notificationType}>
//                           {notification.type}
//                         </span>
//                       </div>
//                       <p className={styles.notificationMessage}>
//                         {notification.message}
//                       </p>
//                       <div className={styles.notificationFooter}>
//                         <span className={styles.notificationTime}>
//                           {formatTime(notification.createdAt)}
//                         </span>
//                         {!notification.read && (
//                           <div className={styles.unreadIndicator}>
//                             <span className={styles.unreadDot}></span>
//                             <span className={styles.unreadText}>Unread</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Notification;

// ----------------------------------------------restructured notification Element------------------------------


// result of the code is still the same as before ...
// import React, { useState, useEffect, useCallback } from 'react';
// import styles from './Notification.module.css';
// import { useThemeTrigger } from '../../ThemeTrigger';
// import { 
//   getUserNotifications, 
//   markAsRead, 
//   markAllAsRead
// } from '../../Api/NotificationApi';
// import { useSocket } from '../../SocketContext';
// import { useAuth } from '../../AuthContext';

// const Notification = () => {
//   const { darkMode } = useThemeTrigger();
//   const { user } = useAuth();
//   const socket = useSocket();

//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const userId = user?._id;

//   // Fetch notifications - optimized single API call
//   const fetchNotifications = useCallback(async () => {
//     if (!userId) return;
    
//     try {
//       setLoading(true);
//       console.log('🔄 Fetching notifications for user:', userId);
      
//       const response = await getUserNotifications(userId, 1, 10);
//       console.log('📨 API Response:', response);
      
//       if (response.success) {
//         const notificationsData = response.data || [];
//         const unreadCountData = response.pagination?.unreadCount || 0;
        
//         setNotifications(notificationsData);
//         setUnreadCount(unreadCountData);
        
//         console.log(`✅ Loaded ${notificationsData.length} notifications, ${unreadCountData} unread`);
//       } else {
//         setNotifications([]);
//         setUnreadCount(0);
//         console.error('❌ API returned success: false');
//       }
//     } catch (error) {
//       console.error('🚨 Failed to fetch notifications:', error);
//       setNotifications([]);
//       setUnreadCount(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   // Initial fetch
//   useEffect(() => {
//     if (userId) {
//       fetchNotifications();
//     }
//   }, [userId, fetchNotifications]);

//   // Enhanced Socket.io event listener
//   useEffect(() => {
//     if (!socket || !userId) {
//       console.log('🔌 Socket not available or no user ID');
//       return;
//     }

//     console.log('🎯 Setting up socket listeners for user:', userId);

//     const handleNewNotification = (data) => {
//       console.log('🔔 Socket notification received:', data);
      
//       // Handle different data structures from socket
//       const notification = data.notification || data;
      
//       if (!notification) {
//         console.error('📛 No notification data in socket event');
//         return;
//       }

//       // Flexible user ID matching
//       const notificationUserId = notification.user?._id || notification.user;
//       console.log('👤 Notification user ID:', notificationUserId, 'Current user:', userId);
      
//       if (notificationUserId === userId) {
//         console.log('✅ Adding real-time notification');
        
//         setNotifications(prev => {
//           const newNotifications = [notification, ...prev];
//           console.log('📋 Notifications count:', newNotifications.length);
//           return newNotifications;
//         });
        
//         setUnreadCount(prev => {
//           const newCount = prev + 1;
//           console.log('🔢 Unread count updated to:', newCount);
//           return newCount;
//         });
//       } else {
//         console.log('❌ Notification not for current user');
//       }
//     };

//     // Listen for read status updates
//     const handleNotificationsRead = (data) => {
//       console.log('📖 Notifications read event:', data);
//       if (data.userId === userId) {
//         // Refresh to get updated read status
//         fetchNotifications();
//       }
//     };

//     // Socket event listeners
//     socket.on('notification_created', handleNewNotification);
//     socket.on('notification_marked_read', handleNotificationsRead);
//     socket.on('all_notifications_marked_read', handleNotificationsRead);

//     // Socket connection debugging
//     socket.on('connect', () => console.log('✅ Socket connected'));
//     socket.on('disconnect', () => console.log('❌ Socket disconnected'));

//     return () => {
//       console.log('🧹 Cleaning up socket listeners');
//       socket.off('notification_created', handleNewNotification);
//       socket.off('notification_marked_read', handleNotificationsRead);
//       socket.off('all_notifications_marked_read', handleNotificationsRead);
//     };
//   }, [socket, userId, fetchNotifications]);

//   const toggleDropdown = async () => {
//     if (!showDropdown && userId) {
//       await fetchNotifications();
//     }
//     setShowDropdown(!showDropdown);
//   };

//   const closeDropdown = () => setShowDropdown(false);

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       console.log('📝 Marking notification as read:', notificationId);
//       await markAsRead(notificationId);
      
//       setNotifications(prev =>
//         prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
      
//       console.log('✅ Notification marked as read');
//     } catch (error) {
//       console.error('🚨 Failed to mark notification as read:', error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       console.log('📝 Marking all notifications as read');
//       await markAllAsRead(userId);
      
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//       setUnreadCount(0);
      
//       console.log('✅ All notifications marked as read');
//     } catch (error) {
//       console.error('🚨 Failed to mark all notifications as read:', error);
//     }
//   };

//   const formatTime = (createdAt) => {
//     if (!createdAt) return 'Recently';
//     const now = new Date();
//     const created = new Date(createdAt);
//     const diffInMinutes = Math.floor((now - created) / (1000 * 60));
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     const diffInDays = Math.floor(diffInHours / 24);

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
//     if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
//     if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
//     return created.toLocaleDateString();
//   };

//   const getPriorityIcon = (priority) => {
//     switch (priority) {
//       case 'high': return '🔴';
//       case 'medium': return '🟡';
//       case 'low': return '🟢';
//       default: return '⚪';
//     }
//   };

//   return (
//     <div className={`${styles.notificationContainer} ${darkMode ? styles.dark : styles.light}`}>
//       <button
//         className={styles.notificationBell}
//         onClick={toggleDropdown}
//         aria-label="Notifications"
//         disabled={!userId}
//       >
//         <span className={styles.bellIcon}>🔔</span>
//         {unreadCount > 0 && (
//           <span className={styles.notificationBadge}>
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {showDropdown && (
//         <>
//           <div className={styles.notificationBackdrop} onClick={closeDropdown} />
//           <div className={styles.notificationDropdown}>
//             <div className={styles.dropdownHeader}>
//               <h3>Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
//               <div className={styles.headerActions}>
//                 {unreadCount > 0 && (
//                   <button
//                     className={styles.markAllRead}
//                     onClick={handleMarkAllAsRead}
//                     disabled={loading}
//                   >
//                     Mark all read
//                   </button>
//                 )}
//                 <button
//                   className={styles.closeButton}
//                   onClick={closeDropdown}
//                   aria-label="Close notifications"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className={styles.loadingState}>
//                 <p>Loading notifications...</p>
//               </div>
//             ) : !userId ? (
//               <div className={styles.errorState}>
//                 <p>Please log in to view notifications</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <p className={styles.noNotifications}>No notifications yet</p>
//             ) : (
//               <div className={styles.notificationList}>
//                 {notifications.map(notification => (
//                   <div
//                     key={`${notification._id}-${notification.read}`}
//                     className={`${styles.notificationItem} ${
//                       !notification.read ? styles.unread : ''
//                     } ${styles[`priority-${notification.priority}`]}`}
//                     onClick={() => !notification.read && handleMarkAsRead(notification._id)}
//                   >
//                     <div className={styles.notificationContent}>
//                       <div className={styles.notificationHeader}>
//                         <span className={styles.priorityIcon}>
//                           {getPriorityIcon(notification.priority)}
//                         </span>
//                         <span className={styles.notificationType}>
//                           {notification.type}
//                         </span>
//                       </div>
//                       <p className={styles.notificationMessage}>
//                         {notification.message}
//                       </p>
//                       <div className={styles.notificationFooter}>
//                         <span className={styles.notificationTime}>
//                           {formatTime(notification.createdAt)}
//                         </span>
//                         {!notification.read && (
//                           <div className={styles.unreadIndicator}>
//                             <span className={styles.unreadDot}></span>
//                             <span className={styles.unreadText}>Unread</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Notification;

// --------------------updated  Notification.jsx with Automatic Unread Count Updates-------------------------------------------


// import React, { useState, useEffect, useCallback } from 'react';
// import styles from './Notification.module.css';
// import { useThemeTrigger } from '../../ThemeTrigger';
// import { 
//   getUserNotifications, 
//   markAsRead, 
//   markAllAsRead
// } from '../../Api/NotificationApi';
// import { useSocket } from '../../SocketContext';
// import { useAuth } from '../../AuthContext';

// const Notification = () => {
//   const { darkMode } = useThemeTrigger();
//   const { user } = useAuth();
//   const socket = useSocket();

//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const userId = user?._id;

//   // Fetch notifications - optimized single API call
//   const fetchNotifications = useCallback(async () => {
//     if (!userId) return;
    
//     try {
//       setLoading(true);
//       console.log('🔄 Fetching notifications for user:', userId);
      
//       const response = await getUserNotifications(userId, 1, 10);
//       console.log('📨 API Response:', response);
      
//       if (response.success) {
//         const notificationsData = response.data || [];
//         const unreadCountData = response.pagination?.unreadCount || 0;
        
//         setNotifications(notificationsData);
//         setUnreadCount(unreadCountData);
        
//         console.log(`✅ Loaded ${notificationsData.length} notifications, ${unreadCountData} unread`);
//       } else {
//         setNotifications([]);
//         setUnreadCount(0);
//         console.error('❌ API returned success: false');
//       }
//     } catch (error) {
//       console.error('🚨 Failed to fetch notifications:', error);
//       setNotifications([]);
//       setUnreadCount(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   // Initial fetch
//   useEffect(() => {
//     if (userId) {
//       fetchNotifications();
//     }
//   }, [userId, fetchNotifications]);

//   // Enhanced Socket.io event listener with automatic unread count updates
//   useEffect(() => {
//     if (!socket || !userId) {
//       console.log('🔌 Socket not available or no user ID');
//       return;
//     }

//     console.log('🎯 Setting up socket listeners for user:', userId);

//     const handleNewNotification = (data) => {
//       console.log('🔔 Socket notification received:', data);
      
//       // Handle different data structures from socket
//       const notification = data.notification || data;
      
//       if (!notification) {
//         console.error('📛 No notification data in socket event');
//         return;
//       }

//       // Flexible user ID matching
//       const notificationUserId = notification.user?._id || notification.user;
//       console.log('👤 Notification user ID:', notificationUserId, 'Current user:', userId);
      
//       if (notificationUserId === userId) {
//         console.log('✅ Adding real-time notification');
        
//         // Update notifications list
//         setNotifications(prev => {
//           const newNotifications = [notification, ...prev];
//           console.log('📋 Notifications count:', newNotifications.length);
//           return newNotifications;
//         });
        
//         // CRITICAL FIX: Update unread count immediately
//         setUnreadCount(prev => {
//           const newCount = prev + 1;
//           console.log('🔢 Unread count updated to:', newCount);
          
//           // Force UI update by returning new value
//           return newCount;
//         });

//         // Optional: Also trigger a subtle visual feedback
//         triggerBellAnimation();
//       } else {
//         console.log('❌ Notification not for current user');
//       }
//     };

//     // Listen for read status updates
//     const handleNotificationsRead = (data) => {
//       console.log('📖 Notifications read event:', data);
//       if (data.userId === userId) {
//         // Refresh to get updated read status and counts
//         fetchNotifications();
//       }
//     };

//     // Listen for notification deletions
//     const handleNotificationDeleted = (data) => {
//       console.log('🗑️ Notification deleted event:', data);
//       if (data.userId === userId) {
//         // Refresh to get updated counts
//         fetchNotifications();
//       }
//     };

//     // Socket event listeners
//     socket.on('notification_created', handleNewNotification);
//     socket.on('notification_marked_read', handleNotificationsRead);
//     socket.on('all_notifications_marked_read', handleNotificationsRead);
//     socket.on('notification_deleted', handleNotificationDeleted);

//     // Socket connection debugging
//     socket.on('connect', () => console.log('✅ Socket connected'));
//     socket.on('disconnect', () => console.log('❌ Socket disconnected'));

//     return () => {
//       console.log('🧹 Cleaning up socket listeners');
//       socket.off('notification_created', handleNewNotification);
//       socket.off('notification_marked_read', handleNotificationsRead);
//       socket.off('all_notifications_marked_read', handleNotificationsRead);
//       socket.off('notification_deleted', handleNotificationDeleted);
//     };
//   }, [socket, userId, fetchNotifications]);

//   // Add subtle bell animation for new notifications
//   const triggerBellAnimation = () => {
//     const bell = document.querySelector(`.${styles.notificationBell}`);
//     if (bell) {
//       bell.style.transform = 'scale(1.1)';
//       setTimeout(() => {
//         bell.style.transform = 'scale(1)';
//       }, 300);
//     }
//   };

//   const toggleDropdown = async () => {
//     if (!showDropdown && userId) {
//       await fetchNotifications();
//     }
//     setShowDropdown(!showDropdown);
//   };

//   const closeDropdown = () => setShowDropdown(false);

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       console.log('📝 Marking notification as read:', notificationId);
//       await markAsRead(notificationId);
      
//       setNotifications(prev =>
//         prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
      
//       console.log('✅ Notification marked as read');
//     } catch (error) {
//       console.error('🚨 Failed to mark notification as read:', error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       console.log('📝 Marking all notifications as read');
//       await markAllAsRead(userId);
      
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//       setUnreadCount(0);
      
//       console.log('✅ All notifications marked as read');
//     } catch (error) {
//       console.error('🚨 Failed to mark all notifications as read:', error);
//     }
//   };

//   const formatTime = (createdAt) => {
//     if (!createdAt) return 'Recently';
//     const now = new Date();
//     const created = new Date(createdAt);
//     const diffInMinutes = Math.floor((now - created) / (1000 * 60));
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     const diffInDays = Math.floor(diffInHours / 24);

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
//     if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
//     if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
//     return created.toLocaleDateString();
//   };

//   const getPriorityIcon = (priority) => {
//     switch (priority) {
//       case 'high': return '🔴';
//       case 'medium': return '🟡';
//       case 'low': return '🟢';
//       default: return '⚪';
//     }
//   };

//   return (
//     <div className={`${styles.notificationContainer} ${darkMode ? styles.dark : styles.light}`}>
//       <button
//         className={styles.notificationBell}
//         onClick={toggleDropdown}
//         aria-label="Notifications"
//         disabled={!userId}
//       >
//         <span className={styles.bellIcon}>🔔</span>
//         {unreadCount > 0 && (
//           <span className={styles.notificationBadge}>
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {showDropdown && (
//         <>
//           <div className={styles.notificationBackdrop} onClick={closeDropdown} />
//           <div className={styles.notificationDropdown}>
//             <div className={styles.dropdownHeader}>
//               <h3>Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
//               <div className={styles.headerActions}>
//                 {unreadCount > 0 && (
//                   <button
//                     className={styles.markAllRead}
//                     onClick={handleMarkAllAsRead}
//                     disabled={loading}
//                   >
//                     Mark all read
//                   </button>
//                 )}
//                 <button
//                   className={styles.closeButton}
//                   onClick={closeDropdown}
//                   aria-label="Close notifications"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className={styles.loadingState}>
//                 <p>Loading notifications...</p>
//               </div>
//             ) : !userId ? (
//               <div className={styles.errorState}>
//                 <p>Please log in to view notifications</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <p className={styles.noNotifications}>No notifications yet</p>
//             ) : (
//               <div className={styles.notificationList}>
//                 {notifications.map(notification => (
//                   <div
//                     key={`${notification._id}-${notification.read}`}
//                     className={`${styles.notificationItem} ${
//                       !notification.read ? styles.unread : ''
//                     } ${styles[`priority-${notification.priority}`]}`}
//                     onClick={() => !notification.read && handleMarkAsRead(notification._id)}
//                   >
//                     <div className={styles.notificationContent}>
//                       <div className={styles.notificationHeader}>
//                         <span className={styles.priorityIcon}>
//                           {getPriorityIcon(notification.priority)}
//                         </span>
//                         <span className={styles.notificationType}>
//                           {notification.type}
//                         </span>
//                       </div>
//                       <p className={styles.notificationMessage}>
//                         {notification.message}
//                       </p>
//                       <div className={styles.notificationFooter}>
//                         <span className={styles.notificationTime}>
//                           {formatTime(notification.createdAt)}
//                         </span>
//                         {!notification.read && (
//                           <div className={styles.unreadIndicator}>
//                             <span className={styles.unreadDot}></span>
//                             <span className={styles.unreadText}>Unread</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Notification;

// ----------------------------------------------------------------------------------------------------------

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Notification.module.css';
import { useThemeTrigger } from '../../ThemeTrigger';
import { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead,
  getUnreadCount
} from '../../API/NotificationApi';
import { useSocket } from '../../SocketContext';
import { useAuth } from '../../AuthContext';

const Notification = () => {
  const { darkMode } = useThemeTrigger();
  const { user } = useAuth();
  const socket = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = user?._id;

  // Fetch notifications - optimized single API call
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      console.log('🔄 Fetching notifications for user:', userId);
      
      const response = await getUserNotifications(userId, 1, 10);
      console.log('📨 API Response:', response);
      
      if (response.success) {
        const notificationsData = response.data || [];
        const unreadCountData = response.pagination?.unreadCount || 0;
        
        setNotifications(notificationsData);
        setUnreadCount(unreadCountData);
        
        console.log(`✅ Loaded ${notificationsData.length} notifications, ${unreadCountData} unread`);
      } else {
        setNotifications([]);
        setUnreadCount(0);
        console.error('❌ API returned success: false');
      }
    } catch (error) {
      console.error('🚨 Failed to fetch notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch only unread count (lightweight)
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      // Use the new dedicated unread count endpoint
      const response = await getUnreadCount(userId);
      setUnreadCount(response);
      console.log('🔢 Unread count fetched:', response);
    } catch (error) {
      console.error('🚨 Failed to fetch unread count:', error);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  // Enhanced Socket.io event listener with real-time unread count updates
  useEffect(() => {
    if (!socket || !userId) {
      console.log('🔌 Socket not available or no user ID');
      return;
    }

    console.log('🎯 Setting up socket listeners for user:', userId);

    // Join user room for real-time notifications
    socket.emit('join-user-room', userId);

    // Handle new notification with real-time unread count
    const handleNewNotification = (data) => {
      console.log('🔔 Socket notification received:', data);
      
      const notification = data.notification || data;
      
      if (!notification) {
        console.error('📛 No notification data in socket event');
        return;
      }

      const notificationUserId = notification.user?._id || notification.user;
      console.log('👤 Notification user ID:', notificationUserId, 'Current user:', userId);
      
      if (notificationUserId === userId) {
        console.log('✅ Adding real-time notification');
        
        // Update notifications list
        setNotifications(prev => [notification, ...prev]);
        
        // Update unread count in real-time
        setUnreadCount(prev => {
          const newCount = prev + 1;
          console.log('🔢 Unread count updated to:', newCount);
          return newCount;
        });

        triggerBellAnimation();
      }
    };

    // ✅ NEW: Handle real-time unread count updates
    const handleUnreadCountUpdated = (data) => {
      console.log('📊 Real-time unread count update:', data);
      setUnreadCount(data.unreadCount);
      
      // Optional: Refresh notifications if needed
      if (data.markedAllRead || data.bulkUpdate) {
        fetchNotifications();
      }
    };

    // ✅ NEW: Handle specific unread count events
    const handleUnreadCount = (data) => {
      console.log('🎯 Unread count received:', data);
      setUnreadCount(data.unreadCount);
    };

    // Listen for read status updates
    const handleNotificationsRead = (data) => {
      console.log('📖 Notifications read event:', data);
      if (data.userId === userId) {
        // Refresh to get updated read status and counts
        fetchNotifications();
      }
    };

    // Listen for notification deletions
    const handleNotificationDeleted = (data) => {
      console.log('🗑️ Notification deleted event:', data);
      if (data.userId === userId) {
        // Refresh to get updated counts
        fetchNotifications();
      }
    };

    // Socket event listeners
    socket.on('notification_created', handleNewNotification);
    socket.on('notification_marked_read', handleNotificationsRead);
    socket.on('all_notifications_marked_read', handleNotificationsRead);
    socket.on('notification_deleted', handleNotificationDeleted);
    
    // ✅ NEW: Real-time unread count listeners
    socket.on('unread-count-updated', handleUnreadCountUpdated);
    socket.on('unread-count', handleUnreadCount);

    // Socket connection debugging
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      // Re-join user room on reconnect
      socket.emit('join-user-room', userId);
    });
    
    socket.on('disconnect', () => console.log('❌ Socket disconnected'));

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('notification_created', handleNewNotification);
      socket.off('notification_marked_read', handleNotificationsRead);
      socket.off('all_notifications_marked_read', handleNotificationsRead);
      socket.off('notification_deleted', handleNotificationDeleted);
      socket.off('unread-count-updated', handleUnreadCountUpdated);
      socket.off('unread-count', handleUnreadCount);
      
      // Leave user room
      socket.emit('leave-user-room', userId);
    };
  }, [socket, userId, fetchNotifications]);

  // Add subtle bell animation for new notifications
  const triggerBellAnimation = () => {
    const bell = document.querySelector(`.${styles.notificationBell}`);
    if (bell) {
      bell.style.transform = 'scale(1.1)';
      setTimeout(() => {
        bell.style.transform = 'scale(1)';
      }, 300);
    }
  };

  const toggleDropdown = async () => {
    if (!showDropdown && userId) {
      await fetchNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => setShowDropdown(false);

  const handleMarkAsRead = async (notificationId) => {
    try {
      console.log('📝 Marking notification as read:', notificationId);
      await markAsRead(notificationId);
      
      // Optimistic update
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      console.log('✅ Notification marked as read');
      
      // ✅ NEW: Request real-time unread count update via socket
      if (socket) {
        socket.emit('get-unread-count', userId);
      }
    } catch (error) {
      console.error('🚨 Failed to mark notification as read:', error);
      // Revert optimistic update on error
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      console.log('📝 Marking all notifications as read');
      await markAllAsRead(userId);
      
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      console.log('✅ All notifications marked as read');
      
      // ✅ NEW: Request real-time unread count update via socket
      if (socket) {
        socket.emit('get-unread-count', userId);
      }
    } catch (error) {
      console.error('🚨 Failed to mark all notifications as read:', error);
      // Revert optimistic update on error
      fetchNotifications();
    }
  };

  // ✅ NEW: Manual refresh function
  const handleRefreshNotifications = async () => {
    await fetchNotifications();
    if (socket) {
      socket.emit('get-unread-count', userId);
    }
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return 'Recently';
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return created.toLocaleDateString();
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className={`${styles.notificationContainer} ${darkMode ? styles.dark : styles.light}`}>
      <button
        className={styles.notificationBell}
        onClick={toggleDropdown}
        aria-label="Notifications"
        disabled={!userId}
      >
        <span className={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span className={styles.notificationBadge}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className={styles.notificationBackdrop} onClick={closeDropdown} />
          <div className={styles.notificationDropdown}>
            <div className={styles.dropdownHeader}>
              <h3>
                Notifications 
                {unreadCount > 0 && ` (${unreadCount} unread)`}
                {unreadCount === 0 && ' (All read)'}
              </h3>
              <div className={styles.headerActions}>
                <button
                  className={styles.refreshButton}
                  onClick={handleRefreshNotifications}
                  disabled={loading}
                  title="Refresh notifications"
                >
                  🔄
                </button>
                {unreadCount > 0 && (
                  <button
                    className={styles.markAllRead}
                    onClick={handleMarkAllAsRead}
                    disabled={loading}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  className={styles.closeButton}
                  onClick={closeDropdown}
                  aria-label="Close notifications"
                >
                  ✕
                </button>
              </div>
            </div>

            {loading ? (
              <div className={styles.loadingState}>
                <p>Loading notifications...</p>
              </div>
            ) : !userId ? (
              <div className={styles.errorState}>
                <p>Please log in to view notifications</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.noNotifications}>
                <p>No notifications yet</p>
                <button 
                  onClick={handleRefreshNotifications}
                  className={styles.retryButton}
                >
                  Check for new notifications
                </button>
              </div>
            ) : (
              <div className={styles.notificationList}>
                {notifications.map(notification => (
                  <div
                    key={`${notification._id}-${notification.read}`}
                    className={`${styles.notificationItem} ${
                      !notification.read ? styles.unread : ''
                    } ${styles[`priority-${notification.priority}`]}`}
                    onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                  >
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationHeader}>
                        <span className={styles.priorityIcon}>
                          {getPriorityIcon(notification.priority)}
                        </span>
                        <span className={styles.notificationType}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <span className={styles.realTimeIndicator} title="Real-time update">
                            ⚡
                          </span>
                        )}
                      </div>
                      <p className={styles.notificationMessage}>
                        {notification.message}
                      </p>
                      <div className={styles.notificationFooter}>
                        <span className={styles.notificationTime}>
                          {formatTime(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <div className={styles.unreadIndicator}>
                            <span className={styles.unreadDot}></span>
                            <span className={styles.unreadText}>Unread</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* ✅ NEW: Real-time status indicator */}
            <div className={styles.realTimeStatus}>
              <span className={socket ? styles.connected : styles.disconnected}>
                {socket ? '🔴 Live' : '⚫ Offline'}
              </span>
              <span className={styles.unreadCountDisplay}>
                Real-time unread count: {unreadCount}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notification;

// -----------------------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import styles from './Notification.module.css';
// import { useThemeTrigger } from '../../ThemeTrigger';
// import { 
//   getUserNotifications, 
//   markAsRead, 
//   markAllAsRead,
//   getUnreadCount 
// } from '../../Api/NotificationApi';
// import { useSocket } from '../../SocketContext';
// import { useAuth } from '../../AuthContext';

// const Notification = () => {
//   const { darkMode } = useThemeTrigger();
//   const { user } = useAuth();
//   const socket = useSocket();

//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const userId = user?._id;

//   // Fetch notifications & unread count
//   const fetchNotifications = async () => {
//     if (!userId) return;
//     try {
//       setLoading(true);
//       const [notificationsResponse, unreadCountResponse] = await Promise.all([
//         getUserNotifications(userId, 1, 10),
//         getUnreadCount(userId)
//       ]);
//       setNotifications(notificationsResponse.data || []);
//       setUnreadCount(unreadCountResponse || 0);
//     } catch (error) {
//       console.error('Failed to fetch notifications:', error);
//       setNotifications([]);
//       setUnreadCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     if (userId) fetchNotifications();
//   }, [userId]);

//   // Listen to socket events
//   useEffect(() => {
//     if (!socket || !userId) return;

//     const handleNewNotification = (data) => {
//       const notifUserId = data.notification.user?._id || data.notification.user;
//       if (notifUserId === userId) {
//         setNotifications(prev => [data.notification, ...prev]);
//         setUnreadCount(prev => prev + 1);
//       }
//     };

//     socket.on('notification_created', handleNewNotification);

//     return () => {
//       socket.off('notification_created', handleNewNotification);
//     };
//   }, [socket, userId]);

//   const toggleDropdown = async () => {
//     if (!showDropdown && userId) await fetchNotifications();
//     setShowDropdown(!showDropdown);
//   };

//   const closeDropdown = () => setShowDropdown(false);

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       await markAsRead(notificationId);
//       setNotifications(prev =>
//         prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error('Failed to mark notification as read:', error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await markAllAsRead(userId);
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//       setUnreadCount(0);
//     } catch (error) {
//       console.error('Failed to mark all notifications as read:', error);
//     }
//   };

//   const formatTime = (createdAt) => {
//     if (!createdAt) return 'Recently';
//     const now = new Date();
//     const created = new Date(createdAt);
//     const diffInMinutes = Math.floor((now - created) / (1000 * 60));
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     const diffInDays = Math.floor(diffInHours / 24);

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
//     if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
//     if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
//     return created.toLocaleDateString();
//   };

//   const getPriorityIcon = (priority) => {
//     switch (priority) {
//       case 'high': return '🔴';
//       case 'medium': return '🟡';
//       case 'low': return '🟢';
//       default: return '⚪';
//     }
//   };

//   return (
//     <div className={`${styles.notificationContainer} ${darkMode ? styles.dark : styles.light}`}>
//       <button
//         className={styles.notificationBell}
//         onClick={toggleDropdown}
//         aria-label="Notifications"
//         disabled={!userId}
//       >
//         <span className={styles.bellIcon}>🔔</span>
//         {unreadCount > 0 && (
//           <span className={styles.notificationBadge}>
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {showDropdown && (
//         <>
//           <div className={styles.notificationBackdrop} onClick={closeDropdown} />
//           <div className={styles.notificationDropdown}>
//             <div className={styles.dropdownHeader}>
//               <h3>Notifications</h3>
//               <div className={styles.headerActions}>
//                 {unreadCount > 0 && (
//                   <button
//                     className={styles.markAllRead}
//                     onClick={handleMarkAllAsRead}
//                     disabled={loading}
//                   >
//                     Mark all read
//                   </button>
//                 )}
//                 <button
//                   className={styles.closeButton}
//                   onClick={closeDropdown}
//                   aria-label="Close notifications"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className={styles.loadingState}>
//                 <p>Loading notifications...</p>
//               </div>
//             ) : !userId ? (
//               <div className={styles.errorState}>
//                 <p>Please log in to view notifications</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <p className={styles.noNotifications}>No notifications yet</p>
//             ) : (
//               <div className={styles.notificationList}>
//                 {notifications.map(notification => (
//                   <div
//                     key={notification._id}
//                     className={`${styles.notificationItem} ${
//                       !notification.read ? styles.unread : ''
//                     } ${styles[`priority-${notification.priority}`]}`}
//                     onClick={() => !notification.read && handleMarkAsRead(notification._id)}
//                   >
//                     <div className={styles.notificationContent}>
//                       <div className={styles.notificationHeader}>
//                         <span className={styles.priorityIcon}>
//                           {getPriorityIcon(notification.priority)}
//                         </span>
//                         <span className={styles.notificationType}>
//                           {notification.type}
//                         </span>
//                       </div>
//                       <p className={styles.notificationMessage}>
//                         {notification.message}
//                       </p>
//                       <div className={styles.notificationFooter}>
//                         <span className={styles.notificationTime}>
//                           {formatTime(notification.createdAt)}
//                         </span>
//                         {!notification.read && (
//                           <div className={styles.unreadIndicator}>
//                             <span className={styles.unreadDot}></span>
//                             <span className={styles.unreadText}>Unread</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Notification;
