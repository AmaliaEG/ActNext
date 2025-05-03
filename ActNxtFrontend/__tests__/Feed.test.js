import Feed from '../src/screens/mainPage/Feed';
import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import MockTasks from '../src/screens/mainPage/JSON_Mockdata.json';

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

// Helper function
const getTheFirstSentence = (description) => {
    if (!description) return '';
    const sentences = description.split('.');
    return sentences[0].trim() + (sentences.length > 1 ? '.' : '');
};

describe('Feed', () => {
    it('shows overdue warning if task is overdue', () => {
        const { queryAllByText } = render(<Feed />);

        const overdueTask = MockTasks.find(task => new Date(task.DtCreate) < new Date());
        if (overdueTask) {
            const overdueWarnings = queryAllByText('Overdue!');
            expect(overdueWarnings.length).toBeGreaterThan(0);
        }
    });

    it('renders task title, description, and due date', () => {
        const { getAllByText } = render(<Feed />);
        const firstTask = MockTasks
            .map(task => ({...task, dateAssigned: new Date(task.DtCreate) }))
            .sort((a, b) => a.dateAssigned - b.dateAssigned)[0];

        const expectedDate = `Due: ${firstTask.dateAssigned.toLocaleDateString()}`;
        
        expect(getAllByText(firstTask.Title)).toBeTruthy();
        expect(getAllByText(getTheFirstSentence(firstTask.Description))).toBeTruthy();
        expect(getAllByText(expectedDate).length).toBeGreaterThan(0);
    });
    
    // User Interaction tests
    it('navigates to task details on press', () => {
        const { getAllByText } = render(<Feed />);
        const firstTask = MockTasks
            .map(task => ({...task, dateAssigned: new Date(task.DtCreate) }))
            .sort((a, b) => a.dateAssigned - b.dateAssigned)[0];
        
        fireEvent.press(getAllByText(firstTask.Title)[0]);
        expect(mockNavigate).toHaveBeenCalledWith('Details', { taskId: firstTask.Id });
    });
    
    it('opens drawer on burger menu press', () => {
        const { getByTestId } = render(<Feed />);
        const menuIcon = getByTestId('burger-menu');
    
        fireEvent.press(menuIcon);
        expect(mockOpenDrawer).toHaveBeenCalled();
    });
    
});