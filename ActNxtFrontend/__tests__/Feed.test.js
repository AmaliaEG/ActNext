import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Feed from '../src/screens/Pages/Feed';


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
jest.mock('../src/Themes/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#E9E9E9',
        text: '#000000',
        subText: '#666666',
        cardBg: '#FFFFFF',
        shadow: '#000000',
        shadowOpacity: 0.1,
      },
      mode: 'light',
    },
  }),
}));


jest.mock('../src/store/useInsightsStore', () => {
  const mockTask = {
    Id: 1,
    Title: 'Test Task',
    Description: 'This is a test task. It has two sentences.',
    DtCreate: new Date().toISOString(),
    isArchived: false,
  };

  const getFirstSentence = (txt) =>
    txt.split('.').map(s => s.trim()).filter(Boolean)[0] + '.';

  const dateAssigned = new Date(mockTask.DtCreate);

  return {
    __esModule: true,
    default: () => ({
      insights: [{
        ...mockTask,
        dateAssigned,
        isOverdue: false,
        firstSentence: getFirstSentence(mockTask.Description),
      }],
      setInsights: jest.fn(),
      hydrated: true,
    }),
  };
});

describe('Feed Screen', () => {
  it('renders header and burger menu', () => {
    const { getByTestId, getByText } = render(<Feed />);
    expect(getByTestId('burger-menu')).toBeTruthy();
    expect(getByText('Insights')).toBeTruthy();
  });

  it('renders task title, description and due date', () => {
    const { getByText } = render(<Feed />);
    expect(getByText('Test Task')).toBeTruthy();
    expect(getByText('This is a test task.')).toBeTruthy();
    const dueDate = new Date().toLocaleDateString();
    expect(getByText(`Due: ${dueDate}`)).toBeTruthy();
  });

  it('navigates to details screen on task press', () => {
    const { getByText } = render(<Feed />);
    fireEvent.press(getByText('Test Task'));
    expect(mockNavigate).toHaveBeenCalledWith('Details', { taskId: 1 });
  });

  it('opens drawer when burger menu is pressed', () => {
    const { getByTestId } = render(<Feed />);
    fireEvent.press(getByTestId('burger-menu'));
    expect(mockOpenDrawer).toHaveBeenCalled();
  });
});
