import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Sales Insights
const useInsightStore = create(
    persist(
        (set) => ({
            // State
            insights: [],
            queuedFeedback: [],

            // Actions
            setInsights: (data) => set({ insights: data }),

            addFeedback: (insightId, feedback) =>
                set((state) => ({
                    insights: state.insights.map((item) =>
                    item.id === insightId ? { ...item, feedback } : item
                ),
            })),

            queueFeedback: (feedback) =>
                set((state) => ({ queuedFeedback: [...state.queuedFeedback, feedback] })),

            clearQueuedFeedback: () => set({ queuedFeedback: [] }),
        }),
        {
            name: 'insights-data',
            getStorage: () => AsyncStorage,
        }
    )
);

export default useInsightStore;