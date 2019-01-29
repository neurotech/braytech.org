import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import cx from 'classnames';

import ObservedImage from '../ObservedImage';
import ProgressBar from '../ProgressBar';
import { enumerateRecordState } from '../../utils/destinyEnums';

import './styles.css';

class Records extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToRecordRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.highlight && this.scrollToRecordRef.current !== null) {
      window.scrollTo({
        top: this.scrollToRecordRef.current.offsetTop + this.scrollToRecordRef.current.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  trackThisClick = e => {
    let tracked = this.props.tracked;
    let hashToTrack = parseInt(e.currentTarget.dataset.hash, 10);
    let target = tracked.indexOf(hashToTrack);

    if (target > -1) {
      tracked = tracked.filter((hash, index) => index !== target);
    } else {
      tracked.push(hashToTrack);
    }

    this.props.setTrackedTriumphs(tracked);
  }

  render() {
    const manifest = this.props.manifest;

    const characterRecords = this.props.profile.data.profile.characterRecords.data;
    const profileRecords = this.props.profile.data.profile.profileRecords.data.records;
    const characterId = this.props.profile.characterId;

    const highlight = this.props.highlight;

    let records = [];

    let recordsRequested = this.props.hashes;
    recordsRequested.forEach(hash => {
      const recordDefinition = manifest.DestinyRecordDefinition[hash];

      let objectives = [];
      let link = false;

      // selfLink

      try {
        let reverse1;
        let reverse2;
        let reverse3;

        manifest.DestinyRecordDefinition[hash].presentationInfo.parentPresentationNodeHashes.forEach(element => {
          if (manifest.DestinyPresentationNodeDefinition[1652422747].children.presentationNodes.filter(el => el.presentationNodeHash === element).length > 0) {
            return; // if hash is a child of seals, skip it
          }
          if (reverse1) {
            return;
          }
          reverse1 = manifest.DestinyPresentationNodeDefinition[element];
        });

        let iteratees = reverse1.presentationInfo ? reverse1.presentationInfo.parentPresentationNodeHashes : reverse1.parentNodeHashes;
        iteratees.forEach(element => {
          if (reverse2) {
            return;
          }
          reverse2 = manifest.DestinyPresentationNodeDefinition[element];
        });

        if (reverse2 && reverse2.parentNodeHashes) {
          reverse3 = manifest.DestinyPresentationNodeDefinition[reverse2.parentNodeHashes[0]];
        }

        link = `/triumphs/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}/${hash}`;
      } catch (e) {
        // console.log(e);
      }

      if (recordDefinition.objectiveHashes) {
        recordDefinition.objectiveHashes.forEach(hash => {
          let objectiveDefinition = manifest.DestinyObjectiveDefinition[hash];

          if (profileRecords[recordDefinition.hash]) {
            let playerProgress = null;
            profileRecords[recordDefinition.hash].objectives.forEach(objective => {
              if (objective.objectiveHash === hash) {
                playerProgress = objective;
              }
            });

            // override
            if (hash === 1278866930 && playerProgress.complete) {
              playerProgress.progress = 16;
            }

            objectives.push(<ProgressBar key={objectiveDefinition.hash} objectiveDefinition={objectiveDefinition} playerProgress={playerProgress} />);
          } else if (characterRecords[characterId].records[recordDefinition.hash]) {
            let playerProgress = null;
            characterRecords[characterId].records[recordDefinition.hash].objectives.forEach(objective => {
              if (objective.objectiveHash === hash) {
                playerProgress = objective;
              }
            });

            objectives.push(<ProgressBar key={objectiveDefinition.hash} objectiveDefinition={objectiveDefinition} playerProgress={playerProgress} />);
          } else {
            objectives.push(null);
          }
        });
      }

      let state;
      if (profileRecords[recordDefinition.hash]) {
        state = profileRecords[recordDefinition.hash] ? profileRecords[recordDefinition.hash].state : 0;
      } else if (characterRecords[characterId].records[recordDefinition.hash]) {
        state = characterRecords[characterId].records[recordDefinition.hash] ? characterRecords[characterId].records[recordDefinition.hash].state : 0;
      } else {
        state = 0;
      }

      if (enumerateRecordState(state).invisible) {
        return;
      }

      if (enumerateRecordState(state).recordRedeemed && this.props.collectibles && this.props.collectibles.hideTriumphRecords) {
        return;
      }

      // eslint-disable-next-line eqeqeq
      let ref = highlight == recordDefinition.hash ? this.scrollToRecordRef : null;

      if (recordDefinition.redacted) {
        records.push({
          completed: enumerateRecordState(state).recordRedeemed,
          hash: recordDefinition.hash,
          element: (
            <li
              key={recordDefinition.hash}
              ref={ref}
              className={cx('redacted', {
                // eslint-disable-next-line eqeqeq
                highlight: highlight && highlight == recordDefinition.hash
              })}
            >
              <div className='properties'>
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                </div>
                <div className='text'>
                  <div className='name'>Classified record</div>
                  <div className='description'>This record is classified and may be revealed at a later time.</div>
                </div>
              </div>
            </li>
          )
        });
      } else {
        let description = recordDefinition.displayProperties.description !== '' ? recordDefinition.displayProperties.description : false;
        description = !description && recordDefinition.loreHash ? manifest.DestinyLoreDefinition[recordDefinition.loreHash].displayProperties.description.slice(0, 117).trim() + '...' : description;
        if (recordDefinition.hash === 2367932631) {
          console.log(enumerateRecordState(state));
        }

        records.push({
          completed: enumerateRecordState(state).recordRedeemed,
          hash: recordDefinition.hash,
          element: (
            <li
              key={recordDefinition.hash}
              ref={ref}
              className={cx({
                linked: link && this.props.selfLink,
                // eslint-disable-next-line eqeqeq
                highlight: highlight && highlight == recordDefinition.hash,
                completed: enumerateRecordState(state).recordRedeemed,
                unRedeemed: !enumerateRecordState(state).recordRedeemed && !enumerateRecordState(state).objectiveNotCompleted,
                tracked: this.props.tracked.includes(recordDefinition.hash),
                'no-description': !description
              })}
            >
              <div className='track-this' onClick={this.trackThisClick} data-hash={recordDefinition.hash} />
              <div className='properties'>
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
                </div>
                <div className='text'>
                  <div className='name'>{recordDefinition.displayProperties.name}</div>
                  {recordDefinition.completionInfo.ScoreValue && recordDefinition.completionInfo.ScoreValue !== 0 ? <div className='score'>{recordDefinition.completionInfo.ScoreValue}</div> : null}
                  <div className='description'>{description}</div>
                </div>
              </div>
              <div className='objectives'>{objectives}</div>
              {link && this.props.selfLink ? <Link to={{ pathname: link, state: { from: this.props.selfLinkFrom ? this.props.selfLinkFrom : false } }} /> : null}
            </li>
          )
        });
      }
    });

    if (records.length === 0 && this.props.collectibles.hideTriumphRecords) {
      records.push({
        element: (
          <li key='lol' className='all-completed'>
            <div className='properties'>
              <div className='text'>
                <div className='name'>When all is said and done</div>
                <div className='description'>You've completed these records</div>
              </div>
            </div>
          </li>
        )
      });
    }

    records = this.props.ordered ? orderBy(records, [item => item.completed], ['asc']) : records;

    return records.map(obj => obj.element);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    tracked: state.triumphs.tracked
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTrackedTriumphs: value => {
      dispatch({ type: 'SET_TRACKED_TRIUMPHS', payload: value });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Records);
