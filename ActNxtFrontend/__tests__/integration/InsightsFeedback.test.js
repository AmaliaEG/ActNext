// Written by s224837

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TaskExpansion from "../../src/screens/Pages/TaskExpansion";
import useInsightStore from "../../src/store/useInsightsStore";

jest.mock('@expo/vector-icons/Ionicons', () => () => null);
jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => null,
}));

jest.mock('../../src/Themes/ThemeContext', () => ({
    useTheme: () => ({
        theme: {
            colors: {
                text: '#000000',
                background: '#E9E9E9',
                itemTextColor: '#FFFFFF',
            },
        },
    }),
}));

jest.mock('@react-navigation/native', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
        NavigationContainer: ({ children }) => <View>{children}</View>,
    };
});

const mockInsights = [
    { 
        Id: 1, 
        Title: 'Insight 1', 
        firstSentence: 'This is the first insight.',
        Description: 'This is the first insight. It helps me do the test.',
        dateAssigned: '2025-06-01',
        feedback: null 
    },
    { 
        Id: 2, 
        Title: 'Insight 2', 
        firstSentence: 'This is the second insight.',
        Description: 'This is the second insight. It helps me do the test.',
        dateAssigned: '2025-06-02',
        feedback: null 
    },
    { 
        Id: 3, 
        Title: 'Insight 3', 
        firstSentence: 'This is the third insight.',
        Description: 'This is the third insight. It helps me do the test.',
        dateAssigned: '2025-06-03',
        feedback: null 
    },
];

describe('Insight feedback flow', () => {
    beforeEach(() => {
        useInsightStore.setState({
            insights: mockInsights,
            hydrated: true,
            queuedFeedback: [],
            addFeedback: jest.fn((id, type) => {
                useInsightStore.setState((prev) => {
                    const updated = prev.insights.map((insight) => {
                        if (insight.Id === id) {
                            const feedback =
                                type === 'like' ? { liked: true } :
                                type === 'dislike' ? { disliked: true } :
                                null;
                            return { ...insight, feedback };
                        }
                        return insight;
                    });
                    return { insights: updated };
                });
            }),
        });
    });

    it('marked insight as liked when like button is pressed', () => {
        const { getByTestId } = render(<TaskExpansion route={{ params: { taskId: 1} }}/>);

        // Like it
        fireEvent.press(getByTestId('like-button'));

        const updated = useInsightStore.getState().insights.find((i) => i.Id === 1);
        expect(updated.feedback).toEqual({ liked: true });
    });

    it('marked insight as disliked when like button is pressed', () => {
        const { getByTestId } = render(<TaskExpansion route={{ params: { taskId: 1} }}/>);

        // Dislike it
        fireEvent.press(getByTestId('dislike-button'));

        const updated = useInsightStore.getState().insights.find((i) => i.Id === 1);
        expect(updated.feedback).toEqual({ disliked: true });
    });
});