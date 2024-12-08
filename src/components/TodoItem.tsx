import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {useAppDispatch} from '../redux/store';
import {toggleSelected} from '../redux/slices/todoSlice';

import {getDueDateText, getPriorityColor, getPriorityText} from '../utils';

import {TodoItem as TodoItemType} from '../types';
import IconAssets from '../assets/ic';
import {TodoForm} from './TodoForm';

const {width} = Dimensions.get('window');

interface Props {
  item: TodoItemType;
  onPress?: () => void;
  onDelete?: () => void;
  index: number;
}

const TodoItem: React.FC<Props> = ({item, onDelete, index}) => {
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);

  const translateX = useSharedValue(width);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const deleteProgress = useSharedValue(0);

  useEffect(() => {
    const delay = index * 100;
    setTimeout(() => {
      translateX.value = withSpring(0, {
        damping: 12,
        stiffness: 90,
      });
      opacity.value = withSpring(1);
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 90,
      });
    }, delay);
  }, [index, opacity, scale, translateX]);

  const handleDelete = () => {
    deleteProgress.value = withTiming(
      1,
      {
        duration: 300,
      },
      finished => {
        if (finished) {
          runOnJS(onDelete)();
        }
      },
    );
  };

  const animatedStyle = useAnimatedStyle((): any => {
    const slideOut = interpolate(
      deleteProgress.value,
      [0, 1],
      [0, -width],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        {translateX: translateX.value + slideOut},
        {scale: scale.value},
      ],
      opacity: opacity.value,
    };
  });

  return isEditing ? (
    <TodoForm itemInitial={item} onCancel={() => setIsEditing(false)} />
  ) : (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onLongPress={handleDelete} style={styles.content}>
        <CheckBox
          disabled={false}
          boxType="square"
          tintColor="#757575"
          onTintColor="#4CAF50"
          onCheckColor="#4CAF50"
          animationDuration={0}
          value={item.selected}
          onValueChange={() => dispatch(toggleSelected(item.id))}
          style={styles.checkbox}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text
            style={[
              styles.priority,
              {
                color: item.completed
                  ? '#007AFF'
                  : getPriorityColor(item.priority),
              },
            ]}>
            {item.completed ? 'Đã xong' : getPriorityText(item.priority)}
          </Text>
        </View>
        <View style={{gap: 16, alignItems: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}>
            <Image source={IconAssets.editIcon} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.dueDate}>{getDueDateText(item.dueDate)}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 16,
    height: 16,
  },
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
  content: {
    flexDirection: 'row',
  },
  checkbox: {
    alignSelf: 'flex-start',
    width: 24,
    height: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  priority: {
    fontSize: 12,
  },
  dueDate: {
    fontSize: 12,
    color: '#757575',
  },
});

export default TodoItem;
