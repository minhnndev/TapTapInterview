import React, {useCallback} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import TodoItem from '../components/TodoItem';
import {addTodo, deleteTodo, updateTodo} from '../redux/slices/todoSlice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {Priority, TodoItem as TodoItemType} from '../types';

export const Home = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todo.items);

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

  const handleDeleteTodo = useCallback(
    (id: string) => {
      dispatch(deleteTodo(id));
    },
    [dispatch],
  );

  const updatePriority = useCallback(
    (item: TodoItemType) => {
      const priorities = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];
      const currentIndex = priorities.indexOf(item.priority);
      const nextPriority = priorities[(currentIndex + 1) % priorities.length];
      dispatch(updateTodo({...item, priority: nextPriority}));
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({item, index}: {item: TodoItemType; index: number}) => (
      <TodoItem
        item={item}
        index={index}
        onPress={() => updatePriority(item)}
        onDelete={() => handleDeleteTodo(item.id)}
      />
    ),
    [handleDeleteTodo, updatePriority],
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
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          handleAddTodo(
            `Task ${todos.length + 1}`,
            '2025-01-17',
            Priority.MEDIUM,
          );
        }}>
        <Text style={styles.addButtonText}>Tạo task mới +</Text>
      </TouchableOpacity>
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FF4081',
    borderRadius: 48,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
