// Written by s235280, with contributions by s224837

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ArchivedTasks from '../../src/screens/Pages/ArchivedTasks';

// Mock dependencies
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const mockOpenDrawer = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    openDrawer: mockOpenDrawer,
  }),
}));

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
        border: '#CCCCCC'
      },
    },
  }),
}));


// Main mock for useInsightsStore
let mockStore = {};
jest.mock('../../src/store/useInsightsStore', () => () => mockStore);

describe('ArchivedTasks Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with "Archive" title and burger menu', () => {
    mockStore = {
      insights: [],
      hydrated: true,
      unarchiveTask: jest.fn(),
    };

    const { getByTestId, getByText } = render(<ArchivedTasks />);
    expect(getByTestId('burger-menu')).toBeTruthy();
    expect(getByText('Archive')).toBeTruthy();
  });

  it('shows empty state when no archived tasks exist', () => {
    mockStore = {
      insights: [{
        Id: 2,
        Title: 'Active Task',
        Description: 'This is an active task.',
        isArchived: false,
      }],
      hydrated: true,
      unarchiveTask: jest.fn(),
    };

    const { getByText } = render(<ArchivedTasks />);
    expect(getByText('No archived tasks yet.')).toBeTruthy();
  });

  it('opens drawer when burger menu is pressed', () => {
    mockStore = {
      insights: [],
      hydrated: true,
      unarchiveTask: jest.fn(),
    };

    const { getByTestId } = render(<ArchivedTasks />);
    fireEvent.press(getByTestId('burger-menu'));
    expect(mockOpenDrawer).toHaveBeenCalled();
  });

  it('calls unarchiveTask when unarchive button is pressed', () => {
    const mockUnarchive = jest.fn();
    
    mockStore = {
      insights: [{
        Id: 1,
        Title: 'Test Archived Task',
        Description: 'This is an archived task.',
        DtCreate: new Date().toISOString(),
        isArchived: true,
        isStarred: false,
      }],
      hydrated: true,
      unarchiveTask: mockUnarchive,
    };

    const { getByText } = render(<ArchivedTasks />);
    
    // Make sure the task is rendered first
    expect(getByText('Test Archived Task')).toBeTruthy();
    
    // Then find and press the unarchive button
    fireEvent.press(getByText('Unarchive'));
    expect(mockUnarchive).toHaveBeenCalledWith(1);
    });
});