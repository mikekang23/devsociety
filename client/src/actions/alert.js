import uuid from 'react-uuid';

import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => {
  return (dispatch) => {
    const id = uuid();
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id }
    })

    // setTimeout(() => dispatch({
    //   type: REMOVE_ALERT,
    //   payload: id
    // }), 2000)
  }
}
//
export const removeAlert = (id) => {
  return (dispatch) => {
    const alert_id = id;
    dispatch({
      type: REMOVE_ALERT,
      payload: { id:alert_id }
    })
  }
}
