import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import assign from 'lodash/assign';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';
import { withNamespaces } from 'react-i18next';

import Globals from '../../utils/globals';
import ObservedImage from '../../components/ObservedImage';
import manifest from '../../utils/manifest';
import { classTypeToString } from '../../utils/destinyUtils';

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

      if (!member.profile.characterActivities.data) {
        if (!mini) {
          members.push({
            isOnline: member.isOnline,
            lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.isOnline, blueberry: blueberry }, 'no-character', 'error')}>
                <div className='icon black' />
                <div className='displayName'>{member.destinyUserInfo.displayName}</div>
                <div className='error'>{t('Private profile')}</div>
                <div className='activity'>
                  <Moment fromNow>{member.profile.profile.data.dateLastPlayed}</Moment>
                </div>
              </li>
            )
          });
        }
        return;
      }

      let lastCharacterActivity = Object.entries(member.profile.characterActivities.data);
      lastCharacterActivity = orderBy(lastCharacterActivity, [character => character[1].dateActivityStarted], ['desc']);

      lastCharacterActivity = lastCharacterActivity.length > 0 ? lastCharacterActivity[0] : false;

      let lastCharacterTime = Object.entries(member.profile.characterActivities.data);
      lastCharacterTime = orderBy(lastCharacterTime, [character => character[1].dateActivityStarted], ['desc']);

      // console.log(member, lastCharacterActivity, lastCharacterTime)
      // console.log(lastCharacterTime, member.profile.characterActivities.data);
      // console.log(member,, lastCharacterActivity);

      if (lastCharacterActivity || lastCharacterTime) {
        let lastCharacterId = lastCharacterActivity ? lastCharacterActivity[0] : lastCharacterTime[0];
        let lastActivity = lastCharacterActivity ? lastCharacterActivity[1] : false;

        let lastCharacter = member.profile.characters.data.find(character => character.characterId === lastCharacterId);

        // let hsl = rgbToHsl(lastCharacter.emblemColor.red, lastCharacter.emblemColor.green, lastCharacter.emblemColor.blue);
        //  style={{ backgroundColor: `hsl(${hsl.h * 360}deg,${Math.max(hsl.s, 0.20) * 100}%,${Math.max(hsl.l, 0.30) * 100}%)` }}

        if (mini) {
          members.push({
            isOnline: member.isOnline,
            lastActive: lastActivity && member.isOnline ? new Date(lastActivity.dateActivityStarted).getTime() : new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: lastActivity && member.isOnline ? lastActivity.currentActivityHash : 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.isOnline, blueberry: blueberry })}>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
                <div className='displayName'>{member.destinyUserInfo.displayName}</div>
              </li>
            )
          });
        } else {
          // console.log(lastActivity);

          let activityDisplay = null;
          if (lastActivity && member.isOnline) {
            let activity = manifest.DestinyActivityDefinition[lastActivity.currentActivityHash];
            let mode = activity ? (activity.placeHash === 2961497387 ? false : manifest.DestinyActivityModeDefinition[lastActivity.currentActivityModeHash]) : false;

            // console.log(lastActivity);

            activityDisplay = mode ? (
              <>
                {mode.displayProperties.name}: {activity.displayProperties.name}
              </>
            ) : activity ? (
              activity.placeHash === 2961497387 ? (
                'Orbit'
              ) : (
                activity.displayProperties.name
              )
            ) : null;
          }

          let character = (
            <>
              <span className='light'>{lastCharacter.light}</span>
              <span className={`destiny-class_${classTypeToString(lastCharacter.classType).toLowerCase()}`} />
            </>
          );

          members.push({
            isOnline: member.isOnline,
            lastActive: lastActivity && member.isOnline ? new Date(lastActivity.dateActivityStarted).getTime() : new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: lastActivity && member.isOnline ? lastActivity.currentActivityHash : 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.isOnline, blueberry: blueberry, thisIsYou: member.destinyUserInfo.membershipId == this.props.membershipId })}>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
                <div className='displayName'>{member.destinyUserInfo.displayName}</div>
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
                  {activityDisplay ? <div className='name'>{activityDisplay}</div> : null}
                  <Moment fromNow>{lastActivity && member.isOnline ? lastActivity.dateActivityStarted : member.profile.profile.data.dateLastPlayed}</Moment>
                </div>
              </li>
            )
          });
        }
      } else {
        if (mini) {
          members.push({
            isOnline: member.isOnline,
            lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.isOnline, blueberry: blueberry }, 'no-character')}>
                <div className='icon black' />
                <div className='displayName'>{member.destinyUserInfo.displayName}</div>
              </li>
            )
          });
        } else {
          members.push({
            isOnline: member.isOnline,
            lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.isOnline, blueberry: blueberry }, 'no-character')}>
                <div className='icon black' />
                <div className='displayName'>{member.destinyUserInfo.displayName}</div>
              </li>
            )
          });
        }
      }
    });

    members = orderBy(members, [member => member.isOnline, member => member.lastActivity, member => member.lastActive], ['desc', 'desc', 'desc']);

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

