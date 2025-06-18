/**
 * @file useInsightStore.js
 * @description
 * Manages the list of sales insights (tasks), including loading, persisting, feedback flow, comments, starring, and archiving.
 * Persists state in AsyncStorage and ensures hydration before UI uses data.
 * 
 * State:
 * - `insights` (Array<Object>): list of insight objects, each with these fields (`dateAssigned`, `isOverdue`, `firstSentence`).
 * - `queuedFeedback` (Array): temporary queue for feedback actions before persistence.
 * - `hydrated` (boolean): indicates whether data has been loaded from storage.
 * 
 * Actions:
 * - `initializeWithMockData`: seeds store with mock data, formats each insight, and persists it.
 * - `clearInsights`: clears all persisted insights and resets store.
 * - `loadInsights`: loads persisted insights or mock JSON, processes each record, and sets `hydrated`.
 * - `setInsights(data)`: replaces all insights with provided data after formatting and persists.
 * - `addFeedback(insightId, feedbackType)`: toggles like/dislike feedback on an insight and persists.
 * - `getFeedback(insightId)`: retrieves current feedback for a given insight.
 * - `clearQueuedFeedback`: empties the feedback queue.
 * - `updateComment(insightId, commentText)`: updates or removes a single comment on an insight and persists.
 * - `getComment(insightId)`: retieves the comment object for an insight.
 * - `updateTaskComment(taskId, commentText)`: updates or removes a user comment on a specific task and persists.
 * - `getTaskComment(taskId)`: retieves the user comment string for a task.
 * - `toggleStar(taskId, starStatus)`: sets the starred status of a task and persists.
 * - `getStarStatus(taskId)`: retrieves whether a task is starred.
 * - `getStarredTasks`: returns all starred tasks.
 * - `archiveTask(taskId)`/`unarchiveTask(taskId)`: toggles archived status for a task and persists.
 * 
 * @module useInsightStore
 * @author s224837
 * @since 2025-05-05
 */

import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * Extracts the first sentence from a longer text.
 * @param {string} description - Full description text.
 * @returns {string}
 */
const getTheFirstSentence = (description) => {
  if (!description) return '';
  const sentences = description.split('.');
  return sentences[0].trim() + (sentences.length > 1 ? '.' : '');
};

/**
 * Parses various input formats into a Date object or returns null.
 * @param {string|Date} input 
 * @returns {Date|null}
 */
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

        /**
         * Initializes store with mock data, processing dates and sentences, then persists.
         * @async
         * @author s235280
         */
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

        /**
         * Clears persisted insights and resets store state.
         * @async
         * @author s235224
         */
        clearInsights: async () => {
            try {
                await AsyncStorage.removeItem('insights');
                set({ insights: [] });
            } catch (error) {
                console.error('Failed to clear insights:', error);
            }
        },

        /**
         * Loads insights from storage or mock JSON, processes each entry, and sets hydrated.
         * @async
         * @author s235280
         */
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

        /**
         * Replaces all insights with provided data after formatting and persists.
         * @async
         * @param {Array<Object>} data 
         */
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

        /**
         * Toggles like/dislike feedback on a specific insight and persists.
         * @async
         * @param {number} insightId 
         * @param {'like'|'dislike'} feedbackType 
         * @author s235280
         */
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

        /**
         * Retrieves the feedback object for a given insight.
         * @param {number} insightId 
         * @returns {{liked: boolean, disliked: boolean}}
         * @author s235280
         */
        getFeedback: (insightId) => {
            const insight = get().insights.find(item => item.Id === insightId);
            return insight?.feedback || {liked: false, disliked: false};
        },

        /**
         * Clears the in-memory queuedFeedback array.
         */
        clearQueuedFeedback: () => {
            set({ queuedFeedback: [] });
        },

        /**
         * Updates or removes a comment on an insight and persists change.
         * @async
         * @param {number} insightId 
         * @param {string} commentText 
         * @returns {Promise<boolean>}
         * @author s235280
         */
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

        /**
         * Retrieves the comment object for a given insigt.
         * @param {number} insightId 
         * @returns {{text: string, updatedAt: string}|null}
         * @author s235280
         */
        getComment: (insightId) => {
            const insight = get().insights.find(item => item.Id === insightId);
            return insight?.comment || null;
        },
        
        /**
         * Updates or removes a user comment on a specific task and persists.
         * @async
         * @param {number} taskId 
         * @param {string} commentText 
         * @returns {Promise<boolean>}
         * @author s235280
         */
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

        /**
         * Retrieves the user comment string for a specific task.
         * @param {number} taskId 
         * @returns {string}
         * @author s235280
         */
        getTaskComment: (taskId) => {
            const task = get().insights.find(task => task.Id === taskId);
            return task?.userComment || '';
        },
        
        /**
         * Sets the starred status of a task and persist change.
         * @async
         * @param {number} taskId 
         * @param {boolean} starStatus 
         * @returns {Promise<boolean>}
         * @author s235280
         */
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

        /**
         * Returns whether a given task is starred.
         * @param {number} taskId 
         * @returns {boolean}
         * @author s235280
         */
        getStarStatus: (taskId) => {
            const insight = get().insights.find(item => item.Id === taskId);
            return insight?.isStarred || false;
        },

        /**
         * Returns all starred tasks.
         * @returns {Array<Object>}
         * @author s235280
         */
        getStarredTasks: () => {
            return get().insights.filter(item => item.isStarred);
        },

        /**
         * Marks a task as archived and persists change.
         * @async
         * @param {number} taskId 
         * @returns {Promise<boolean>}
         */
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

        /**
         * Unarchives a task and persists change.
         * @async
         * @param {number} taskId 
         * @returns {Promise<boolean>}
         */
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