import * as ls from './localStorage';
import store from './reduxStore';

const setProfile = (membershipType, membershipId, characterId = false, data, setAsDefaultProfile = false) => {
  let savedProfile = ls.get('setting.profile') ? ls.get('setting.profile') : false;
  if (setAsDefaultProfile || (savedProfile && savedProfile.membershipId === membershipId)) {
    ls.set('setting.profile', {
      membershipType: membershipType,
      membershipId: membershipId,
      characterId: characterId
    });
  }

  const state = store.getState();
  
  let now = new Date().getTime();
  let value = {
    membershipType: membershipType,
    membershipId: membershipId,
    characterId: characterId,
    data: data,
    prevData: state.profile.data,
    updated: now
  }

  store.dispatch({ type: 'SET_PROFILE', payload: value });
};

export default setProfile;
