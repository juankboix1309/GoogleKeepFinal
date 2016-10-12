const notes = (state = [], action) =>{
  switch (action.type) {
    case 'ADD_NOTE':
      return [
        ...state,
        note(undefined,action)
      ];
    case 'ADD_TODO':
      return state.map(t => note(t, action));
    case 'TOGGLE_TODO':
      return state.map(t => note(t, action));
    case 'DELETE_TODO':
      return state.map(t => note(t, action));
    case 'CHANGE_COLOR':
      return state.map(t => note(t, action));
    case 'DELETE_NOTE':
      return state.map(t => note(t, action));
    case 'ARCHIVE_NOTE':
      return state.map(t => note(t, action));
    case 'SET_NOTE_VISIBILITY_FILTER':
      return state.map(t => note(t, action));
    default:
      return state;
  }
}
const note = (state = {}, action) =>{
  switch (action.type) {
    case 'ADD_NOTE':
      return {
        ...action.payload,
        todos: [],
        deleted : false,
        archived : false,
        single : true
      };
    case 'ADD_TODO':
      if(state.id === action.payload.noteId){
        if(state.todos.length>0){
          return {
          ...action.payload,
          ...state,
          todos: todos(state.todos, action),
          single: false
        };
          }
        else{
          return {
                    ...action.payload,
                    ...state,
                    todos: todos(state.todos, action),
                    single: true
                  };
        }
        
      }
    case 'SET_NOTE_VISIBILITY_FILTER':
      if(state.id === action.payload.noteId){
        return {
          ...state,
          NoteVisibilityFilter: action.payload.noteVisibilityFilter
        };
      }
    case 'CHANGE_COLOR':
      if(state.id === action.payload.noteId){
        console.log(state.id);
        console.log(action.payload.color);
        return {
          ...state,
          color: action.payload.color
        };
      } 

    case 'TOGGLE_TODO':
      if(state.id === action.payload.noteId){
        return {
          ...action.payload,
          ...state,
          todos: todos(state.todos, action)
        };
      }
    case 'DELETE_TODO':
      if(state.id === action.payload.noteId){
        return {
          ...action.payload,
          ...state,
          todos: todos(state.todos, action)
        };
      }
    case 'DELETE_NOTE':
      if(state.id === action.payload.noteId)
      {
        return {...state, 
        deleted: true
        };
      }
    case 'ARCHIVE_NOTE':
      if(state.id === action.payload.noteId)
      {
        return {
          ...action.payload,
          ...state,
          archived : true
        };
      } 
    default:
      return state;
  }
}

const todos = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    case 'DELETE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
}

const todo = (state = {}, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        ...action.payload,
        completed: false, 
        deleted : false 
      };
    case 'TOGGLE_TODO':
      if(state.id === action.payload.id){
        return {
          ...state,
          completed: !state.completed
        };
      }
    case 'DELETE_TODO':
      if(state.id === action.payload.id){
        return {
          ...state,
          deleted: true
        }
      }
    default:
      return state;
  }
}
export { notes };
