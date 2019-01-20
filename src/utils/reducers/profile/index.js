import * as ls from '../../localStorage';

const savedProfile = ls.get('setting.profile') ? ls.get('setting.profile') : false;
const defaultState = {
  membershipType: savedProfile ? savedProfile.membershipType : false,
  membershipId: savedProfile ? savedProfile.membershipId : false,
  characterId: false,
  data: false,
  prevData: false,
  updated: undefined
}

export default function profileReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      if (state.prevData !== action.payload.data) {
        let now = new Date().getTime();
        action.payload.updated = now;
      }
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}