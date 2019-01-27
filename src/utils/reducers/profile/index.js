import * as ls from '../../localStorage';

const savedProfile = ls.get('setting.profile') ? ls.get('setting.profile') : false;
const defaultState = {
  membershipType: savedProfile ? savedProfile.membershipType : false,
  membershipId: savedProfile ? savedProfile.membershipId : false,
  characterId: false,
  data: false,
  prevData: false,
  loading: false,
  error: false,
  updated: undefined
};

export default function profileReducer(state = defaultState, action) {
  switch (action.type) {
    case 'CHARACTER_CHOSEN':
      return {
        ...state,
        characterId: action.payload
      };
    case 'PROFILE_LOADING':
      return {
        ...state,
        loading: true,
        error: false,
        membershipId: action.payload.membershipId,
        membershipType: action.payload.membershipType
      };
    case 'PROFILE_LOADED':
      if (state.prevData !== action.payload) {
        action.payload.update = new Date().getTime();
      }
      return {
        ...state,
        data: action.payload,
        prevData: state.data,
        loading: false,
        error: false
      };
    case 'PROFILE_LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
