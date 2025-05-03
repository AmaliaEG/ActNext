import Feed from '../src/screens/mainPage/Feed';
import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import MockTasks from '../src/screens/mainPage/MockTasks.json';
import { useNavigation } from '@react-navigation/native';

// Making mock navigation from the navigations used in Feed.js
const mockOpenDrawer = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-native-vector-icons/Ionicons', () => {
    return () => null;
});

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        openDrawer: mockOpenDrawer,
        navigate: mockNavigate,
    }),
}));

const getTheFirstSentence = (description) => {
    if (!description) return '';

    const sentences = description.split('.');
    return sentences[0].trim() + (sentences.length > 1 ? '.' : '');
};

describe('Feed', () => {
    it('shows overdue warning if task is overdue', () => {
        const { queryByText } = render(<Feed />);
        const overdueTask = MockTasks.find(task => new Date(task.dateAssigned) < new Date());
        
        if (overdueTask) {
            expect(queryByText('Overdue!')).toBeTruthy();
        }
    });

    it('renders task title, description, and due date', () => {
        const { getByText } = render(<Feed />);
        const firstTask = MockTasks
            .map(task => ({...task, dateAssigned: new Date(task.dateAssigned) }))
            .sort((a, b) => a.dateAssigned - b.dateAssigned)[0];

        const expectedDate = `Due: ${firstTask.dateAssigned.toLocaleDateString()}`;
        
        expect(getByText(firstTask.title)).toBeTruthy();
        expect(getByText(getTheFirstSentence(firstTask.description))).toBeTruthy();
        expect(getByText(expectedDate)).toBeTruthy();
    });
    
    // User Interaction tests
    it('navigates to task details on press', () => {
        const { getByText } = render(<Feed />);
        const firstTask = MockTasks.sort((a, b) => new Date(a.dateAssigned) - new Date(b.dateAssigned))[0];
        
        fireEvent.press(getByText(firstTask.title));
        expect(mockNavigate).toHaveBeenCalledWith('Details', { taskId: firstTask.id });
    });
    
    it('opens drawer on burger menu press', () => {
        const { getByTestId } = render(<Feed />);
        const menuIcon = getByTestId('burger-menu');
    
        fireEvent.press(menuIcon);
        expect(mockOpenDrawer).toHaveBeenCalled();
    });
    
});