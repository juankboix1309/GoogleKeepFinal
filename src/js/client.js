import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';
import expect from 'expect';
import '../styles/index.scss';

import v4 from 'uuid-v4';
import {  notes } from './reducers/todos';
import { visibilityFilter, notesVisibilityFilter } from './reducers/visibility';
import undoable from "redux-undo";
import { ActionCreators} from "redux-undo";
const { Component } = React;

const todoApp = combineReducers({
  notes,
  visibilityFilter, 
  notesVisibilityFilter
});

const loadState = () => {
  try{
    let result = JSON.parse(localStorage.getItem('state'));; 
    return result ? result : undefined;
  }catch(err){
    return undefined;
  }
}
const saveState = (state) => {
  try{
    localStorage.setItem('state', JSON.stringify(state));
  }catch(err){

  }
}

const store = createStore(undoable(todoApp), loadState());

const FilterLink = ({ visibilityFilter, currentVisibilityFilter, onFilterClicked, children }) => {

  if(visibilityFilter === currentVisibilityFilter){
    return <strong>{ children }</strong>;
  }

  return <a
    href="#"
    onClick={
      (e) => {
        e.preventDefault();
        onFilterClicked(visibilityFilter);
      }
    }>
    { children }</a>
}
const getVisibleNotes = (notes, notesVisibilityFilter) => {
  if(notesVisibilityFilter === 'SHOW_ALL_NOTES'){
    return notes.filter(n => !n.deleted).filter(n => !n.archived);
    
  }
  else if(notesVisibilityFilter === 'SHOW_ALL_ARCHIVED'){
    return notes.filter(n => n.archived).filter(n => !n.deleted);
  }
  else if(notesVisibilityFilter === 'SHOW_ALL_SINGLES'){
    return notes.filter(n => n.single).filter(n => !n.deleted);
  }
  else if(notesVisibilityFilter === 'SHOW_ALL_LISTS'){
    return notes.filter(n => !n.single).filter(n => !n.deleted);
  }
}

const getVisibleTodos = (todos, visibilityFilter) => {
  console.log(todos.filter(t => !t.completed).filter(t => !t.deleted));
  if(visibilityFilter === 'SHOW_ALL'){
    return todos.filter(t => !t.deleted);
  }

  else if(visibilityFilter === 'SHOW_COMPLETED'){
    console.log(todos.filter(t => !t.completed).filter(t => !t.deleted));
    return todos.filter(t => t.completed).filter(t => !t.deleted);
  }

  else if(visibilityFilter === 'SHOW_ACTIVE'){
    console.log(todos.filter(t => !t.completed).filter(t => !t.deleted));
    return todos.filter(t => !t.completed).filter(t => !t.deleted);
  }

}



const Todo = ({ text, completed, onTodoClicked, onTodoDeleted,  id }) => (
  <div>
  <li class = "item"
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
    onClick={ onTodoClicked }>
    { text }
    
      </li>
      <button
      onClick={ onTodoDeleted}
      >Delete</button>
  </div>
  
);

const Note = ({ text, color }) => (
  <div class = "note"style={{ background : color}}>
  <li>
    { text }
  </li>
  </div>
);

const TodoList = ({ todos, onTodoClicked, onTodoDeleted, noteId }) => (
  <ul>
    {
      todos.map(todo => 
      (
        <Todo
          key={ todo.id }
          { ...todo }
          onTodoClicked={ () => onTodoClicked(todo, noteId) }
          onTodoDeleted={ () => onTodoDeleted(todo, noteId)}
        />
      ))
    }
  </ul>
);

const NotesList = ({ notes, onAddTodo, onFilterClicked, onTodoClicked, onTodoDeleted, visibilityFilter, onNoteDeleted, onVfChanged, onColorChanged, onNoteArchived }) => (
  <ul>
    {
      notes.map
      (
            note => (
        
              
        <div
          key={ note.id } class= "BigNote" style={{ background : note.color}} >
            <Note
              text={ note.text } 
              color={note.color}
               />
            <TodoList
              todos={ getVisibleTodos( note.todos, note.NoteVisibilityFilter ) }
              onTodoClicked={ onTodoClicked }
              onTodoDeleted={ onTodoDeleted}
              noteId={ note.id } />
            <AddTodo
              onAddTodo={ onAddTodo }
              onNoteDeleted={onNoteDeleted}
              onColorChanged={onColorChanged}
              onVfChanged={onVfChanged}
              onNoteArchived={onNoteArchived}
              noteId={ note.id } >Add Item</AddTodo> 
        </div>
                    )
            )
    }
  </ul>
);

