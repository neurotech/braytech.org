/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { withNamespaces } from 'react-i18next';
import Globals from '../../utils/globals';
import * as destinyEnums from '../../utils/destinyEnums';
import * as ls from '../../utils/localStorage';
import errorHandler from '../../utils/errorHandler';
import PropTypes from 'prop-types';

import './styles.css';

const ProfileSearchResults = withNamespaces()(props => (
  <div className='results'>
    <ul className='list'>
      {props.results.length > 0 ? (
        props.results.map(result => (
          <li className='linked' key={result.membershipId}>
            <a
              onClick={e => {
                this.onResultClick(result.membershipType, result.membershipId, result.displayName);
              }}
            >
              <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershipType].toLowerCase()}`} />
              {result.displayName}
            </a>
          </li>
        ))
      ) : (
        <li className='no-profiles'>{props.t('No profiles found')}</li>
      )}
    </ul>
  </div>
));

ProfileSearchResults.propTypes = {
  onResultClick: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired
};

const ProfileHistory = withNamespaces()(props => (
  <>
    <div className='sub-header sub'>
      <div>{props.t('Previous')}</div>
    </div>
    <div className='results'>
      <ul className='list'>
        {props.history.map(result => (
          <li className='linked' key={result.membershipId}>
            <a
              onClick={e => {
                props.onResultClick(result.membershipType, result.membershipId, result.displayName);
              }}
            >
              <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershipType].toLowerCase()}`} />
              {result.displayName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </>
));

ProfileHistory.propTypes = {
  onResultClick: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired
};

class ProfileSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: false,
      error: false
    };
  }

  searchDestinyPlayer = e => {
    let membershipType = '-1';
    let displayName = e.target.value;

    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
      fetch(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${membershipType}/${encodeURIComponent(displayName)}/`, {
        headers: {
          'X-API-Key': Globals.key.bungie
        }
      })
        .then(response => {
          return response.json();
        })
        .then(SearchResponse => {
          if (SearchResponse.ErrorCode !== 1) {
            console.log(SearchResponse);
            this.setState({ error: SearchResponse.ErrorCode });
            return;
          }
          this.setState({
            results: SearchResponse.Response,
            error: false
          });
        })
        .catch(error => {
          console.log(error);
        });
    }, 1000);
  };

  render() {
    const { t, onResultClick } = this.props;

    let profileHistory = ls.get('history.profiles') || [];

    return (
      <div className='search'>
        {this.state.error && errorHandler(this.state.error)}
        <div className='sub-header sub'>
          <div>{t('Search for player')}</div>
        </div>
        <div className='form'>
          <div className='field'>
            <input onInput={this.searchDestinyPlayer} type='text' placeholder={t('insert gamertag')} spellCheck='false' />
          </div>
        </div>
        {this.state.results && <ProfileSearchResults results={this.state.results} onResultClick={onResultClick} />}
        {profileHistory.length > 0 && <ProfileHistory history={profileHistory} onResultClick={onResultClick} />}
      </div>
    );
  }
}

ProfileSearch.propTypes = {
  onResultClick: PropTypes.func.isRequired
};

export default withNamespaces()(ProfileSearch);
