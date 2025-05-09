import useAuthStore from "../src/store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// MOCKS
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
}));

// TESTS FOR useAuthStore
describe('useAuthStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('loads auth state from AsyncStorage and sets hydrated', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({
            isLoggedIn: true,
            userInfo: { name: 'Tester' },
        }));

        const store = useAuthStore.getState();
        await store.loadAuth();

        expect(store.isLoggedIn).toBe(true);
        expect(store.userInfo.name).toBe('Tester');
        expect(store.hydrated).toBe(true);
    });

    it('handles null from AsyncStorage and sets default values', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        const store = useAuthStore.getState();
        await store.loadAuth();

        expect(store.isLoggedIn).toBe(false);
        expect(store.userInfo).toBe(null);
        expect(store.hydrated).toBe(true);
    });

    it('saves to AsyncStorage and updates state, when login() is called', async () => {
        const store = useAuthStore.getState();
        const userInfo = { name: 'LoginUser' };

        await store.login(userInfo);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth-state', JSON.stringify({ isLoggedIn: true, userInfo }));
        expect(store.isLoggedIn).toBe(true);
        expect(store.userInfo).toEqual(userInfo);
    });

    it('removes auth-state from AsyncStorage and clears store, when logout() is called', async () => {
        const store = useAuthStore.getState();
        store.isLoggedIn = true;
        store.userInfo = { name: 'LogoutUser' };

        await store.logout();

        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth-state');
        expect(store.isLoggedIn).toBe(false);
        expect(store.userInfo).toBe(null);
    });
});