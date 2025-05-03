import TaskExpansion from '../src/screens/mainPage/TaskExpansion';
import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import MockTasks from '../src/screens/mainPage/JSON_Mockdata.json';
import { StyleSheet } from 'react-native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

// Mock Ionicons to prevent rendering issues
jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => null,
}));

describe('TaskExpansion', () => {
    const testTask = MockTasks[0];
    const route = { params: { taskId: testTask.Id } };

    it('renders task details correctly', async () => {
        const { findByText } = render(<TaskExpansion route={route} />);
        expect(await findByText(testTask.Description)).toBeTruthy();
        expect(await findByText('Finished')).toBeTruthy();
    });

    it('toggles like and dislike buttons', () => {
        const { getByTestId } = render(<TaskExpansion route={route} />);
        const likeBtn = getByTestId('like-button');
        const dislikeBtn = getByTestId('dislike-button');

        fireEvent.press(likeBtn);
        fireEvent.press(dislikeBtn); // Should remove like and se dislike
        fireEvent.press(likeBtn); 
        fireEvent.press(likeBtn);
    });

    it('navigates to Feed when "Finished" is pressed', () => {
        const { getByText } = render(<TaskExpansion route={route} />);
        fireEvent.press(getByText('Finished'));
        expect(mockNavigate).toHaveBeenCalledWith('Feed');
    });

    it('displays the correct group label and color', () => {
        const { getByText, getByTestId } = render(<TaskExpansion route={route} />);
        expect(getByText('Win Back Plan')).toBeTruthy(); // testing for group 1
        const colorCircle = getByTestId('color-circle');
        const flatStyle = StyleSheet.flatten(colorCircle.props.style);
        expect(flatStyle.backgroundColor).toBe('#E862AE');
    });

    it('shows loading state id task not found', () => {
        const badRoute = { params: { taskId: 'nonexistent' } };
        const { getByText } = render(<TaskExpansion route={badRoute} />);
        expect(getByText('Loading...')).toBeTruthy();
    })
});