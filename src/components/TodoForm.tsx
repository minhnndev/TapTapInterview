import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Priority, TodoItem} from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

import {useAppDispatch} from '../redux/store';
import {addTodo, deleteTodo, updateTodo} from '../redux/slices/todoSlice';

import IconAssets from '../assets/ic';
import PriorityButton from './PriorityButton';

const PriorityArray = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];

interface Props {
  itemInitial: TodoItem;
  onCancel: () => void;
}

export const TodoForm = ({itemInitial, onCancel}: Props) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(itemInitial.title);
  const [dueDate, setDueDate] = useState(itemInitial.dueDate);
  const [priority, setPriority] = useState(itemInitial.priority);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(dayjs(selectedDate).toISOString());
    }
  };

  const handleSubmit = () => {
    const todoData = {
      ...itemInitial,
      title: title.trim(),
      dueDate,
      priority,
    };
    if (title.trim() && dueDate) {
      if (itemInitial.id) {
        dispatch(updateTodo(todoData));
      } else {
        dispatch(addTodo(todoData));
      }
      onCancel();
    }
  };

  const handleDelete = () => {
    if (itemInitial.id) {
      dispatch(deleteTodo(itemInitial.id));
      onCancel();
    }
  };

  return (
    <View style={styles.container}>
      {itemInitial.id && (
        <TouchableOpacity
          onPress={handleDelete}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
          style={{
            padding: 8,
            alignSelf: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={IconAssets.deleteIcon}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{marginLeft: 8, color: '#1A1818'}}>Xóa</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Tiêu đề"
        value={title}
        onChangeText={setTitle}
        autoFocus
      />

      <View style={styles.flexRowBetween}>
        <Text style={styles.priorityLabel}>Thời hạn:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            {dayjs(dueDate).format('DD/MM/YYYY')}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dayjs(dueDate).toDate()}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            locale="vi"
          />
        )}
      </View>

      <View style={styles.priorityContainer}>
        <Text style={styles.priorityLabel}>Mức độ ưu tiên:</Text>
        <View style={styles.priorityButtons}>
          {PriorityArray.map(p => (
            <PriorityButton
              key={p}
              priority={p}
              active={priority === p}
              onPress={() => setPriority(p)}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Xong</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 16,
    height: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#1A1818',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  priorityContainer: {
    marginBottom: 20,
  },
  priorityLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 24,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#21AB3B',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
});
