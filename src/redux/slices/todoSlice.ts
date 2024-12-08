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
        id: Date.now().toString(),
        title: action.payload.title,
        priority: action.payload.priority,
        createdAt: Date.now(),
        dueDate: new Date(action.payload.dueDate).toISOString(),
        completed: false,
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
    toggleComplete: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
});

export const {addTodo, updateTodo, deleteTodo, toggleComplete} =
  todoSlice.actions;
export default todoSlice.reducer;
