import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import { enumerateCollectibleState } from '../../utils/destinyEnums';

import './styles.css';

class Items extends React.Component {
  render() {
    console.log(this);

    const { manifest, hashes, profile } = this.props;

    let items = [];

    hashes.forEach(hash => {
      let itemDefinition = manifest.DestinyInventoryItemDefinition[hash];

      let state = 0;
      if (profile.data) {
        let hash = itemDefinition.collectibleHash ? itemDefinition.collectibleHash : false;
        if (hash) {
          let characterId = profile.characterId;
          let characterCollectibles = profile.data.profile.characterCollectibles.data;
          let profileCollectibles = profile.data.profile.profileCollectibles.data;

          let scope = profileCollectibles.collectibles[hash] ? profileCollectibles.collectibles[hash] : characterCollectibles[characterId].collectibles[hash];
          if (scope) {
            state = scope.state;
          }
        }
      }

      if (itemDefinition.redacted) {
        items.push(
          <li
            key={itemDefinition.hash + '-' + Math.random()}
            className={cx('item', 'tooltip', {
              'not-acquired': profile.data && enumerateCollectibleState(state).notAcquired
            })}
            data-itemhash={itemDefinition.hash}
          >
            <div className='icon'>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
            </div>
          </li>
        );
      } else {
        items.push(
          <li
            key={itemDefinition.hash + '-' + Math.random()}
            className={cx('item', 'tooltip', {
              'not-acquired': profile.data && enumerateCollectibleState(state).notAcquired
            })}
            data-itemhash={itemDefinition.hash}
          >
            <div className='icon'>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${itemDefinition.displayProperties.icon}`} />
            </div>
          </li>
        );
      }
    });

    return items;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    theme: state.theme
  };
}

export default connect(mapStateToProps)(Items);
