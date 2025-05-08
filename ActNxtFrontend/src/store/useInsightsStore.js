import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sales Insights
const useInsightStore = create((set) => ({
        insights: [],
        queuedFeedback: [],

        loadInsights: async () => {
            const stored = await AsyncStorage.getItem('insights');
            if (stored) {
                set({ insights: JSON.parse(stored) });
            }
        },

        setInsights: async (data) => {
            await AsyncStorage.setItem('insights', JSON.stringify(data));
            set({ insights: data });
        },

        addFeedback: async (insightId, feedback) => {
            set((state) => {
                const updated = state.insights.map((item) =>
                    item.id === insightId ? { ...item, feedback } : item
            );
            AsyncStorage.setItem('insights', JSON.stringify(updated));
            return { insights: updated };
            });
        },

        queueFeedback: (feedback) =>
            set((state) => ({
                queuedFeedback: [...state.queuedFeedback, feedback]
            })),

        clearQueuedFeedback: () => set({ queuedFeedback: [] }),
    }));

export default useInsightStore;