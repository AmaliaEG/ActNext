import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getTheFirstSentence = (description) => {
  if (!description) return '';
  const sentences = description.split('.');
  return sentences[0].trim() + (sentences.length > 1 ? '.' : '');
};

const ensureDate = (input) => {
  if (!input) return null;
  const parsed = new Date(typeof input === 'string' ? input.replace(' ', 'T') : input);
  return isNaN(parsed) ? null : parsed;
};
// Sales Insights
const useInsightStore = create((set, get) => ({
        insights: [],
        queuedFeedback: [],
        hydrated: false,

        // Initialize store with mock data
        initializeWithMockData: async () => {
            const currentDate = new Date();
            const formatted = mockData.map(item => {
            const dateAssigned = ensureDate(item.dateAssigned || item.DtCreate);
            return {
                ...item,
                dateAssigned,
                isOverdue: dateAssigned ? dateAssigned < currentDate : false,
                firstSentence: getTheFirstSentence(item.Description),
            };
            });
            await AsyncStorage.setItem('insights', JSON.stringify(formatted));
            set({ insights: formatted, hydrated: true });
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
            const mockData = require('../screens/Pages/JSON_Mockdata.json');
            const stored = await AsyncStorage.getItem('insights');
            const parsedData = stored ? JSON.parse(stored) : mockData;

            const currentDate = new Date();
            const processed = parsedData.map(item => {
            const dateAssigned = ensureDate(item.dateAssigned || item.DtCreate);
            return {
                ...item,
                dateAssigned,
                isOverdue: dateAssigned ? dateAssigned < currentDate : false,
                firstSentence: getTheFirstSentence(item.Description),
            };
            });

            set({ insights: processed, hydrated: true });
        } catch (error) {
            console.error('Failed to load insights:', error);
            set({ insights: [], hydrated: true });
        }
        },
        setInsights: async (data) => {
            try {
                const currentDate = new Date();
                const formatted = data.map(item => {
                const dateAssigned = ensureDate(item.dateAssigned || item.DtCreate);
                return {
                    ...item,
                    dateAssigned,
                    isOverdue: dateAssigned ? dateAssigned < currentDate : false,
                    firstSentence: getTheFirstSentence(item.Description),
                };
                });

                await AsyncStorage.setItem('insights', JSON.stringify(formatted));
                set({ insights: formatted });
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
                dateAssigned: ensureDate(item.dateAssigned)
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