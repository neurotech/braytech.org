import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';

import Globals from '../../utils/globals';
import ObservedImage from '../../components/ObservedImage';

import { getWeapon } from '../../utils/destinyItems';

import './Inspect.css';

class Inspect extends React.Component {
  render() {
    const { t, manifest, profile } = this.props;

    console.log(this);

    let hash = this.props.match.params.secondary;
    let definition = manifest.DestinyInventoryItemDefinition[hash];

    let properties = getWeapon(manifest, hash);
    console.log(properties);

    let sockets = [];
    definition.sockets.socketCategories.forEach(category => {
      let definition = manifest.DestinySocketCategoryDefinition[category.socketCategoryHash];

      sockets.push(
        <div key={category.socketCategoryHash} className={cx('category', { 'is-perks': category.socketCategoryHash === 4241085061 })}>
          <div className='sub-header sub'>
            <div>{definition.displayProperties.name}</div>
          </div>
          <div className='sockets'>
            {properties.sockets
              .filter(socket => socket.categoryHash === category.socketCategoryHash)
              .map((socket, index) => {
                return <div key={index} className='socket'>{socket.plugs.map(plug => plug.element)}</div>;
              })}
          </div>
        </div>
      );
    });

    return (
      <>
        <div className='rarity legendary' />
        <div className='properties'>
          <div className='display'>
            <ObservedImage className='image icon' src={`${Globals.url.bungie}${definition.displayProperties.icon}`} />
            <div className='group'>
              <div className='name'>{definition.displayProperties.name}</div>
              <div className='itemTypeDisplayName'>{definition.itemTypeDisplayName}</div>
            </div>
            <div className='description'>{definition.displayProperties.description}</div>
          </div>
          <div className='sockets'>{sockets}</div>
        </div>
      </>
    );
  }
}

export default withNamespaces()(Inspect);
