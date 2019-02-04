const defaultState = {
  responses: [],
  loading: false
};

export default function groupMembersReducer(state = defaultState, action) {
  switch (action.type) {
    case 'GROUP_MEMBERS_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'GROUP_MEMBERS_LOADED':
      return {
        ...state,
        responses: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
