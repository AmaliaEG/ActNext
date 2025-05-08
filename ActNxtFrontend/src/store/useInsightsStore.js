import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sales Insights
const useInsightStore = create((set, get) => ({
        insights: [],
        queuedFeedback: [],
        hydrated: false,

        loadInsights: async () => {
            try {
                const stored = await AsyncStorage.getItem('insights');
                if (stored) {
                    set({ insights: JSON.parse(stored) });
                }
            } catch (error) {
                console.error('Failed to load insights:', error);
            } finally {
                set({ hydrated: true });
            }
        },

        setInsights: async (data) => {
            try {
                await AsyncStorage.setItem('insights', JSON.stringify(data));
                set({ insights: data });
            } catch (error) {
                console.error('Failed to set insights:', error);
            }
        },

        addFeedback: async (insightId, feedback) => {
            try {
                const updated = get().insights.map((item) => 
                item.id === insightId ? { ...item, feedback } : item
                );
                await AsyncStorage.setItem('insights', JSON.stringify(updated));
                set({ insights: updated });
            } catch (error) {
                console.error('Failed to add feedback:', error);
            }
        },

        queueFeedback: (feedback) => {
            set((state) => ({
                queuedFeedback: [...state.queuedFeedback, feedback]
            }));
        },

        clearQueuedFeedback: () => {
            set({ queuedFeedback: [] });
        },
    }));

export default useInsightStore;