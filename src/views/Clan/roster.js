import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import Roster from '../../components/Roster';
import Spinner from '../../components/Spinner';

import './roster.css';

class RosterView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t, member, group, groupMembers, theme } = this.props;

    return (
      <div className={cx('view', theme.selected)} id='clan'>
        <div className='roster'>
          <div className='summary'>
            <div className='clan-properties'>
              <div className='name'>
                {group.name}
                <div className='tag'>[{group.clanInfo.clanCallsign}]</div>
              </div>
              {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
              <div className='memberCount'>
                // {group.memberCount} {t('members')} / {groupMembers.responses.filter(member => member.isOnline).length} {t('online')}
              </div>
              <div className='motto'>{group.motto}</div>
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
            <div className='info'>
              <p>{t('Pulsing blueberries are freshly acquired members from the last 2 weeks.')}</p>
            </div>
          </div>
          <div className='members'>{!groupMembers.loading ? <Roster /> : <Spinner />}</div>
        </div>
      </div>
    );
  }
}

export default RosterView;
