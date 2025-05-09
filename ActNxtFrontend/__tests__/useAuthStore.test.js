import useAuthStore from "../src/store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// MOCKS
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
}));

const freshState = () => useAuthStore.getState();

beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({ 
        isLoggedIn: false,
        userInfo: null,
        hydrated: false 
    });
});

// TESTS FOR useAuthStore
describe('useAuthStore', () => {
    it('loads auth state from AsyncStorage and sets hydrated', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({
            isLoggedIn: true,
            userInfo: { name: 'Tester' },
        }));

        await freshState().loadAuth();
        const store = freshState();

        expect(store.isLoggedIn).toBe(true);
        expect(store.userInfo.name).toBe('Tester');
        expect(store.hydrated).toBe(true);
    });

    it('handles null from AsyncStorage and sets default values', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        await freshState().loadAuth();
        const store = freshState();

        expect(store.isLoggedIn).toBe(false);
        expect(store.userInfo).toBe(null);
        expect(store.hydrated).toBe(true);
    });

    it('saves to AsyncStorage and updates state, when login() is called', async () => {
        const store = freshState();
        const userInfo = { name: 'LoginUser' };

        await store.login(userInfo);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth-state', JSON.stringify({ isLoggedIn: true, userInfo }));
        const updated = freshState();
        expect(updated.isLoggedIn).toBe(true);
        expect(updated.userInfo).toEqual(userInfo);
    });

    it('removes auth-state from AsyncStorage and clears store, when logout() is called', async () => {
        useAuthStore.setState({ isLoggedIn: true, userInfo: { name: 'LogoutUser' } });

        await freshState().logout();

        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth-state');

        const updated = freshState();
        expect(updated.isLoggedIn).toBe(false);
        expect(updated.userInfo).toBe(null);
    });
});