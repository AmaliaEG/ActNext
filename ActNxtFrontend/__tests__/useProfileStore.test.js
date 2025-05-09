import useProfileStore from "../src/store/useProfileStore";
import AsyncStorage from "@react-native-async-storage/async-storage";


// MOCK
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
}));

const mockProfile = {
    name: 'Alice',
    birthDate: '01/01/2000',
    gender: 'female',
    email: 'alice@example.com',
    code: '123456'
};

// TESTS FOR useProfileStore
describe('useProfileStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useProfileStore.setState({
            profile: {
                name: '',
                birthDate: '',
                gender: '',
                email: '',
                code: ''
            },
            hydrated: false,
        });
    });

    it('loads profile from AsyncStorage and sets hydrated', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockProfile));

        await useProfileStore.getState().loadProfile();

        const { profile, hydrated } = useProfileStore.getState();
        expect(profile).toEqual(mockProfile);
        expect(hydrated).toBe(true);
    });

    it('sets hydrated even when no stored profile exists', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        await useProfileStore.getState().loadProfile();

        const { profile, hydrated } = useProfileStore.getState();
        expect(profile).toEqual({
            name: '',
            birthDate: '',
            gender: '',
            email: '',
            code: ''
        });
        expect(hydrated).toBe(true);
    });

    it('updates profile and sets it to AsyncStorage', async () => {
        await useProfileStore.getState().updateProfile(mockProfile);

        const { profile } = useProfileStore.getState();
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('user-profile', JSON.stringify(mockProfile));
        expect(profile).toEqual(mockProfile);
    });

    it('resets profile and removes from AsyncStorage', async () => {
        useProfileStore.setState({ profile: mockProfile });

        await useProfileStore.getState().resetProfile();

        const { profile } = useProfileStore.getState();
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user-profile');
        expect(profile).toEqual({});
    });
});