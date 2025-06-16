import useProfileStore from "../src/store/useProfileStore";
import AsyncStorage from "@react-native-async-storage/async-storage";


// MOCK
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn().mockResolvedValue(null),
    getItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null)
}));

jest.mock('../src/store/mockUserDatabase.json', () => [
    {
        auth0ID: "example",
        name: "example",
        birthDate: "01/01/2000",
        gender: "Other",
        email: "example@example.com",
        code: 1234,
        theme: "System",
        language: "English",
        notifications: 1    
    }
]);

const mockProfile = {
    name: 'Alice',
    birthDate: '01/01/2000',
    gender: 'female',
    email: 'alice@example.com',
    code: '123456'
};

const emptyProfile = {
    name: '',
    birthDate: '',
    gender: '',
    email: '',
    code: ''
};

const mockAuth0Profile = {
    auth0ID: "example",
    name: "example",
    birthDate: "01/01/2000",
    gender: "Other",
    email: "example@example.com",
    code: 1234,
    theme: "System",
    language: "English",
    notifications: 1    
}

const mockAuth0ID = {
    sub: "example",
    name: "example",
    email: "example@example.com"
}

const mockNewAuth0ID = {
    sub: "bobsID",
    name: "bob",
    email: "bob@mail.com"
}

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => {
    jest.clearAllMocks();
    useProfileStore.setState({ profile: { ...emptyProfile }, hydrated: false });
});

afterAll(() => {
    consoleErrorSpy.mockRestore();
});

// TESTS FOR useProfileStore
describe('useProfileStore', () => {
    it('loads profile from AsyncStorage and sets hydrated', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockProfile));

        await useProfileStore.getState().loadProfile(null);
        const { profile, hydrated } = useProfileStore.getState();

        expect(profile).toEqual(mockProfile);
        expect(hydrated).toBe(true);
    });

    it('sets hydrated even when no stored profile exists', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        await useProfileStore.getState().loadProfile(null);
        const { profile, hydrated } = useProfileStore.getState();

        expect(profile).toEqual(emptyProfile);
        expect(hydrated).toBe(true);
    });

    it('updates profile and persists it to AsyncStorage', async () => {
        await useProfileStore.getState().updateProfile(mockProfile);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            'user-profile',
            JSON.stringify(mockProfile)
        );
        expect(useProfileStore.getState().profile).toEqual(mockProfile);
    });

    it('resets profile and removes from AsyncStorage', async () => {
        useProfileStore.setState({ profile: mockProfile });

        await useProfileStore.getState().resetProfile();

        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user-profile');
        expect(useProfileStore.getState().profile).toEqual({});
    });

    // If we can't read the profile from the disk, the app shouldn't get stuck in a "loading" state
    it('handles storage read errors', async () => {
        AsyncStorage.getItem.mockRejectedValue(new Error('disk full'));

        await useProfileStore.getState().loadProfile(null);

        expect(useProfileStore.getState().hydrated).toBe(true);
        expect(console.error).toHaveBeenCalled();
    });

    // This test guarentees that an unexpected write error can't wipe ther user's data
    it('does not overwrite state when updateProfile fails', async () => {
        useProfileStore.setState({ profile: mockProfile });

        AsyncStorage.setItem.mockRejectedValueOnce(new Error('write fail'));
        const result = await useProfileStore.getState().updateProfile({ name: 'Broken' });

        expect(result).toBeUndefined();
        expect(useProfileStore.getState().profile).toEqual(mockProfile);
        expect(console.error).toHaveBeenCalled();
    });

    it('queries user database for user profile when presented with a valid auth0ID', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);
        
        await useProfileStore.getState().loadProfile(mockAuth0ID);

        const { profile } = useProfileStore.getState();
        expect(profile).toEqual(mockAuth0Profile);
    });

    it('creates a new profile if auth0ID is not found in the database', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        await useProfileStore.getState().loadProfile(mockNewAuth0ID);

        const { profile } = useProfileStore.getState();
        expect(profile).toEqual({
            auth0ID: 'bobsID',
            name: 'bob',
            email: 'bob@mail.com'
        });
    });
});