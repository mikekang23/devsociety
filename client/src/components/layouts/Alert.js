import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const renderAlerts = (alerts) => {
  return (
    alerts.map(alert => {
      return (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      )
    })
  )
}

const Alert = ({ alerts }) => {
  return (
    <div>
    {renderAlerts(alerts)}
    </div>
  );
}

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  alerts: state.alert
})

export default connect(mapStateToProps)(Alert);
