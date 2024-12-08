import React, {useCallback, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  addTodo,
  deleteTodo,
  resetSelected,
  markComplete,
  markIncomplete,
} from '../redux/slices/todoSlice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {Priority, TodoItem as TodoItemType} from '../types';

import useKeyboardVisibility from '../hook/useKeyboardVisibility';

import TodoItem from '../components/TodoItem';
import ModalAddTodo from '../components/modal/ModalAddTodo';

export const Home = () => {
  const isKeyboardVisible = useKeyboardVisibility();

  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todo.items);
  const selectedTodos = todos.filter(todo => todo.selected);

  const [isCreateTask, setIsCreateTask] = useState(false);

  const handleAddTodo = useCallback(
    (title: string, dueDate: string, priority: Priority) => {
      const dueDateObj = new Date(dueDate).toISOString();
      dispatch(
        addTodo({
          title: title,
          priority: priority || Priority.MEDIUM,
          dueDate: dueDateObj,
        }),
      );
    },
    [dispatch],
  );

  const handleDelete = () => {
    const selectedIds = todos
      .filter(todo => todo.selected)
      .map(todo => todo.id);
    selectedIds.forEach(id => dispatch(deleteTodo(id)));

    dispatch(resetSelected());
  };

  const handleComplete = () => {
    const selectedIds = todos
      .filter(todo => todo.selected)
      .map(todo => todo.id);

    dispatch(markComplete(selectedIds));

    dispatch(resetSelected());
  };

  const handleIncomplete = () => {
    const selectedIds = todos
      .filter(todo => todo.selected)
      .map(todo => todo.id);

    dispatch(markIncomplete(selectedIds));

    dispatch(resetSelected());
  };

  const handleToggleComplete = () => {
    const selectedTask = todos.filter(todo => todo.selected);
    const allCompleted = selectedTask.every(todo => todo.completed);

    if (allCompleted) {
      handleIncomplete();
    } else {
      handleComplete();
    }
  };

  const renderItem = useCallback(
    ({item, index}: {item: TodoItemType; index: number}) => (
      <TodoItem
        item={item}
        index={index}
        onDelete={() => dispatch(deleteTodo(item.id))}
      />
    ),
    [dispatch],
  );

  const renderActionButtons = (selectedCount: number) => (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity
        style={[styles.addButton, styles.deleteButton]}
        onPress={handleDelete}>
        <Text style={styles.addButtonText}>{`Xoá ${selectedCount} task`}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.addButton, styles.completeButton]}
        onPress={handleToggleComplete}>
        <Text
          style={
            styles.addButtonText
          }>{`Hoàn thành ${selectedCount} task`}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCreateTaskButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => {
        // Uncomment this line to create a new task with random data test
        // handleAddTodo(
        //   `Task ${todos.length + 1}`,
        //   `2025-01-${Math.floor(Math.random() * 20)}`,
        //   Priority.MEDIUM,
        // );
        setIsCreateTask(true);
      }}>
      <Text style={styles.addButtonText}>+ Tạo task mới</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>To-do list</Text>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        // ListHeaderComponent={() => (
        //   <>
        //     {isCreateTask && (
        //       <TodoForm
        //         itemInitial={{
        //           id: '',
        //           title: '',
        //           dueDate: new Date().toISOString(),
        //           priority: Priority.MEDIUM,
        //           completed: false,
        //           createdAt: new Date().toISOString(),
        //         }}
        //         onCancel={() => setIsCreateTask(false)}
        //       />
        //     )}
        //   </>
        // )}
      />

      {!isKeyboardVisible && (
        <View style={styles.buttonContainer}>
          {selectedTodos.length > 0
            ? renderActionButtons(selectedTodos.length)
            : renderCreateTaskButton()}
        </View>
      )}

      <ModalAddTodo
        visible={isCreateTask}
        onClose={() => setIsCreateTask(false)}
        onSubmit={handleAddTodo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7cc15',
  },
  header: {
    fontSize: 24,
    fontWeight: 'medium',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 16,
  },
  actionButtonsContainer: {
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    borderRadius: 48,
    padding: 16,
    backgroundColor: '#FF4081',
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#757575',
  },
  completeButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
