const filterReducer = (state = '', action) => {
  switch (action.type) {
  case 'SHOW_NOTIFICATION': {
    console.log('show_notification', action.data.message);
    return action.data.message;
  }
  case 'HIDE_NOTIFICATION': return '';
  default: return state;
  }
};

const showNotification = (message) => {
  return {
    type: 'SHOW_NOTIFICATION',
    data: {
      message
    }
  };
};

const hideNotification = () => {
  return {
    type: 'HIDE_NOTIFICATION'
  };
};

export default filterReducer;

export { showNotification, hideNotification };
