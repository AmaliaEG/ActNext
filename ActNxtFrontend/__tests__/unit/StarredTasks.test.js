// Written by s235280

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StarredTasks from '../../src/screens/Pages/StarredTasks';


jest.mock('react-native-vector-icons/Ionicons', () => {
  return () => null;
});

const mockOpenDrawer = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    openDrawer: mockOpenDrawer,
    navigate: mockNavigate,
  }),
}));

// Mock useTheme
jest.mock('../../src/Themes/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#E9E9E9',
        text: '#000000',
        subText: '#666666',
        cardBg: '#FFFFFF',
        shadow: '#000000',
        shadowOpacity: 0.1,
        insightBackground: '#FFFFFF',
      },
      mode: 'light',
    },
  }),
}));


jest.mock('../../src/store/useInsightsStore', () => {
  const mockStarredTask = {
    Id: 1,
    Title: 'Test Task',
    Description: 'This is a test task. It has two sentences.',
    DtCreate: new Date().toISOString(),
    isArchived: false,
    isStarred: true,
  };
  const mockNonStarredTask = {
    Id: 2,
    Title: 'Regular Task',
    Description: 'This is a regular task. It has two sentences.',
    DtCreate: new Date().toISOString(),
    isArchived: false,
    isStarred: false,
  };

  const getFirstSentence = (txt) =>
    txt.split('.').map(s => s.trim()).filter(Boolean)[0] + '.';

  const dateAssigned = new Date(mockStarredTask.DtCreate);

  return {
    __esModule: true,
    default: () => ({
      insights: [mockStarredTask, mockNonStarredTask].map(item => ({
        ...item, 
        dateAssigned,
        isOverdue: false,
        firstSentence: getFirstSentence(item.Description),
      })),
      hydrated: true,
      // Include all required methods from your actual store
      getStarStatus: jest.fn((id) => id === 1), // Only task with Id 1 is starred
      toggleStar: jest.fn(),
      loadInsights: jest.fn(),
      setInsights: jest.fn(),
      addFeedback: jest.fn(),
      getFeedback: jest.fn(),
      archiveTask: jest.fn(),
      unarchiveTask: jest.fn(),
    }),
  };
});

describe('Starred Screen', () => {
    beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header and burger menu', () => {
    const { getByTestId, getByText } = render(<StarredTasks />);
    expect(getByTestId('burger-menu')).toBeTruthy();
    expect(getByText('Favorites')).toBeTruthy();
  });

  it('renders task title, description and due date', () => {
    const { getByText } = render(<StarredTasks />);
    expect(getByText('Test Task')).toBeTruthy();
    expect(getByText('This is a test task.')).toBeTruthy();
    const dueDate = new Date().toLocaleDateString();
    expect(getByText(`Due: ${dueDate}`)).toBeTruthy();
  });

  it('navigates to details screen on task press', () => {
    const { getByText } = render(<StarredTasks />);
    fireEvent.press(getByText('Test Task'));
    expect(mockNavigate).toHaveBeenCalledWith('Details', { taskId: 1 });
  });

  it('opens drawer when burger menu is pressed', () => {
    const { getByTestId } = render(<StarredTasks />);
    fireEvent.press(getByTestId('burger-menu'));
    expect(mockOpenDrawer).toHaveBeenCalled();
  });
});
