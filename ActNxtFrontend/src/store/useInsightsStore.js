import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';


// Sales Insights
const useInsightStore = create((set, get) => ({
        insights: [],
        queuedFeedback: [],
        hydrated: false,

        // Initialize store with mock data
        initializeWithMockData: async () => {
            const mockData = require('../screens/mainPage/JSON_Mockdata.json');
            try {
            // Only initialize if no data exists
            const existing = await AsyncStorage.getItem('insights');
            if (!existing) {
                await AsyncStorage.setItem('insights', JSON.stringify(mockData));
                set({ insights: mockData, hydrated: true });
            }
            } catch (error) {
            console.error('Initialization failed:', error);
            set({ insights: mockData, hydrated: true }); // Fallback
            }
        },
        clearInsights: async () => {
            try {
                await AsyncStorage.removeItem('insights');
                set({ insights: [] });
            } catch (error) {
                console.error('Failed to clear insights:', error);
            }
        },


        loadInsights: async () => {
            try {
                const mockData = require('../screens/mainPage/JSON_Mockdata.json')

                // if (forceRefresh){
                //     await AsyncStorage.setItem('insights', JSON.stringify(mockData));
                //     set({insights: mockData, hydrated: true});
                //     return;
                // }
                const stored = await AsyncStorage.getItem('insights');
                set({ 
                    insights: stored ? JSON.parse(stored) : mockData,
                    hydrated: true 
                });
            } catch (error) {
                console.error('Failed to load insights:', error);
                set({ insights: mockData, hydrated: true });
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

        addFeedback: async (insightId, feedbackType) => {
            try {
                const currentInsights = get().insights;
                const updated = currentInsights.map((item) => {
                    if (item.Id === insightId) {
                        const currentFeedback = item.feedback || {};
                        let newFeedback = {};

                        if (feedbackType === 'like') {
                            newFeedback = {
                                liked: !currentFeedback.liked,
                                disliked: currentFeedback.liked ? false: currentFeedback.disliked
                        };
                    } else if (feedbackType === 'dislike'){ 
                        newFeedback = {
                                disliked: !currentFeedback.liked,
                                liked: currentFeedback.liked ? false: currentFeedback.liked
                        };
                    }
                    return {...item, feedback: newFeedback};
                }
                return item;
                });
                
                await AsyncStorage.setItem('insights', JSON.stringify(updated));
                set({ insights: updated });
            } catch (error) {
                console.error('Failed to add feedback:', error);
            }
        },

        // Helper method
        getFeedback: (insightId) => {
            const insight = get().insights.find(item => item.Id === insightId);
            return insight?.feedback || {liked: false, disliked: false};
        },

        queueFeedback: (feedback) => {
            set((state) => ({
                queuedFeedback: [...state.queuedFeedback, feedback]
            }));
        },

        clearQueuedFeedback: () => {
            set({ queuedFeedback: [] });
        },

        // Update or add a single comment
        updateComment: async (insightId, commentText) => {
            try {
            const currentInsights = [...get().insights];
            const index = currentInsights.findIndex(item => item.Id === insightId);
            
            if (index !== -1) {
                currentInsights[index] = { 
                ...currentInsights[index],
                comment: commentText.trim() ? { // Store as single comment object
                    text: commentText.trim(),
                    updatedAt: new Date().toISOString()
                } : null
                };
                
                await AsyncStorage.setItem('insights', JSON.stringify(currentInsights));
                set({ insights: currentInsights });
                return true;
            }
            return false;
            } catch (error) {
            console.error('Failed to update comment:', error);
            return false;
            }
        },

        // Get the single comment
        getComment: (insightId) => {
            const insight = get().insights.find(item => item.Id === insightId);
            return insight?.comment || null;
        },
        // Update the comment for a specific task
        updateTaskComment: async (taskId, commentText) => {
            try {
            const currentInsights = [...get().insights];
            const taskIndex = currentInsights.findIndex(task => task.Id === taskId);
            
            if (taskIndex !== -1) {
                currentInsights[taskIndex] = { 
                ...currentInsights[taskIndex],
                userComment: commentText.trim() // Store comment directly on the task
                };
                
                await AsyncStorage.setItem('insights', JSON.stringify(currentInsights));
                set({ insights: currentInsights });
                return true;
            }
            return false;
            } catch (error) {
            console.error('Failed to update task comment:', error);
            return false;
            }
        },

        // Get the comment for a specific task
        getTaskComment: (taskId) => {
            const task = get().insights.find(task => task.Id === taskId);
            return task?.userComment || '';
        },
        // Toggle star status for a task
        toggleStar: async (taskId, starStatus) => {
            try {
            const currentInsights = [...get().insights];
            const index = currentInsights.findIndex(item => item.Id === taskId);
            
            if (index !== -1) {
                currentInsights[index] = { 
                ...currentInsights[index],
                isStarred: starStatus
                };
                
                await AsyncStorage.setItem('insights', JSON.stringify(currentInsights));
                set({ insights: currentInsights });
                return true;
            }
            return false;
            } catch (error) {
            console.error('Failed to toggle star:', error);
            return false;
            }
        },

        // Get star status for a task
        getStarStatus: (taskId) => {
            const insight = get().insights.find(item => item.Id === taskId);
            return insight?.isStarred || false;
        },

        // Get all starred tasks
        getStarredTasks: () => {
            return get().insights.filter(item => item.isStarred);
        },

        archiveTask: async (taskId) => {
            try {
                const currentInsights = [...get().insights];
                const index = currentInsights.findIndex(item => item.Id === taskId);
            
                if (index !== -1) {
                    currentInsights[index] = { 
                    ...currentInsights[index],
                    isArchived: true,
                    };
                
                    await AsyncStorage.setItem('insights', JSON.stringify(currentInsights));
                    set({ insights: currentInsights });
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Failed to archive task:', error);
                return false;
            }
        },

        unarchiveTask: async (taskId) => {
            try {
                const currentInsights = [...get().insights];
                const index = currentInsights.findIndex(item => item.Id === taskId);
            
                if (index !== -1) {
                    currentInsights[index] = { 
                    ...currentInsights[index],
                    isArchived: false,
                    };
                
                    await AsyncStorage.setItem('insights', JSON.stringify(currentInsights));
                    set({ insights: currentInsights });
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Failed to unarchive task:', error);
                return false;
            }
        },
    }));

export default useInsightStore;