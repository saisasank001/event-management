const reducer = (state = {}, action) => {
  console.log(action.payload)
  switch (action.type) {
    case 'events' :
      return {...state,...action.payload}
    case 'selectedEvent' :
      return {...state,...action.payload}
    default: return state
  }
}
export default reducer;
