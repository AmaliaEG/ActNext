import useInsightsStore from "../src/store/useInsightsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";


// MOCK
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
}));

const sampleInsights = [
    { id: 1, title: 'Insight 1', feedback: null },
    { id: 2, title: 'Insight 2', feedback: null },
];


// TESTS FOR useInsightsStore
describe('useInsightsStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useInsightsStore.setState({
            insights: [],
            queuedFeedback: [],
            hydrated: false,
        });
    });

    it('loads insights from AsyncStorage and sets hydrated', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(sampleInsights));

        await useInsightsStore.getState().loadInsights();

        const { insights, hydrated } = useInsightsStore.getState();
        expect(insights).toEqual(sampleInsights);
        expect(hydrated).toBe(true);
    });

    it('handles missing insights data and still sets hydrated', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        await useInsightsStore.getState().loadInsights();

        const { insights, hydrated } = useInsightsStore.getState();
        expect(insights).toEqual([]);
        expect(hydrated).toBe(true);
    });

    it('stores data in state and AsyncStorage when useInsights() is called', async () => {
        await useInsightsStore.getState().setInsights(sampleInsights);

        const { insights } = useInsightsStore.getState();
        expect(insights).toEqual(sampleInsights);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('insights', JSON.stringify(sampleInsights));
    });

    it('updates an insight and sets it to AsyncStorage when addFeedback() is called', async () => {
        useInsightsStore.setState({ insights: sampleInsights });

        await useInsightsStore.getState().addFeedback(1, 'like');

        const { insights } = useInsightsStore.getState();
        expect(insights.find(i => i.id === 1).feedback).toBe('like');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('insights', JSON.stringify([
            { id: 1, title: 'Insight 1', feedback: null },
            { id: 2, title: 'Insight 2', feedback: null },
        ]));
    });

    it('adds feedback to the queue when queueFeedback() is called', () => {
        useInsightsStore.getState().queueFeedback({ id: 1, vote: 'like' });

        const { queuedFeedback } = useInsightsStore.getState();
        expect(queuedFeedback).toEqual([{ id:1, vote: 'like' }]);
    });

    it('empties the queue when clearQueuedFeedback() is called', () => {
        useInsightsStore.setState({ queuedFeedback: [{ id: 1, vote: 'like' }] });

        useInsightsStore.getState().clearQueuedFeedback();

        expect(useInsightsStore.getState().queuedFeedback).toEqual([]);
    });
});