import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Priority} from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import IconAssets from '../assets/ic';

const PriorityArray = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];

const PriorityButton = ({
  priority,
  active,
  onPress,
}: {
  priority: Priority;
  active: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        active && styles.priorityButtonActive,
        {
          backgroundColor: active ? '#007AFF' : '#E8E8E8',
        },
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.priorityButtonText,
          active && styles.priorityButtonTextActive,
        ]}>
        {priority}
      </Text>
    </TouchableOpacity>
  );
};

interface Props {
  title: string;
  setTitle: (title: string) => void;
  dueDate: string;
  setDueDate: (dueDate: string) => void;
  priority: Priority;
  setPriority: (priority: Priority) => void;
  onSubmit: (title: string, dueDate: string, priority: Priority) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export const TodoForm = ({
  title,
  setTitle,
  dueDate,
  setDueDate,
  priority,
  setPriority,
  onSubmit,
  onDelete,
  onCancel,
}: Props) => {
  const handleSubmit = () => {
    if (title.trim() && dueDate) {
      onSubmit(title, dueDate, priority);
    }
  };

  return (
    <View style={styles.container}>
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
          style={{
            alignSelf: 'flex-end',
            padding: 8,
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

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 8,
        }}>
        <Text style={styles.priorityLabel}>Thời hạn:</Text>
        <DateTimePicker
          value={dayjs(dueDate).toDate()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setDueDate(dayjs(selectedDate).toISOString());
          }}
          locale="vi"
        />
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
  priorityButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderWidth: 0,
  },
  priorityButtonText: {
    color: '#000',
  },
  priorityButtonTextActive: {
    color: '#FFF',
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
});
