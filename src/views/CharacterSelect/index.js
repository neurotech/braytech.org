/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';

import getProfile from '../../utils/getProfile';
import Characters from '../../components/Characters';
import * as ls from '../../utils/localStorage';
import Spinner from '../../components/Spinner';

import ProfileSearch from './ProfileSearch';
import './styles.css';
import store from '../../utils/reduxStore';

class CharacterSelect extends React.Component {
  characterClick = characterId => {
    ls.set('setting.profile', {
      membershipType: this.props.profile.membershipType,
      membershipId: this.props.profile.membershipId,
      characterId
    });

    store.dispatch({
      type: 'PROFILE_CHARACTER_SELECT',
      payload: characterId
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    if (this.props.profile.membershipId && !this.props.profile.data) getProfile();
  }

  resultClick = (membershipType, membershipId, displayName) => {
    window.scrollTo(0, 0);

    store.dispatch({ type: 'PROFILE_MEMBERSHIP_SELECT', payload: { membershipType, membershipId } });
    getProfile();

    if (displayName) {
      ls.update('history.profiles', { membershipType: membershipType, membershipId: membershipId, displayName: displayName }, true, 6);
    }
  };

  render() {
    const { t } = this.props;
    let profileElement = null;

    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (this.props.profile.data) {
      let clan = null;
      if (this.props.profile.data.groups.results.length === 1) {
        clan = <div className='clan'>{this.props.profile.data.groups.results[0].group.name}</div>;
      }

      let timePlayed = (
        <div className='timePlayed'>
          {Math.floor(
            Object.keys(this.props.profile.data.profile.characters.data).reduce((sum, key) => {
              return sum + parseInt(this.props.profile.data.profile.characters.data[key].minutesPlayedTotal);
            }, 0) / 1440
          )}{' '}
          {t('days on the grind')}
        </div>
      );

      profileElement = (
        <>
          <div className='user'>
            <div className='info'>
              <div className='displayName'>{this.props.profile.data.profile.profile.data.userInfo.displayName}</div>
              {clan}
              {timePlayed}
            </div>
            <Characters data={this.props.profile.data} manifest={this.props.manifest} location={{ ...from }} characterClick={this.characterClick} />
          </div>
        </>
      );
    }

    let reverse = false;
    if (this.props.viewport.width <= 500) {
      reverse = true;
    }

    const loadingProfile = !this.props.profile.data && this.props.profile.membershipId && !this.props.profile.error;

    return (
      <div className={cx('view', this.props.theme.selected, { loading: this.props.loading })} id='get-profile'>
        {reverse && (
          <div className='profile'>
            {loadingProfile && <Spinner />}
            {profileElement}
          </div>
        )}

        <ProfileSearch onResultClick={this.resultClick} />

        {!reverse && (
          <div className='profile'>
            {loadingProfile && <Spinner />}
            {profileElement}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(CharacterSelect);
