import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import { enumerateCollectibleState } from '../../utils/destinyEnums';

import './styles.css';

class Items extends React.Component {
  render() {
    const { manifest, data, profile } = this.props;

    let items = [];

    data.forEach(item => {
      let hash = item.itemHash;
      let itemDefinition = manifest.DestinyInventoryItemDefinition[hash];

      let costs = [];
      if (item.costs !== undefined) {
        item.costs.forEach(cost => {
          let currencyDefinition = manifest.DestinyInventoryItemDefinition[cost.itemHash];
          costs.push(
            <li key={currencyDefinition.hash} className='item tooltip' data-itemhash={currencyDefinition.hash}>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${currencyDefinition.displayProperties.icon}`} />
              <div className='value'>{cost.quantity}</div>
            </li>
          );
        });
      }

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
          >
            <ul className='list'>
              <li className={cx('item', 'tooltip', {
              'not-acquired': profile.data && enumerateCollectibleState(state).notAcquired
            })} data-itemhash={itemDefinition.hash}>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                {item.quantity > 1 ? <div className='quantity'>{item.quantity}</div> : null}
              </li>
            </ul>
            {costs.length > 0 ? <ul className='list costs'>{costs}</ul> : null}
          </li>
        );
      } else {
        items.push(
          <li
            key={itemDefinition.hash + '-' + Math.random()}
          >
            <ul className='list'>
              <li className={cx('item', 'tooltip', {
              'not-acquired': profile.data && enumerateCollectibleState(state).notAcquired
            })} data-itemhash={itemDefinition.hash}>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${itemDefinition.displayProperties.icon}`} />
                {item.quantity > 1 ? <div className='quantity'>{item.quantity}</div> : null}
              </li>
            </ul>
            {costs.length > 0 ? <ul className='list costs'>{costs}</ul> : null}
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
