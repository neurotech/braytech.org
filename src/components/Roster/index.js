import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import ObservedImage from '../../components/ObservedImage';
import * as utils from '../../utils/destinyUtils';

import './styles.css';

class Roster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: []
    };
  }

  expandHandler = (membershipId, mini) => {
    if (mini) {
      return false;
    } else {
      this.setState((prevState, props) => {
        let index = prevState.expanded.indexOf(membershipId);
        if (index > -1) {
          let expanded = prevState.expanded.filter(id => id !== membershipId);
          return { expanded: expanded };
        } else {
          let expanded = prevState.expanded.concat(membershipId);
          return { expanded: expanded };
        }
      });
    }
  };

  render() {
    const { t, groupMembers, mini, linked, isOnline } = this.props;

    let list = [];
    let results = isOnline ? groupMembers.responses.filter(response => response.isOnline) : groupMembers.responses;

    results.forEach(member => {
      let blueberry = new Date().getTime() - new Date(member.joinDate).getTime() < 1209600000 ? true : false;

      if (!member.profile) {
        if (!mini) {
          list.push({
            membershipId: member.destinyUserInfo.membershipId,
            isOnline: member.isOnline,
            lastPlayed: new Date(member.joinDate).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ isOnline: member.isOnline }, 'no-character', 'error')}>
                <div className='basic'>
                  <div className='icon black' />
                  <div className='displayName'>{member.destinyUserInfo.displayName}</div>
                  <div className='error'>{t("Couldn't retrieve this profile")}</div>
                  <div className='activity'>
                    <Moment fromNow>{member.joinDate}</Moment>
                  </div>
                </div>
              </li>
            )
          });
        }
        return;
      }

      if (!member.profile.characterActivities.data) {
        if (!mini) {
          list.push({
            membershipId: member.destinyUserInfo.membershipId,
            isOnline: member.isOnline,
            lastPlayed: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.destinyUserInfo.membershipId} className={cx({ isOnline: member.isOnline }, 'no-character', 'error')}>
                <div className='basic'>
                  <div className='icon black' />
                  <div className='displayName'>{member.destinyUserInfo.displayName}</div>
                  <div className='error'>{t('Private profile')}</div>
                  <div className='activity'>
                    <Moment fromNow>{member.profile.profile.data.dateLastPlayed}</Moment>
                  </div>
                </div>
              </li>
            )
          });
        }
        return;
      }

      const { lastPlayed, lastActivity, lastCharacter, display } = utils.lastPlayerActivity(member);

      console.log(member);

      if (mini) {
        list.push({
          membershipId: member.destinyUserInfo.membershipId,
          isOnline: member.isOnline,
          lastPlayed: new Date(lastPlayed).getTime(),
          lastActivity: lastActivity && member.isOnline ? lastActivity.currentActivityHash : 0,
          element: (
            <li key={member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.isOnline })}>
              <div className='basic'>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
                <div className='displayName'>{member.destinyUserInfo.displayName}</div>
              </div>
            </li>
          )
        });
      } else {
        let displayName = (
          <>
            <div className='icon'>{member.isOnline ? <ObservedImage className={cx('image')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} /> : null}</div>
            <div className='displayName'>{member.destinyUserInfo.displayName}</div>
          </>
        );

        let character = (
          <>
            <span className={cx('stamp', 'light', { max: lastCharacter.light === 650 })}>{lastCharacter.light}</span>
            <span className={cx('stamp', 'level')}>{lastCharacter.baseCharacterLevel}</span>
            <span className={cx('stamp', 'class', utils.classTypeToString(lastCharacter.classType).toLowerCase())}>{utils.classTypeToString(lastCharacter.classType)}</span>
          </>
        );

        const timePlayedTotalCharacters = Math.floor(
          Object.keys(member.profile.characters.data).reduce((sum, key) => {
            return sum + parseInt(member.profile.characters.data[key].minutesPlayedTotal);
          }, 0) / 1440
        );
        const timePlayedAllPvE = member.historicalStats.allPvE.allTime.secondsPlayed.basic.value / 60;
        const timePlayedAllPvP = member.historicalStats.allPvP.allTime.secondsPlayed.basic.value / 60;
        const timePlayedTotal = timePlayedAllPvE > timePlayedAllPvP ? Math.floor(timePlayedAllPvE / (timePlayedAllPvE + timePlayedAllPvP) * 100) : Math.floor(timePlayedAllPvP / (timePlayedAllPvE + timePlayedAllPvP) * 100);

        let isExpanded = this.state.expanded.includes(member.destinyUserInfo.membershipId);
        let expanded = (
          <div className='detail'>
            <div />
            <ul className='times'>
              <li className='joinDate'>
                <>Joined </>
                <Moment fromNow>{member.joinDate}</Moment>
              </li>
              <li className='timePlayed'>
                {timePlayedTotalCharacters} {timePlayedTotalCharacters === 1 ? t('day played') : t('days played')}
              </li>
              <li>{timePlayedTotal}% {timePlayedAllPvE > timePlayedAllPvP ? `PvE` : `PvP`} player</li>
            </ul>
          </div>
        );

        list.push({
          membershipId: member.destinyUserInfo.membershipId,
          isOnline: member.isOnline,
          lastPlayed: new Date(lastPlayed).getTime(),
          lastActivity: lastActivity && member.isOnline ? lastActivity.currentActivityHash : 0,
          element: (
            <li key={member.destinyUserInfo.membershipId} className={cx({ isOnline: member.isOnline, isExpanded: isExpanded, thisIsYou: member.destinyUserInfo.membershipId === this.props.member.membershipId.toString() })} onClick={() => this.expandHandler(member.destinyUserInfo.membershipId, mini)}>
              <div className='basic'>
                {displayName}
                <div className='rank'>{utils.groupMemberTypeToString(member.memberType)}</div>
                <div className='character'>{character}</div>
                <div className='activity'>
                  {display ? <div className='name'>{display}</div> : null}
                  <Moment fromNow>{lastPlayed}</Moment>
                </div>
              </div>
              {isExpanded ? expanded : null}
            </li>
          )
        });
      }
    });

    list = orderBy(list, [member => member.isOnline, member => member.lastActivity, member => member.lastPlayed], ['desc', 'desc', 'desc']);

    if (this.props.mini) {
      list.push({
        membershipId: 0,
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
      list.unshift({
        membershipId: 0,
        isOnline: false,
        lastActive: 0,
        lastActivity: 0,
        element: (
          <li key='i_am_unqiue' className='grid-header'>
            <div className='basic'>
              <div className='icon' />
              <div className='displayName' />
              <div className='triumphScore'>{t('Rank')}</div>
              <div className='character'>{t('Last character')}</div>
              <div className='activity'>{t('Last activity')}</div>
            </div>
          </li>
        )
      });
    }

    return <ul className={cx('list', 'roster', { mini: mini })}>{list.map(member => member.element)}</ul>;
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
