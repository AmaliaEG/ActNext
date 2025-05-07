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
            _hasHydrated: false,
            setHasHydrated: (value) => set({ _hasHydrated: value }),

            // Actions
            setInsights: (data) => set({ insights: data }),

            addFeedback: (insightId, feedback) =>
                set((state) => ({
                    insights: state.insights.map((item) =>
                    item.id === insightId ? { ...item, feedback } : item
                ),
            })),

            queueFeedback: (feedback) =>
                set((state) => ({
                    queuedFeedback: [...state.queuedFeedback, feedback]
                })),

            clearQueuedFeedback: () => set({ queuedFeedback: [] }),
        }),
        {
            name: 'insights-data',
            getStorage: () => AsyncStorage,
            onRehydrateStorage: () => (state) => {
                console.log('[Zustand] onRehydrateStorage called');
                return (state) => {
                    console.log('[Zustand] Final hydration step:', state)
                    state?.setHasHydrated?.(true);
                }
            }
        }
    )
);

export default useInsightStore;