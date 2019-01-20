import React from 'react';
import { connect } from 'react-redux';

import getProfile from '../../utils/getProfile';
import setProfile from '../../utils/setProfile';

const AUTO_REFRESH_INTERVAL = 20 * 1000;
const HALF_HOUR = 30 * 60 * 1000;

class RefreshService extends React.Component {

  running = false;

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profile.data !== this.props.profile.data || prevProps.refreshService.config.enabled !== this.props.refreshService.config.enabled) {
      if (prevProps.refreshService.config.enabled !== this.props.refreshService.config.enabled) {
        if (this.props.refreshService.config.enabled) {
          this.init();
        } else {
          this.quit();
        }
      } else {
        this.clearTimer();
        this.startTimer();
      }
    }
  }

  componentWillUnmount() {
    this.quit();
  }

  render() {
    return null;
  }

  init() {
    if (this.props.refreshService.config.enabled) {
      console.log('RefreshService: init');
      this.track();
      document.addEventListener('click', this.clickHandler);
      document.addEventListener('visibilitychange', this.visibilityHandler);

      this.startTimer();
    }
  }

  quit() {
    console.log('RefreshService: quit');
    document.removeEventListener('click', this.clickHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.clearTimer();
  }

  track() {
    this.lastActivityTimestamp = Date.now();
  }

  activeWithinTimespan(timespan) {
    return Date.now() - this.lastActivityTimestamp <= timespan;
  }

  startTimer() {
    // console.log('starting a timer');
    this.refreshAccountDataInterval = window.setTimeout(
      this.service,
      AUTO_REFRESH_INTERVAL
    );
  }

  clearTimer() {
    window.clearTimeout(this.refreshAccountDataInterval);
  }

  clickHandler = () => {
    this.track();
  };

  visibilityHandler = () => {
    if (document.hidden === false) {
      this.track();
      this.service();
    }
  };

  service = (membershipType = this.props.profile.membershipType, membershipId = this.props.profile.membershipId) => {

    if (!this.activeWithinTimespan(HALF_HOUR)) {
      return;
    }

    if (this.running) {
      console.warn('RefreshService: service was called though it was already running!');
      this.running = false;
      return;
    } else {
      this.running = true;
    }
  
    // just for the console.warn
    // let time = new Date();
    // console.log("refreshing profile data", time, this.props);
    
    getProfile(membershipType, membershipId, this.props.profile.characterId, (callback) => {

      if (!callback.loading && callback.error) {
        if (callback.error === 'fetch') {
          // TO DO: error count - fail after 3
          // console.log(membershipType, membershipId, state.profile.characterId, callback.data);
          this.running = false;
          // setProfile with previous data - triggers componentDidUpdate in App.js to fire this service again
          setProfile(membershipType, membershipId, this.props.profile.characterId, callback.data);
        }
        return;
      }

      if (!callback.loading && this.props.profile.membershipId === membershipId) {
        this.running = false;
        // setProfile with new data - triggers componentDidUpdate in App.js to fire this service again
        setProfile(membershipType, membershipId, this.props.profile.characterId, callback.data);
      } else if (!callback.loading) {
        this.running = false;
      } else {

      }
    });
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    refreshService: state.refreshService
  };
}

export default connect(mapStateToProps)(RefreshService);