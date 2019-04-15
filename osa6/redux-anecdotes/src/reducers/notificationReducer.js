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

const showNotification = (message, seconds) => {
  return async (dispatch) => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      data: { message }
    });

    setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION'
      });
    }, seconds * 1000);
  };
};

export default filterReducer;

export { showNotification };
