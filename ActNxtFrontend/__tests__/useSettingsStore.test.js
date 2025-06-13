import useSettingsStore from "../src/store/useSettingsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";


// MOCK
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn().mockResolvedValue(null),
    getItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null)
}));

const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
afterAll(() => errorSpy.mockRestore());

const lastPayload = () => {
    const [, json] = AsyncStorage.setItem.mock.calls.at(-1);
    return JSON.parse(json);
};

const defaultSettings = {
    theme: { mode: 'light' },
    language: 'en',
    notificationsEnabled: true,
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
        const stored = {
            theme: { mode: 'dark' },
            language: 'da',
            notificationsEnabled: false,
        };
        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(stored));

        await useSettingsStore.getState().loadSettings();

        expect(useSettingsStore.getState()).toEqual(
            expect.objectContaining({ ...stored, hydrated: true })
        );
    });

    it('sets hydrated to true even if no data is stored', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        await useSettingsStore.getState().loadSettings();

        expect(useSettingsStore.getState().hydrated).toBe(true);
    });

    it('updates the theme and sets it to AsyncStorage when updateTheme() is called', async () => {
        const newTheme = { mode: 'dark' };
        
        await useSettingsStore.getState().updateTheme(newTheme);

        expect(useSettingsStore.getState().theme).toEqual(newTheme);

        expect(lastPayload()).toEqual(
            expect.objectContaining({ theme: newTheme })
        );
    });

    it('updates the language and sets it to AsyncStorage when setLanguage() is called', async () => {
        await useSettingsStore.getState().setLanguage('fr');

        expect(useSettingsStore.getState().language).toBe('fr');
        expect(lastPayload()).toEqual(
            expect.objectContaining({ language: 'fr' })
        );
    });

    it('toggles and sets it to AsyncStorage', async () => {
        const prevState = useSettingsStore.getState().notificationsEnabled;

        await useSettingsStore.getState().toggleNotifications();

        expect(useSettingsStore.getState().notificationsEnabled).toBe(!prevState);
        expect(lastPayload()).toEqual(
            expect.objectContaining({ notificationsEnabled: !prevState })
        );
    });

    it('marks hydrated even when loadSettings() encounters a read error', async () => {
        AsyncStorage.getItem.mockRejectedValueOnce(new Error('disk fail'));

        await useSettingsStore.getState().loadSettings();

        expect(useSettingsStore.getState().hydrated).toBe(true);
        expect(console.error).toHaveBeenCalled();
    });

    it('does not clobber state when updateTheme write fails', async () => {
        const originalTheme = useSettingsStore.getState().theme;
        AsyncStorage.setItem.mockRejectedValueOnce(new Error('write fail'));

        await useSettingsStore.getState().updateTheme({ theme: 'dark' });

        expect(useSettingsStore.getState().theme).toEqual(originalTheme);
        expect(console.error).toHaveBeenCalled();
    });
});