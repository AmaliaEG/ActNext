import { waitFor } from "@testing-library/react-native";
import useInsightsStore from "../../src/store/useInsightsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";


// MOCK
jest.mock(
    '../../src/screens/Pages/JSON_Mockdata.json',
    () => ([]),
    { virtual: true }
);

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn().mockResolvedValue(null),
    getItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null)
}));

const baseInsights = [
    { Id: 1, title: 'Insight 1', feedback: null },
    { Id: 2, title: 'Insight 2', feedback: null },
];

const rawHelpers = [
    {
        Id: 99,
        Description: 'Hello world. Second Sentence.',
        DtCreate: '2050-01-01 08:30',
    }
];

beforeEach(() => {
    jest.clearAllMocks();
    useInsightsStore.setState({
        insights: [],
        queuedFeedback: [],
        hydrated: false,
    });
});

// TESTS FOR useInsightsStore
describe('useInsightsStore', () => {
    // Hydrate from AsyncStorage
    it('hydrates from AsyncStorage', async () => {
        AsyncStorage.getItem.mockImplementation(async key =>
            key === 'insights' ? JSON.stringify(baseInsights) : null
        );

        await useInsightsStore.getState().loadInsights();

        await waitFor(() => 
            expect(useInsightsStore.getState().hydrated).toBe(true)
        );

        await waitFor(() => 
            expect(useInsightsStore.getState().insights).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ Id: 1 }),
                    expect.objectContaining({ Id: 2 }),
                ]),
            ),
        );
    });

    // Handles missing stored data
    it('handles missing insights data and still sets hydrated', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        await useInsightsStore.getState().loadInsights();

        expect(useInsightsStore.getState().insights).toEqual([]);
        expect(useInsightsStore.getState().hydrated).toBe(true);
    });

    // setInsights persists and stores
    it('persists insights to AsyncStorage in setInsights()', async () => {
        await useInsightsStore.getState().setInsights(baseInsights);

        expect(useInsightsStore.getState().insights).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ Id: 1 }),
                expect.objectContaining({ Id: 2 }),
            ])
        );

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            'insights',
            expect.any(String),
        );
    });

    // addFeedback persists like/dislike
    it('addFeedback updates feedback object and persists', async () => {
        useInsightsStore.setState({ insights: baseInsights });

        await useInsightsStore.getState().addFeedback(1, 'like');

        expect(
            useInsightsStore.getState().insights.find(i => i.Id === 1).feedback
        ).toEqual({ liked: true });

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            'insights',
            expect.stringContaining('"liked":true'),
        );
    });

    it('computes helper fields in setInsights()', async () => {
        await useInsightsStore.getState().setInsights(rawHelpers);
        const item = useInsightsStore.getState().insights[0];

        expect(item.firstSentence).toBe('Hello world.');
        expect(item.dateAssigned).toEqual(new Date('2050-01-01T08:30'));
        expect(item.isOverdue).toBe(false); // false bacause 2050 is in the future
    });

    it('does not overwrite state when AsyncStorage write fails', async () => {
        // Preset a state
        useInsightsStore.setState({ insights: baseInsights });

        // Force the next write to fail
        AsyncStorage.setItem.mockRejectedValueOnce(new Error('write fail'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await useInsightsStore.getState().setInsights([{ Id: 3, title: 'Broken' }]);

        expect(useInsightsStore.getState().insights).toEqual(
            expect.arrayContaining([expect.objectContaining({ Id: 1 })]),
        );
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});