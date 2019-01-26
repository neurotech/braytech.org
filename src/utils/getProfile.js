import store from './reduxStore';
import * as responseUtils from './responseUtils';

import bungie from './bungie';

async function getProfile(membershipType, membershipId, characterId = false, stateCallback) {
  const state = store.getState();

  stateCallback({
    data: state.profile.data,
    characterId: characterId,
    loading: true,
    error: false
  });

  // prettier-ignore
  let [profile, milestones, groups] = await Promise.all([
    bungie.memberProfile(membershipType, membershipId, '100,104,200,202,204,205,300,301,302,303,304,305,800,900'),
    bungie.milestones(),
    bungie.memberGroups(membershipType, membershipId)
  ]);

  if (!profile || !milestones || !groups) {
    stateCallback({
      data: state.profile.data,
      characterId: characterId,
      loading: false,
      error: 'fetch'
    });
    return;
  }

  if (!profile.characterProgressions.data) {
    stateCallback({
      data: state.profile.data,
      characterId: characterId,
      loading: false,
      error: 'privacy'
    });
    return;
  }

  profile = responseUtils.profileScrubber(profile);
  groups = responseUtils.groupScrubber(groups);

  stateCallback({
    data: {
      profile,
      groups,
      milestones
    },
    characterId: characterId,
    loading: false,
    error: false
  });
}

export default getProfile;
