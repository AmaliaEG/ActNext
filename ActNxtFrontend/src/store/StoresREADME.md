# Information about the Zustand stores

OBS. the variable `hydrated` has the same purpose for all stores. The purpose is only written in `useAuthStore.js`.
When the word storage is used, it is meant as the AsyncStorage.

## useAuthStore.js

It tracks the login state and user info, and whether it is persisted in the AsyncStorage.

### State

The state is determined by the values `isLoggedIn`, `userInfo` and `hydrated`. Hydrated tells us when our auth state is loaded s.t. when we are logged in, hydrated becomes true when we have successfully loaded/read the persisted values. The userInfo by default contains every auth0-profile field requested from the Auth0 flow. For more information yuo can check the [auth0 Docs](https://auth0.com/docs/manage-users/user-accounts/user-profiles/user-profile-structure).

Updating the state is done by calling the provided `set` function with a new state.

### Actions

`loadAuth` tries to load the persisted valued from the storage, and converts the string values back into JavaScript objects, so we can use them accordingly. When all of this is done, hydrated is set to true, to tell the UI that it is safe to render.

`login` takes userInfo as a parameter, which is persisted to the storage resulting in a new state.

`logout` removes the persited data from the storage, and resets the store back to its initial state.

### Components using useAuthStore.js

The store is used in the LoginPage.js file, specifically under the function `LoginButton`. It is also used in the ProfileDetailsScreen.js file.

It holds the users access token from auth0, more on access tokens at https://auth0.com/docs/secure/tokens/access-tokens/access-token-profiles

#####################################################################################################

## useInsightsStore.js

It manages the list of insights (sales tasks), tracks the feedback, personal comments (user notes), starred and archived insights.

### State

The state of this store is determined by `insights`, `queuedFeedback` and `hydrated`. Insights is a list containing values `dateAssigned`, `firstSentence`, which is retrieved by the functions `getTheFirstSentence`, `ensureDate`, and the boolean value `isOverdue`.

### Functions

`getTheFirstSentence` returns the first sentence of the description, if it finds a match.

`ensureDate` parses string value into a Date object.

### Actions

**Initialization and Loading**
`initializeWithMockData` maps over the data, returns the wanted information, and persists that information to the storage. It then sets a new state, where the insights contain the information, and by setting hydrated to true.

`loadInsights` reads the 'insights' from the storage, and has a fallback in case of no values stored in the storage. It then goes through the same process, of selecting values, from `initializeWithMockData` again to ensure that there is information to be used. Lastly, a state is set.

**Managing the List**
`clearInsights` removes information from the storage, and resets our state to the initial state.

`setInsights` takes data as its parameter, and replaces the entire insights array with the newly found array retrieved by the variable `formatted`. It then proceeds to set the state.

**Feedback Flow**
`addFeedback` checks if the specific insight has a feedback, if yes, then the logic for pressing liked and/or disliked have been done accordingly. This then persists the new array to the storage, and updates the Zustand store by setting the new value for insights - results in re-rendering of the components' UI reads insights.

`getFeedback` returns the current feedback depending on the insightId.

`clearQueuedFeedback` resets the feedback.

**Comments and User Notes**
`updateComment` finds the insight based on the insightId. When found, it sets the comment value, persists to the storage and updates the state.

`getComment` gets the comment based on the insightId.

`updateTaskComment` sets the `userComment`, when the wanted task is found. It then persists this to the storage, and updates the state.

`getTaskComment` retrieves the comment for the specific task.

**Managing Favorites**
`toggleStar` set the `isStarred` accordingly, if the wanted insight is found. Then we persist the changed information to the storage, and update the state.

`getStarStatus` checks if the specific insight is starred.

`getStarredTasks` grabs all the insights that is starred.

**Managing Archives**
`archiveTask`/`unarchiveTask` works like `togglestar` where it instead of `isStarred` sets the `isArchived` accordingly.

### Components using useInsightsStore.js

Feed.js, TaskExpansion.js, LoginPage.js, StarredTasks.js and ArchivedTasks.js.

#####################################################################################################

## useProfileStore.js

Manages the user's personal information and persists it to AsyncStorage.

### State

The state is determined by the values `profile` and `hydrated`, where profile contains information name, birthdate, gender, email and code.

### Actions

`loadProfile` tries to fetch the user's profile. If found it overrides the profile value. Lastly, when it is done, it will always set the hydrated to true.

`updateProfile` persists the user information with out input value, and updates the state.

`resetProfile` removes the user-profile from the storage, and resets to the initial state.

### Components using useProfileStore.js

LoginPage.js and ProfileDetailsScreen.js.

#####################################################################################################

## useSettingsStore.js

Handles settings like theme, language, and notifications.

### State

The state is determined by the values `theme`, `language`, `notificationsEnabled` and `hydrated`.

### Actions

`loadSettings` reads the app-settings and sets the values to what is read. If nothing is there, then we have fallbacks. When finished, hydrated is set to true.

`updateTheme` merges the new theme into the stored settings, and persists it to the storage. It then updates the state with the new theme.

`setLanguage` works the same way as `updateTheme` does.

`toggleNotifications` works almost the same as the previous 2 actions, but with the difference of saying `!current.notificationsEnabled` due to it being a toggle/flip.

### Components using useSettingsStore.js

LoginPage.js and SettingsScreen.js.
