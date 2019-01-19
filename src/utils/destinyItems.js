import React from 'react';
import cx from 'classnames';

import Globals from './globals';
import ObservedImage from '../components/ObservedImage';

const round = number => {
  const floor = Math.floor(number);

  if (number - floor > 0.5) {
    return Math.ceil(number);
  } else {
    return floor;
  }
};

const interpolate = (investmentValue, displayInterpolation) => {
  const interpolation = [...displayInterpolation].sort((a, b) => a.value - b.value);

  const upperBound = interpolation.find(point => point.value >= investmentValue);
  const lowerBound = [...interpolation].reverse().find(point => point.value <= investmentValue);

  if (!upperBound && !lowerBound) {
    console.log('Invalid displayInterpolation');
  }

  if (!upperBound || !lowerBound) {
    if (upperBound) {
      return upperBound.weight;
    } else if (lowerBound) {
      return lowerBound.weight;
    } else {
      console.log('Invalid displayInterpolation');
    }
  }

  const range = upperBound.value - lowerBound.value;
  const factor = range > 0 ? (investmentValue - lowerBound.value) / 100 : 1;

  const displayValue = lowerBound.weight + (upperBound.weight - lowerBound.weight) * factor;
  return round(displayValue);
};

export const getWeapon = (manifest, hash, mods = true, initialOnly = false, socketExclusions = [2285418970]) => {
  let item = manifest.DestinyInventoryItemDefinition[hash];

  let weaponsStats = [
    {
      hash: 2837207746,
      name: manifest.DestinyStatDefinition[2837207746].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 3614673599,
      name: manifest.DestinyStatDefinition[3614673599].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 2523465841,
      name: manifest.DestinyStatDefinition[2523465841].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 4043523819,
      name: manifest.DestinyStatDefinition[4043523819].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 1240592695,
      name: manifest.DestinyStatDefinition[1240592695].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 2762071195,
      name: manifest.DestinyStatDefinition[2762071195].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 209426660,
      name: manifest.DestinyStatDefinition[209426660].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 155624089,
      name: manifest.DestinyStatDefinition[155624089].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 943549884,
      name: manifest.DestinyStatDefinition[943549884].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 4188031367,
      name: manifest.DestinyStatDefinition[4188031367].displayProperties.name,
      type: 'bar',
      modifier: 0
    },
    {
      hash: 1345609583,
      name: manifest.DestinyStatDefinition[1345609583].displayProperties.name,
      type: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 2715839340,
      name: manifest.DestinyStatDefinition[2715839340].displayProperties.name,
      type: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 3555269338,
      name: manifest.DestinyStatDefinition[3555269338].displayProperties.name,
      type: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 1931675084,
      name: manifest.DestinyStatDefinition[1931675084].displayProperties.name,
      type: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 925767036,
      name: manifest.DestinyStatDefinition[925767036].displayProperties.name,
      type: 'int',
      modifier: 0
    },
    {
      hash: 4284893193,
      name: manifest.DestinyStatDefinition[4284893193].displayProperties.name,
      type: 'int',
      modifier: 0
    },
    {
      hash: 2961396640,
      name: manifest.DestinyStatDefinition[2961396640].displayProperties.name,
      type: 'int',
      modifier: 0
    },
    {
      hash: 3871231066,
      name: manifest.DestinyStatDefinition[3871231066].displayProperties.name,
      type: 'int',
      modifier: 0
    }
  ];

  let statGroup = manifest.DestinyStatGroupDefinition[item.stats.statGroupHash];

  let socketsOutput = [];
  Object.keys(item.sockets.socketEntries).forEach(key => {
    let socket = item.sockets.socketEntries[key];
    
    let categoryHash = item.sockets.socketCategories.find(category => category.socketIndexes.includes(parseInt(key, 10))) ? item.sockets.socketCategories.find(category => category.socketIndexes.includes(parseInt(key, 10))).socketCategoryHash : false

    if (socketExclusions.includes(socket.singleInitialItemHash) || (!mods && categoryHash === 2685412949)) {
      return;
    }

    socket.reusablePlugItems.forEach(reusablePlug => {
      let plug = manifest.DestinyInventoryItemDefinition[reusablePlug.plugItemHash];

      if (plug.hash === socket.singleInitialItemHash) {
        plug.investmentStats.forEach(modifier => {
          let index = weaponsStats.findIndex(stat => stat.hash === modifier.statTypeHash);
          if (index > -1) {
            weaponsStats[index].modifier = modifier.value;
          }
        });
      }
    });

    let socketPlugs = [];

    socket.reusablePlugItems.forEach(reusablePlug => {
      let plug = manifest.DestinyInventoryItemDefinition[reusablePlug.plugItemHash];

      if (initialOnly && plug.hash !== socket.singleInitialItemHash) {
        return;
      }

      socketPlugs.push({
        active: plug.hash === socket.singleInitialItemHash,
        definition: plug,
        element: (
          <div key={plug.hash} className={cx('plug', 'tooltip', { 'is-intrinsic': plug.itemCategoryHashes.includes(2237038328), 'is-active': plug.hash === socket.singleInitialItemHash })} data-itemhash={plug.hash}>
            <ObservedImage className={cx('image', 'icon')} src={`${Globals.url.bungie}${plug.displayProperties.icon}`} />
            <div className='text'>
              <div className='name'>{plug.displayProperties.name}</div>
            </div>
          </div>
        )
      });
    });

    let singleInitialItem = false;
    if (socket.singleInitialItemHash !== 0) {
      let plug = manifest.DestinyInventoryItemDefinition[socket.singleInitialItemHash];
      singleInitialItem = {
        definition: plug,
        element: (
          <div key={plug.hash} className={cx('plug', 'tooltip', { 'is-intrinsic': plug.itemCategoryHashes.includes(2237038328), 'is-active': plug.hash === socket.singleInitialItemHash })} data-itemhash={plug.hash}>
            <ObservedImage className={cx('image', 'icon')} src={`${Globals.url.bungie}${plug.displayProperties.icon}`} />
            <div className='text'>
              <div className='name'>{plug.displayProperties.name}</div>
            </div>
          </div>
        )
      };
    }

    if (socket.singleInitialItemHash !== 0 && !socketPlugs.find(plug => plug.definition.hash === socket.singleInitialItemHash)) {
      socketPlugs.unshift(singleInitialItem);
    }

    socketsOutput.push({
      categoryHash,
      singleInitialItem,
      plugs: socketPlugs
    });
  });

  let stats = [];

  weaponsStats.forEach(stat => {
    if (stat.hidden) {
      return;
    }
    if (Object.keys(item.stats.stats).includes(stat.hash.toString())) {
      let modifier = stat.modifier ? stat.modifier : 0;
      if (stat.hash === 3871231066) {
        modifier = 0;
      }

      let investmentStat = item.investmentStats.find(investment => investment.statTypeHash === stat.hash);
      let scaledStats = statGroup.scaledStats.find(scale => scale.statHash === stat.hash);

      let interpolatatedModifier = scaledStats ? interpolate(investmentStat.value + modifier, scaledStats.displayInterpolation) : modifier;

      let value = interpolatatedModifier;
      if (stat.hash === 3871231066) {
        value = value < 1 ? 1 : value;
      }

      stats.push(
        <div key={stat.hash} className='stat'>
          <div className='name'>{stat.name}</div>
          <div className={cx('value', stat.type)}>{stat.type === 'bar' ? <div className='bar' data-value={value} style={{ width: `${value}%` }} /> : value}</div>
        </div>
      );
    }
  });

  return {
    stats,
    sockets: socketsOutput
  };
};
