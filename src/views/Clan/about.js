import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';

import * as bungie from '../../utils/bungie';
import ClanBanner from '../../components/ClanBanner';
import Roster from '../../components/Roster';
import Spinner from '../../components/Spinner';
import ProgressBar from '../../components/ProgressBar';
import Checkbox from '../../components/Checkbox';
import manifest from '../../utils/manifest';

import './about.css';

class AboutView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weeklyRewardState: false
    };
  }

  async componentDidMount() {
    const groupId = this.props.member.data.groups.results[0].group.groupId;
    const groupWeeklyRewardState = await bungie.groupWeeklyRewardState(groupId);

    this.setState({ weeklyRewardState: groupWeeklyRewardState });
  }

  render() {
    const { t, member, groupMembers, theme } = this.props;
    const clan = member.data.groups.results[0].group;
    const weeklyRewardState = this.state.weeklyRewardState;

    const clanLevel = clan.clanInfo.d2ClanProgressions[584850370];
    const weeklyPersonalContribution = member.data.profile.characterProgressions.data[member.characterId].progressions[540048094];

    const weeklyClanEngramsDefinition = manifest.DestinyMilestoneDefinition[4253138191].rewards[1064137897].rewardEntries;
    let rewardState = null;
    if (this.state.weeklyRewardState) {
      rewardState = weeklyRewardState.rewards.find(reward => reward.rewardCategoryHash === 1064137897).entries;
    }

    return (
      <div className={cx('view', theme.selected)} id='clan'>
        <div className='about'>
          <div className='banner'>
            <ClanBanner bannerData={clan.clanInfo.clanBannerData} />
          </div>
          <div className='overview'>
            <div className='clan-properties'>
              <div className='name'>
                {clan.name}
                <div className='tag'>[{clan.clanInfo.clanCallsign}]</div>
              </div>
              {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
              <div className='memberCount'>
                // {clan.memberCount} {t('members')}
              </div>
              <div className='motto'>{clan.motto}</div>
              <ReactMarkdown className='bio' escapeHtml disallowedTypes={['image', 'imageReference']} source={clan.about} />
            </div>
            <div className='sub-header sub'>
              <div>{t('Season')} 5</div>
            </div>
            <div className='progression'>
              <div className='clanLevel'>
                <div className='text'>{t('Clan level')}</div>
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: `${t('Level')} ${clanLevel.level}`,
                    completionValue: clanLevel.nextLevelAt
                  }}
                  playerProgress={{
                    progress: clanLevel.progressToNextLevel,
                    objectiveHash: 'clanLevel'
                  }}
                  hideCheck
                  chunky
                />
              </div>
            </div>
            <div className='sub-header sub'>
              <div>{t('Clan details')}</div>
            </div>
            <div className='progression details'>
              <div className='weeklyRewardState'>
                <div className='text'>{t('Weekly Clan Engrams')}</div>
                <ul>
                  {rewardState ? (
                    rewardState.map(reward => (
                      <li key={reward.rewardEntryHash}>
                        <Checkbox completed={reward.earned} text={weeklyClanEngramsDefinition[reward.rewardEntryHash].displayProperties.name} />
                      </li>
                    ))
                  ) : (
                    <Spinner />
                  )}
                </ul>
              </div>
              <div className='personalContribution'>
                <div className='text'>{t('Weekly Personal XP Contribution')}</div>
                <Checkbox
                  completed={weeklyPersonalContribution.weeklyProgress === 5000}
                  text={
                    <>
                      <span>{weeklyPersonalContribution.weeklyProgress}</span> / 5000
                    </>
                  }
                />
              </div>
            </div>
          </div>
          <div className='roster'>
            <div className='sub-header sub'>
              <div>{t('Views')}</div>
            </div>
            <div className='views'>
              <ul className='list'>
                <li className='linked'>
                  <NavLink to='/clan' exact>
                    {t('About')}
                  </NavLink>
                </li>
                <li className='linked'>
                  <NavLink to='/clan/roster'>{t('Roster')}</NavLink>
                </li>
                <li className='linked'>
                  <NavLink to='/clan/stats'>{t('Stats')}</NavLink>
                </li>
              </ul>
            </div>
            <div className='sub-header sub'>
              <div>{t('Clan roster')}</div>
              <div>{groupMembers.responses.filter(member => member.isOnline).length} online</div>
            </div>
            {!groupMembers.loading ? <Roster mini linked isOnline /> : <Spinner />}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers,
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(AboutView);
