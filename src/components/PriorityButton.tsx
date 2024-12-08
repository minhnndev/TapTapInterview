import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Priority} from '../types';
import {getPriorityColor, getPriorityTextButton} from '../utils';

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
        {backgroundColor: active ? getPriorityColor(priority) : '#E8E8E8'},
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.priorityButtonText,
          active && styles.priorityButtonTextActive,
        ]}>
        {getPriorityTextButton(priority)}
      </Text>
    </TouchableOpacity>
  );
};

export default PriorityButton;

const styles = StyleSheet.create({
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
});