const AddTodo = ({ onNoteArchived, onNoteDeleted, onColorChanged, onVfChanged, onFilterChange, onAddTodo, children, noteId }) => {
  let input;
  let color;
  let vF;
  return (
    <div>
      <input type="text" ref={ node => input = node } />
     
      <button
        onClick={
          () => {
          onNoteDeleted(noteId);
        }
      }
      >Delete</button>
      <button
        onClick={
          () => {
            onNoteArchived(noteId);
          }
        }
        >Archive</button>
      <button
        onClick={
          () => { 
            onAddTodo(input.value, noteId);
            input.value = "";
          }
        }
      >{ children }</button> 
      <select ref={ node2 => color = node2 } 
        onChange={
          () => {
            console.log(color.value);
            onColorChanged(noteId, color.value);
          }
        }>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="yellow">Yellow</option>
      </select>

      <select ref={ node3 => vF = node3 } 
        onChange={
          () => {
            console.log(vF.value);
            onVfChanged(noteId, vF.value);
          }
        }>
        <option value="SHOW_ALL">Show all</option>
        <option value="SHOW_COMPLETED">Show completed</option>
        <option value="SHOW_ACTIVE">Show active</option>
        
      </select>

    </div>
  );
}

const AddNote = ({ onAddNote, children }) => {
  let input;
  let color;
  return (
    <div>
      <input type="text" ref={ node => input = node } />
      <select ref={ node2 => color = node2 }>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="yellow">Yellow</option>
      </select>
      <button
        onClick={
          () => { 
            onAddNote(input.value, color.value);
            input.value = "";
            color.value = "green";
          }
        }
      >{ children }</button>
    </div>
  );
}
const Footer = ({ currentNotesVisibilityFilter, onNoteFilterClicked, currentVisibilityFilter, onFilterClicked }) => (
  <div>
    
    <button
      onClick={

        () => {onNoteFilterClicked('SHOW_ALL_SINGLES')}
      }
      >Notes</button>
      <button
      onClick={

        () => {onNoteFilterClicked('SHOW_ALL_LISTS')}
      }
      >Lists</button>
    <button
      onClick={

        () => {onNoteFilterClicked('SHOW_ALL_ARCHIVED')}
      }
      >Archived</button>
    <button
      onClick={

        () => {onNoteFilterClicked('SHOW_ALL_NOTES')}
      }
      >Not Archived</button>
      <button 
        onClick={ 
          () => { store.dispatch(ActionCreators.undo());}
        }
        >Undo</button>

  </div>
);

const TodosApp = ({ notes, todos, visibilityFilter, notesVisibilityFilter }) => (
  <div>
    <AddNote
      onAddNote={
        (text, color) => {
          store.dispatch({
            type: 'ADD_NOTE',
            payload: {
              id: v4(),
              text, 
              color,
              created : Date(),
              modified : Date(),
              NoteVisibilityFilter: "SHOW_ALL"
            }
          });
        }
      }>Add Note</AddNote>

    <NotesList 
      notes={getVisibleNotes(notes, notesVisibilityFilter)}

      visibilityFilter={ visibilityFilter }
      onAddTodo={
          (text,noteId) => {
            store.dispatch({
              type: 'ADD_TODO',
              payload: {
                id: v4(),
                text,
                noteId: noteId,
                modified:  Date(),
              }
            });
          }
        }
      onNoteDeleted={
        (noteId) => {
          store.dispatch({
            type: 'DELETE_NOTE',
            payload: {
              noteId: noteId
            }});
        }
      }
      onColorChanged={
        (noteId, color) => {
          store.dispatch({
            type: 'CHANGE_COLOR',
            payload: {
              noteId: noteId,
              color: color,
              modified: Date()
            }
          });
        }
      }
      onNoteArchived={
        (noteId) => {
          store.dispatch({
            type: 'ARCHIVE_NOTE',
            payload: {
              noteId: noteId,
              modified: Date()
            }});
        }
      }
      onTodoClicked={
        (todo, noteId) => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            payload: {
              id: todo.id,
              noteId: noteId,
              modified: Date()
            }
          });
       }
      }
      onTodoDeleted={
        (todo, noteId) => {
          store.dispatch({
            type: 'DELETE_TODO',
            payload: {
              id: todo.id,
              noteId: noteId,
              modified: Date()
            }
          });
       }
      }
      onVfChanged={
        (noteId, filter) => {
          store.dispatch({
            type: 'SET_NOTE_VISIBILITY_FILTER',
            payload: { 
              noteId: noteId,
              noteVisibilityFilter: filter,
              modified: Date() 
            }
          });
        }
      } />
  
    <Footer
      currentVisibilityFilter={ visibilityFilter }
      currentNotesVisibilityFilter={notesVisibilityFilter}
      onFilterClicked={
        (filter) => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            payload: { visibilityFilter: filter }
          });
        }
      }
      onNoteFilterClicked={
        (noteFilter) => {
          store.dispatch({
            type: 'SET_NOTE_FILTER',
            payload: { notesVisibilityFilter: noteFilter }
          });
        }
      } />

  </div>
);


const render = () => {
  console.log(store.getState());
  ReactDOM.render(
    <TodosApp
      { ...store.getState().present } />,
    document.getElementById('root')
  );
};

render();
store.subscribe(render);

store.subscribe(() => {
  saveState(store.getState());
});
