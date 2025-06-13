import Feed from '../src/screens/Pages/Feed';
import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";


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
const firstSentence = txt =>
    txt.split('.').map(s => s.trim()).filter(Boolean)[0] + '.';


jest.mock('../src/store/useInsightsStore', () => {
    const rawInsights = require('../src/screens/mainPage/JSON_Mockdata.json');

    const processedInsights = rawInsights.map(t => {
        const dateAssigned = new Date(t.DtCreate);
        return {
            ...t,
            dateAssigned,
            isOverdue: dateAssigned < new Date(),
            firstSentence: firstSentence(t.Description),
        };
    });

    return {
        __esModule: true,
        default: () => ({
            hydrated: true,
            insights: processedInsights,
            setInsights: jest.fn(),
        }),
    };
});

const getMockedStore = () => require('../src/store/useInsightsStore').default();


// TESTS FOR Feed
describe('Feed', () => {
    it('shows an "Overdue!" label for overdue tasks', () => {
        const { queryAllByText } = render(<Feed />);
        const overdueBadges = queryAllByText('Overdue!');
        expect(overdueBadges.length).toBeGreaterThan(0);
    });

    it('renders without crashing', () => {
        const { getByTestId } = render(<Feed />);
        expect(getByTestId('burger-menu')).toBeTruthy();
    });

    it('renders task title, description, and due-date text', () => {
        const firstTask = getMockedStore().insights[0];
        const expectedDate = `Due: ${firstTask.dateAssigned.toLocaleDateString()}`;
        
        const { getAllByText } = render(<Feed />);
        expect(getAllByText(firstTask.Title)).toBeTruthy();
        expect(getAllByText(firstSentence(firstTask.Description))).toBeTruthy();
        expect(getAllByText(expectedDate).length).toBeGreaterThan(0);
    });
    
    // User Interaction tests
    it('navigates to details screen when a task is pressed', () => {
        const firstTask = getMockedStore().insights[0];
        const { getByText } = render(<Feed />);
        fireEvent.press(getByText(firstTask.Title));
        expect(mockNavigate).toHaveBeenCalledWith('Details', { taskId: firstTask.Id });
    });
    
    it('opens the drawer when burger menu is pressed', () => {
        const { getByTestId } = render(<Feed />);
        const menuIcon = getByTestId('burger-menu');
        fireEvent.press(menuIcon);
        expect(mockOpenDrawer).toHaveBeenCalled();
    });
    
});