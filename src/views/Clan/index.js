import React from 'react';
import { connect } from 'react-redux';

import store from '../../utils/reduxStore';
import * as responseUtils from '../../utils/responseUtils';
import * as bungie from '../../utils/bungie';

import './styles.css';
import AboutView from './about.js';
import RosterView from './roster.js';
import StatsView from './stats.js';

class Clan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async getMembers(members) {
    return await Promise.all(
      members.map(async member => {
        member.profile = await bungie.memberProfile(member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId, '100,200,202,204,900');
        if (!member.profile.characterProgressions.data) {
          return member;
        }
        member.profile = responseUtils.profileScrubber(member.profile);

        return member;
      })
    );
  }

  async componentDidMount() {
    const { member, groupMembers } = this.props;

    if (member.data.groups.results[0].group.groupId && groupMembers.responses.length === 0) {
      store.dispatch({
        type: 'GROUP_MEMBERS_LOADING'
      });

      const groupMembersResponse = await bungie.groupMembers(member.data.groups.results[0].group.groupId);
      let memberResponses = await this.getMembers(groupMembersResponse.results);

      console.log(memberResponses);

      store.dispatch({
        type: 'GROUP_MEMBERS_LOADED',
        payload: memberResponses
      });
    }
  }

  render() {
    return null;
    if (this.props.view === 'roster') {
      return <RosterView {...this.props} />;
    } else if (this.props.view === 'stats') {
      return <StatsView {...this.props} />;
    } else {
      return <AboutView {...this.props} />;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers,
    theme: state.theme
  };
}

export default connect(mapStateToProps)(Clan);
