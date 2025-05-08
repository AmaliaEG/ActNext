import useSettingsStore from "../src/store/useSettingsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";


// MOCK
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
}));

const defaultSettings = {
    theme: { mode: 'light' },
    language: 'en',
    notificationsEnabled: true,
};

const storedSettings = {
    theme: { mode: 'dark' },
    language: 'da',
    notificationsEnabled: false,
};


// TESTS FOR useSettingsStore
describe('useSettingsStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSettingsStore.setState({
            ...defaultSettings,
            hydrated: false,
        });
    });

    it('loads settings from AsyncStorage and sets hydrated', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedSettings));

        await useSettingsStore.getState().loadSettings();

        const state = useSettingsStore.getState();
        expect(state.theme).toEqual({ mode: 'dark' });
        expect(state.language).toBe('da');
        expect(state.notificationsEnabled).toBe(false);
        expect(state.hydrated).toBe(true);
    });

    it('sets hydrated to true even if no data is stored', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        await useSettingsStore.getState().loadSettings();

        expect(useSettingsStore.getState().hydrated).toBe(true);
    });

    it('updates the theme and sets it to AsyncStorage when updateTheme() is called', async () => {
        const newTheme = { mode: 'dark' };
        
        await useSettingsStore.getState().updateTheme(newTheme);

        const { theme } = useSettingsStore.getState();
        expect(theme).toEqual(newTheme);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith('app-settings', JSON.stringify({ ...defaultSettings, theme: newTheme }));
    });

    it('updates the language and sets it to AsyncStorage when setLanguage() is called', async () => {
        await useSettingsStore.getState().setLanguage('fr');

        const { language } = useSettingsStore.getState();
        expect(language).toBe('fr');

        expect(AsyncStorage.setItem).toHaveBeenCalledWith('app-settings', JSON.stringify({ ...defaultSettings, language: 'fr' }));
    });

    it('toggles and sets it to AsyncStorage', async () => {
        const prevState = useSettingsStore.getState().notificationsEnabled;

        await useSettingsStore.getState().toggleNotifications();

        const state = useSettingsStore.getState();
        expect(state.notificationsEnabled).toBe(!prevState);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith('app-settings', JSON.stringify({ ...defaultSettings, notificationsEnabled: !prevState }));
    });
});