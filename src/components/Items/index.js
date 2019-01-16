import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import { enumerateCollectibleState } from '../../utils/destinyEnums';

import './styles.css';

class Items extends React.Component {
  render() {
    let manifest = this.props.manifest;

    let itemsRequested = this.props.hashes;

    let items = [];
    
    itemsRequested.forEach(hash => {
      let itemDefinition = manifest.DestinyInventoryItemDefinition[hash];

      if (itemDefinition.redacted) {
        items.push(
          <li key={itemDefinition.hash + '-' + Math.random()} className={cx('item', 'tooltip')} data-itemhash={itemDefinition.hash}>
            <div className="icon">
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
            </div>
          </li>
        );
      } else {
        items.push(
          <li key={itemDefinition.hash + '-' + Math.random()} className={cx('item', 'tooltip')} data-itemhash={itemDefinition.hash}>
            <div className="icon">
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
    profile: state.profile
  };
}

export default compose(
  connect(mapStateToProps)
)(Items);
