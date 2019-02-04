import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import ObservedImage from '../../components/ObservedImage';
import { classTypeToString, lastPlayerActivity } from '../../utils/destinyUtils';

import './styles.css';

class Roster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, groupMembers, mini, linked, isOnline } = this.props;

    let members = [];
    let results = isOnline ? groupMembers.responses.filter(response => response.isOnline) : groupMembers.responses;

    results.forEach(member => {
      let blueberry = new Date().getTime() - new Date(member.joinDate).getTime() < 1209600000 ? true : false;

      const { lastPlayed, lastActivity, lastCharacter, display } = lastPlayerActivity(member);

      if (!member.profile.characterActivities.data) {
        if (!mini) {
          members.push({
            isOnline: member.isOnline,
            lastPlayed: new Date(lastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.isOnline, blueberry: blueberry }, 'no-character', 'error')}>
                <div className='icon black' />
                <div className='displayName'>{member.destinyUserInfo.displayName}</div>
                <div className='error'>{t('Private profile')}</div>
                <div className='activity'>
                  <Moment fromNow>{lastPlayed}</Moment>
                </div>
              </li>
            )
          });
        }
        return;
      }

      if (mini) {
        members.push({
          isOnline: member.isOnline,
          lastPlayed: new Date(lastPlayed).getTime(),
          lastActivity: lastActivity && member.isOnline ? lastActivity.currentActivityHash : 0,
          element: (
            <li key={member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.isOnline, blueberry: blueberry })}>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
              <div className='displayName'>{member.destinyUserInfo.displayName}</div>
            </li>
          )
        });
      } else {

        let character = (
          <>
            <span className='light'>{lastCharacter.light}</span>
            <span className={`destiny-class_${classTypeToString(lastCharacter.classType).toLowerCase()}`} />
          </>
        );

        let displayName = (
          <>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
            <div className='displayName'>{member.destinyUserInfo.displayName}</div>
          </>
        );

        members.push({
          isOnline: member.isOnline,
          lastPlayed: new Date(lastPlayed).getTime(),
          lastActivity: lastActivity && member.isOnline ? lastActivity.currentActivityHash : 0,
          element: (
            <li key={member.destinyUserInfo.membershipId} className={cx({ isOnline: member.isOnline, blueberry: blueberry, thisIsYou: member.destinyUserInfo.membershipId === this.props.member.membershipId.toString() })}>
              {linked ? <Link className='memberLink' to='/clan/roster'>{displayName}</Link> : displayName}
              <div className='triumphScore'>{member.profile.profileRecords.data.score}</div>
              <div className='clanXp'>
                <span>
                  {Object.values(member.profile.characterProgressions.data).reduce((sum, member) => {
                    return sum + member.progressions[540048094].weeklyProgress;
                  }, 0)}
                </span>{' '}
                /{' '}
                {Object.values(member.profile.characterProgressions.data).reduce((sum, member) => {
                  return sum + 5000;
                }, 0)}
              </div>
              <div className='character'>{character}</div>
              <div className='activity'>
                {display ? <div className='name'>{display}</div> : null}
                <Moment fromNow>{lastActivity && member.isOnline ? lastActivity.dateActivityStarted : member.profile.profile.data.dateLastPlayed}</Moment>
              </div>
            </li>
          )
        });
      }
    });

    members = orderBy(members, [member => member.isOnline, member => member.lastActivity, member => member.lastPlayed], ['desc', 'desc', 'desc']);

    if (this.props.mini) {
      members.push({
        isOnline: false,
        lastActive: 0,
        lastActivity: 0,
        element: (
          <li key='i_am_unqiue' className='linked view-all'>
            <Link to='/clan/roster'>{t('View full roster')}</Link>
          </li>
        )
      });
    } else {
      members.unshift({
        isOnline: false,
        lastActive: 0,
        lastActivity: 0,
        element: (
          <li key='i_am_unqiue' className='grid-header'>
            <div className='icon' />
            <div className='displayName' />
            <div className='triumphScore'>{t('Triumph score')}</div>
            <div className='clanXp'>{t('Clan XP weekly')}</div>
            <div className='character'>{t('Character')}</div>
            <div className='activity'>{t('Activity')}</div>
          </li>
        )
      });
    }

    return <ul className={cx('list', 'roster', { mini: mini })}>{members.map(member => member.element)}</ul>;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Roster);

