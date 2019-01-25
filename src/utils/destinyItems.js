import React from 'react';
import cx from 'classnames';
import orderBy from 'lodash/orderBy';

import Globals from './globals';
import ObservedImage from '../components/ObservedImage';

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
  return Math.round(displayValue);
};

export const getSockets = (manifest, item, mods = true, initialOnly = false, socketExclusions = []) => {
  let statGroup = item.stats ? manifest.DestinyStatGroupDefinition[item.stats.statGroupHash] : false;
  let statModifiers = [];

  let defaultStats = [
    // weapon
    {
      hash: 2837207746,
      name: manifest.DestinyStatDefinition[2837207746].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 3614673599,
      name: manifest.DestinyStatDefinition[3614673599].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 2523465841,
      name: manifest.DestinyStatDefinition[2523465841].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 4043523819,
      name: manifest.DestinyStatDefinition[4043523819].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 1240592695,
      name: manifest.DestinyStatDefinition[1240592695].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 2762071195,
      name: manifest.DestinyStatDefinition[2762071195].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 209426660,
      name: manifest.DestinyStatDefinition[209426660].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 155624089,
      name: manifest.DestinyStatDefinition[155624089].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 943549884,
      name: manifest.DestinyStatDefinition[943549884].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 4188031367,
      name: manifest.DestinyStatDefinition[4188031367].displayProperties.name,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 1345609583,
      name: manifest.DestinyStatDefinition[1345609583].displayProperties.name,
      displayAs: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 2715839340,
      name: manifest.DestinyStatDefinition[2715839340].displayProperties.name,
      displayAs: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 3555269338,
      name: manifest.DestinyStatDefinition[3555269338].displayProperties.name,
      displayAs: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 1931675084,
      name: manifest.DestinyStatDefinition[1931675084].displayProperties.name,
      displayAs: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 925767036,
      name: manifest.DestinyStatDefinition[925767036].displayProperties.name,
      displayAs: 'int',
      modifier: 0
    },
    {
      hash: 4284893193,
      name: manifest.DestinyStatDefinition[4284893193].displayProperties.name,
      displayAs: 'int',
      modifier: 0
    },
    {
      hash: 2961396640,
      name: manifest.DestinyStatDefinition[2961396640].displayProperties.name,
      displayAs: 'int',
      modifier: 0
    },
    {
      hash: 3871231066,
      name: manifest.DestinyStatDefinition[3871231066].displayProperties.name,
      displayAs: 'int',
      modifier: 0
    },
    // armour
    {
      hash: 2996146975,
      name: manifest.DestinyStatDefinition[2996146975].displayProperties.name,
      itemType: 2,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 392767087,
      name: manifest.DestinyStatDefinition[392767087].displayProperties.name,
      itemType: 2,
      displayAs: 'bar',
      modifier: 0
    },
    {
      hash: 1943323491,
      name: manifest.DestinyStatDefinition[1943323491].displayProperties.name,
      itemType: 2,
      displayAs: 'bar',
      modifier: 0
    }
  ];

  let socketsOutput = [];

  let socketEntries = item.sockets.socketEntries;
  if (item.itemComponents && item.itemComponents.sockets) {
    mods = true;
    Object.keys(socketEntries).forEach(key => {
      socketEntries[key].singleInitialItemHash = item.itemComponents.sockets[key].plugHash || 0;
      socketEntries[key].reusablePlugItems = item.itemComponents.sockets[key].reusablePlugs || [];
      if (socketEntries[key].reusablePlugItems.length === 0 && socketEntries[key].singleInitialItemHash !== 0) {
        socketEntries[key].reusablePlugItems.push({
          plugItemHash: socketEntries[key].singleInitialItemHash
        });
      }
    });
  }

  // console.log(item);

  Object.keys(socketEntries).forEach(key => {
    let socket = socketEntries[key];

    let categoryHash = item.sockets.socketCategories.find(category => category.socketIndexes.includes(parseInt(key, 10))) ? item.sockets.socketCategories.find(category => category.socketIndexes.includes(parseInt(key, 10))).socketCategoryHash : false;

    let modCategoryHash = [3379164649, 590099826, 2685412949, 4243480345, 590099826];

    if (socketExclusions.includes(socket.singleInitialItemHash) || (!mods && modCategoryHash.includes(categoryHash))) {
      return;
    }

    // console.log(socket);

    socket.reusablePlugItems.forEach(reusablePlug => {
      let plug = manifest.DestinyInventoryItemDefinition[reusablePlug.plugItemHash];

      if (plug.hash === socket.singleInitialItemHash) {
        plug.investmentStats.forEach(modifier => {
          let index = statModifiers.findIndex(stat => stat.statHash === modifier.statTypeHash);
          if (index > -1) {
            statModifiers[index].value = statModifiers[index].value + modifier.value;
          } else {
            statModifiers.push({
              statHash: modifier.statTypeHash,
              value: modifier.value
            });
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
              <div className='description'>{plug.itemTypeDisplayName}</div>
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
              <div className='description'>{plug.itemTypeDisplayName}</div>
            </div>
          </div>
        )
      };
    }

    if (socket.singleInitialItemHash !== 0 && !socketPlugs.find(plug => plug.definition.hash === socket.singleInitialItemHash)) {
      socketPlugs.unshift(singleInitialItem);
    }

    if (!singleInitialItem && socketPlugs.length === 0) {
      return;
    }

    socketsOutput.push({
      categoryHash,
      singleInitialItem,
      plugs: socketPlugs
    });
  });

  let statsOutput = [];

  if (item.itemType === 3) {
    statGroup.scaledStats.forEach(stat => {
      let statModifier = statModifiers.find(modifier => modifier.statHash === stat.statHash);
      let statDef = manifest.DestinyStatDefinition[stat.statHash];

      // if (stat.hidden) {
      //   return;
      // }
      if (Object.keys(item.stats.stats).includes(stat.statHash.toString())) {
        let modifier = statModifier ? statModifier.value : 0;
        // if (stat.hash === 3871231066) {
        //   modifier = 0;
        // }

        let instanceStat = item.itemComponents && item.itemComponents.stats ? Object.values(item.itemComponents.stats).find(s => s.statHash === stat.statHash) : false;

        let investmentStat = item.investmentStats.find(investment => investment.statTypeHash === stat.statHash);
        let scaledStats = statGroup.scaledStats.find(scale => scale.statHash === stat.statHash);

        let interpolatatedModifier = scaledStats ? interpolate(investmentStat.value + modifier, scaledStats.displayInterpolation) : modifier;

        let value = interpolatatedModifier;
        if (stat.hash === 3871231066) {
          value = value < 1 ? 1 : value;
        }

        value = instanceStat ? instanceStat.value : value;

        statsOutput.push({
          displayAsNumeric: stat.displayAsNumeric,
          element: (
            <div key={stat.statHash} className='stat'>
              <div className='name'>{statDef.displayProperties.name}</div>
              <div className={cx('value', { bar: !stat.displayAsNumeric, int: stat.displayAsNumeric })}>{!stat.displayAsNumeric ? <div className='bar' data-value={value} style={{ width: `${value}%` }} /> : value}</div>
            </div>
          )
        });
      }
    });
  }
  if (item.itemType === 2) {
    statGroup.scaledStats.forEach(stat => {
      let statModifier = statModifiers.find(modifier => modifier.statHash === stat.statHash);
      let statDef = manifest.DestinyStatDefinition[stat.statHash];

      let modifier = statModifier ? statModifier.value : 0;

      let investmentStat = item.investmentStats.find(investment => investment.statTypeHash === stat.statHash);
      let scaledStats = statGroup.scaledStats.find(scale => scale.statHash === stat.statHash);

      // let interpolatatedModifier = scaledStats ? interpolate(investmentStat.value + modifier, scaledStats.displayInterpolation) : modifier;

      // let value = interpolatatedModifier;
      let value = Math.min((investmentStat ? investmentStat.value : 0) + modifier, scaledStats.maximumValue);

      statsOutput.push({
        element: (
          <div key={stat.statHash} className='stat'>
            <div className='name'>{statDef.displayProperties.name}</div>
            <div className={cx('value', { bar: !stat.displayAsNumeric, int: stat.displayAsNumeric })}>{!stat.displayAsNumeric ? <div className='bar' data-value={value} style={{ width: `${(value / 3) * 100}%` }} /> : value}</div>
          </div>
        )
      });
    });
  }
  
  // push numeric stats to the bottom
  statsOutput = orderBy(statsOutput, [stat => stat.displayAsNumeric], ['asc']);

  // push mods to the bottom
  socketsOutput = orderBy(socketsOutput, [socket => socket.categoryHash], ['desc']);

  return {
    stats: statsOutput,
    sockets: socketsOutput
  };
};

export const getOrnaments = (manifest, hash) => {
  let item = manifest.DestinyInventoryItemDefinition[hash];

  let ornaments = [];

  let defaultOrnamentHash = [1959648454, 2931483505];
  if (item.sockets) {
    Object.keys(item.sockets.socketEntries).forEach(key => {
      if (defaultOrnamentHash.includes(item.sockets.socketEntries[key].singleInitialItemHash)) {
        item.sockets.socketEntries[key].reusablePlugItems
          .filter(plug => !defaultOrnamentHash.includes(plug.plugItemHash))
          .forEach(plug => {
            let def = manifest.DestinyInventoryItemDefinition[plug.plugItemHash];
            ornaments.push({
              element: (
                <div key={def.hash} className={cx('plug', 'tooltip')} data-itemhash={def.hash}>
                  <ObservedImage className={cx('image', 'icon')} src={`${Globals.url.bungie}${def.displayProperties.icon}`} />
                  <div className='text'>
                    <div className='name'>{def.displayProperties.name}</div>
                    <div className='description'>Ornament</div>
                  </div>
                </div>
              )
            });
          });
      }
    });
  }

  return ornaments;
};
