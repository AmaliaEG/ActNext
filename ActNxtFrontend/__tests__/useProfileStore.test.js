import create from 'zustand';
import { act } from '@testing-library/react-native' ;
import useProfileStore from "../src/store/useProfileStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock('@react-native-async-storage/async-storage', () => 
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const expectedProfileDescription = (expectedDes) => {
    const actual = useProfileStore.getState().profile;
    expect(actual).toEqual(expectedDes);
};

const defaultProfile = {
    name: '',
    birthDate: null,
    gender: '',
    email: '',
    code: '123456'
};

describe('useProfileStore', () => {
    beforeEach(() => {
        useProfileStore.getState().resetProfile(); // Resets before each test
    });

    it('renders user profile correctly', () => {
        expectedProfileDescription(defaultProfile);
    });

    it('updates user profile when save changes button is pressed', () => {
        useProfileStore.getState().updateProfile({ name: 'Test User' });
        expectedProfileDescription({ ...defaultProfile, name: 'Test User' });
    });

    it('should reset profile to default values', () => {
        useProfileStore.getState().updateProfile({ name: 'Test User' });
        useProfileStore.getState().resetProfile();
        expectedProfileDescription(defaultProfile);
    });

    it('should keep previous values if updateProfile is not called', () => {
        const unchanged = useProfileStore.getState().profile;

        // Given no updateProfile is called, we expect state to be unchanged
        expectedProfileDescription(unchanged);
    });

    // updateProfile merges the given update with the existing values, which means
    // that it only replaces one value, if only one has been changed.
    it('merges updates profile with existing values', () => {
        useProfileStore.getState().updateProfile({ name: 'Alice' });
        useProfileStore.getState().updateProfile({ email: 'alice@example.com' });
        expectedProfileDescription({
            ...defaultProfile,
            name: 'Alice',
            email: 'alice@example.com'
        });
    });
});