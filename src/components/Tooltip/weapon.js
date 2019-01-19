import React from 'react';
import cx from 'classnames';

import ObservedImage from '../ObservedImage';
import { damageTypeToString, ammoTypeToString } from '../../utils/destinyUtils';
import { getWeapon } from '../../utils/destinyItems';

const weapon = (manifest, item) => {
  let { stats, sockets } = getWeapon(manifest, item.hash, false, true);

  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let intrinsic = sockets.find(socket => socket.singleInitialItem ? socket.singleInitialItem.definition.itemCategoryHashes.includes(2237038328) : false);
      intrinsic = intrinsic ? manifest.DestinySandboxPerkDefinition[intrinsic.singleInitialItem.definition.perks[0].perkHash] : false;

  return (
    <>
      <div className='damage weapon'>
        <div className={cx('power', damageTypeToString(item.damageTypeHashes[0]).toLowerCase())}>
          <div className={cx('icon', damageTypeToString(item.damageTypeHashes[0]).toLowerCase())} />
          <div className='text'>600</div>
        </div>
        <div className='slot'>
          <div className={cx('icon', ammoTypeToString(item.equippingBlock.ammoType).toLowerCase())} />
          <div className='text'>{ammoTypeToString(item.equippingBlock.ammoType)}</div>
        </div>
      </div>
      {sourceString ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
      <div className='stats'>{stats}</div>
      <div className={cx('sockets', { 'has-sockets': sockets.length > 0 })}>
        {intrinsic ? (
          <div className='plug intrinsic'>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${intrinsic.displayProperties.icon}`} />
            <div className='text'>
              <div className='name'>{intrinsic.displayProperties.name}</div>
              <div className='description'>{intrinsic.displayProperties.description}</div>
            </div>
          </div>
        ) : null}
        {sockets.length > 0
          ? sockets
              .map(socket => socket.plugs.filter(plug => !plug.definition.itemCategoryHashes.includes(2237038328)).map(plug => plug.element))
          : null}
      </div>
    </>
  );
};

export default weapon;
