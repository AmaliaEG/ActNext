import useAuthStore from "../src/store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// MOCKS
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn().mockResolvedValue(null),
    getItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null)
}));

const freshState = () => useAuthStore.getState();

beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();

    useAuthStore.setState({ 
        isLoggedIn: false,
        token: null,
        hydrated: false 
    });
});

afterAll(() => {
    delete global.alert;
});

// TESTS FOR useAuthStore
describe('useAuthStore', () => {
    it('loads auth state from AsyncStorage and sets hydrated', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({
            isLoggedIn: true,
            token: { name: 'Tester' },
        }));

        await freshState().loadAuth();
        const store = freshState();

        expect(store.isLoggedIn).toBe(true);
        expect(store.token.name).toBe('Tester');
        expect(store.hydrated).toBe(true);
    });

    it('handles null from AsyncStorage and sets default values', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        await freshState().loadAuth();
        const store = freshState();

        expect(store.isLoggedIn).toBe(false);
        expect(store.token).toBe(null);
        expect(store.hydrated).toBe(true);
    });

    it('saves to AsyncStorage and updates state, when login() is called', async () => {
        const token = { name: 'LoginUser' };

        await freshState().login(token);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            'auth-state', 
            JSON.stringify({ isLoggedIn: true, token })
        );
        const updated = freshState();
        expect(updated.isLoggedIn).toBe(true);
        expect(updated.token).toEqual(token);
    });

    it('removes auth-state from AsyncStorage and clears store, when logout() is called', async () => {
        useAuthStore.setState({ isLoggedIn: true, token: { name: 'LogoutUser' } });

        await freshState().logout();

        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth-state');
        const updated = freshState();
        expect(updated.isLoggedIn).toBe(false);
        expect(updated.token).toBe(null);
    });
});