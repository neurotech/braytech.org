export default function vendorsReducer(state = false, action) {
  switch (action.type) {
    case 'SET_VENDORS':
      return action.payload;
    default:
      return state;
  }
}
