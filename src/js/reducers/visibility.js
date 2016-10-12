const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch(action.type){
    case 'SET_VISIBILITY_FILTER':
      return action.payload.visibilityFilter;
    default:
      return state;
  }
}
const notesVisibilityFilter = (state = 'SHOW_ALL_NOTES', action) => {
	switch(action.type){
		case 'SET_NOTE_FILTER':
			return action.payload.notesVisibilityFilter;
		default:
			return state;

	}
}

export { visibilityFilter, notesVisibilityFilter };