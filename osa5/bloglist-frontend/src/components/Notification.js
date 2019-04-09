import React from 'react';

import './notification.css';

const Notification = ({ notification }) => {
  const { message, type } = notification;

  if (message === null) {
    return null;
  }
  if (type === 'notification') {
    return <div className="notification">{message}</div>;
  } else if (type === 'error') {
    return <div className="error">{message}</div>;
  } else {
    console.log('Notification: wrong type', type, 'message was', message);
    return null;
  }
};

export default Notification;
