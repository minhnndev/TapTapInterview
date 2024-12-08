import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Priority, TodoItem} from '../../types';

interface TodoState {
  items: TodoItem[];
}

const initialState: TodoState = {
  items: [],
};
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{
        title: string;
        dueDate: string;
        priority: Priority;
      }>,
    ) => {
      state.items.push({
        id: new Date(Date.now()).toISOString(),
        title: action.payload.title,
        priority: action.payload.priority,
        createdAt: new Date(Date.now()).toISOString(),
        dueDate: new Date(action.payload.dueDate).toISOString(),
        completed: false,
        selected: false,
      });
      state.items.sort((a, b) => {
        const priorityOrder = {
          [Priority.HIGH]: 0,
          [Priority.MEDIUM]: 1,
          [Priority.LOW]: 2,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    },
    updateTodo: (state, action: PayloadAction<TodoItem>) => {
      const index = state.items.findIndex(
        item => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          dueDate: new Date(action.payload.dueDate).toISOString(),
        };
      }
      state.items.sort((a, b) => {
        const priorityOrder = {
          [Priority.HIGH]: 0,
          [Priority.MEDIUM]: 1,
          [Priority.LOW]: 2,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    markComplete: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        const todo = state.items.find(item => item.id === id);
        if (todo) {
          todo.completed = true;
        }
      });
    },
    markIncomplete: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        const todo = state.items.find(item => item.id === id);
        if (todo) {
          todo.completed = false;
        }
      });
    },
    toggleSelected: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.selected = !todo.selected;
      }
    },
    resetSelected: state => {
      state.items.forEach(item => {
        item.selected = false;
      });
    },
  },
});

export const {
  addTodo,
  updateTodo,
  deleteTodo,
  markComplete,
  markIncomplete,
  toggleSelected,
  resetSelected,
} = todoSlice.actions;
export default todoSlice.reducer;
