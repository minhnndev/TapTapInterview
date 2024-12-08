import React, {useCallback, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import TodoItem from '../components/TodoItem';
import {addTodo, deleteTodo} from '../redux/slices/todoSlice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {Priority, TodoItem as TodoItemType} from '../types';
import {TodoForm} from '../components/TodoForm';

export const Home = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todo.items);

  const [isCreateTask, setIsCreateTask] = useState(false);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>(new Date().toDateString());
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);

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

  const renderItem = useCallback(
    ({item, index}: {item: TodoItemType; index: number}) => (
      <TodoItem
        item={item}
        index={index}
        onDelete={() => handleDeleteTodo(item.id)}
      />
    ),
    [handleDeleteTodo],
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
        ListHeaderComponent={() => (
          <>
            {isCreateTask && (
              <TodoForm
                title={title}
                setTitle={setTitle}
                dueDate={dueDate}
                setDueDate={setDueDate}
                priority={priority}
                setPriority={setPriority}
                onSubmit={(title, dueDate, priority) => {
                  handleAddTodo(title, dueDate, priority);
                  setTitle('');
                  setDueDate(new Date().toDateString());
                  setPriority(Priority.MEDIUM);
                  setIsCreateTask(false);
                }}
                onDelete={() => {}}
                onCancel={() => setIsCreateTask(false)}
              />
            )}
          </>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // handleAddTodo(
          //   `Task ${todos.length + 1}`,
          //   '2025-01-17',
          //   Priority.MEDIUM,
          // );
          setIsCreateTask(true);
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
