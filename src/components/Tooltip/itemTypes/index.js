import React from 'react';
import cx from 'classnames';

import fallback from './fallback';
import weapon from './weapon';
import armour from './armour';
import emblem from './emblem';
import bounty from './bounty';
import mod from './mod';
import ghost from './ghost';
import sparrow from './sparrow';
import ui from './ui';

export default (manifest, hash) => {

  let item;
  if (hash === '343') {
    item = {
      redacted: true
    };
  } else {
    item = manifest.DestinyInventoryItemDefinition[hash];
  }

  let kind;
  let tier;
  let black;

  switch (item.itemType) {
    case 1:
      kind = 'ui';
      black = ui(manifest, item);
      break;
    case 3:
      kind = 'weapon';
      black = weapon(manifest, item);
      break;
    case 2:
      kind = 'armour';
      black = armour(manifest, item);
      break;
    case 14:
      kind = 'emblem';
      black = emblem(manifest, item);
      break;
    case 19:
      kind = 'mod';
      black = mod(manifest, item);
      break;
    case 20:
      kind = 'bounty';
      black = ui(manifest, item);
      break;
    case 22:
      kind = 'sparrow';
      black = sparrow(manifest, item);
      break;
    case 24:
      kind = 'ghost';
      black = ghost(manifest, item);
      break;
    case 26:
      kind = 'bounty';
      black = bounty(manifest, item);
      break;
    default:
      kind = '';
      black = fallback(manifest, item);
  }

  switch (item.inventory.tierType) {
    case 6:
      tier = 'exotic';
      break;
    case 5:
      tier = 'legendary';
      break;
    case 4:
      tier = 'rare';
      break;
    case 3:
      tier = 'uncommon';
      break;
    case 2:
      tier = 'basic';
      break;
    default:
      tier = 'basic';
  }

  if (item.redacted) {
    return (
      <>
        <div className='acrylic' />
        <div className='frame common'>
          <div className='header'>
            <div className='name'>Classified</div>
            <div>
              <div className='kind'>Insufficient clearance</div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <pre>Keep it clean.</pre>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', kind, tier)}>
          <div className='header'>
            <div className='name'>{item.displayProperties.name}</div>
            <div>
              <div className='kind'>{item.itemTypeDisplayName}</div>
              {kind !== 'ui' ? <div className='rarity'>{item.inventory.tierTypeName}</div> : null}
            </div>
          </div>
          <div className='black'>{black}</div>
        </div>
      </>
    );
  }
};
