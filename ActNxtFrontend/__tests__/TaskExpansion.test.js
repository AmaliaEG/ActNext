import TaskExpansion from '../src/screens/mainPage/TaskExpansion';
import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
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

jest.mock('../src/store/useInsightsStore', () => ({
    __esModule: true,
    default: () => ({
        insights: [
            {
                Id: '1',
                Title: 'Mock Task Title',
                CompanyName: 'Mock Company',
                SalesAnalysisId: 1,
                Description: 'Mock task description',
                DtCreate: '2024-05-01T00:00:00.007'
            }
        ],
        addFeedback: jest.fn(),
        queuedFeedback: [],
    }),
}));

describe('TaskExpansion', () => {
    const route = { params: { taskId: '1' } };

    it('renders task details correctly', async () => {
        const { findByText } = render(<TaskExpansion route={route} />);
        expect(await findByText('Mock task description')).toBeTruthy();
        expect(await findByText('Finished')).toBeTruthy();
    });

    it('toggles like and dislike buttons', () => {
        const { getByTestId } = render(<TaskExpansion route={route} />);
        const likeBtn = getByTestId('like-button');
        const dislikeBtn = getByTestId('dislike-button');

        fireEvent.press(likeBtn);
        fireEvent.press(dislikeBtn); // Should remove like and set dislike
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