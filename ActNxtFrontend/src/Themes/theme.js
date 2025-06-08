export const lightTheme = {
  mode: 'light',
  isDark: false,
  colors: {
    background: '#FFFFFF',
    insightBackground: '#F9F9F9',
    text: '#000000',
    subText: '#666666',
    shadow: '#000000',
    shadowOpacity: 0.1,
    border: '#CCCCCC',
    primary: '#007AFF',
    inputText: '#000000',
    inputBg: '#FFFFFF',
    placeholder: '#999999',
    buttonText: '#FFFFFF',
    buttonBorder: '#CCCCCC',
    inputBg: '#FFFFFF',
  },
};

export const darkTheme = {
  mode: 'dark',
  isDark: true,
  colors: {
    background: '#000000',
    backgroundColor: '##FFFFFF',
    insightBackground: '#1E1E1E',
    text: '#FFFFFF',
    subText: '#BBBBBB',
    shadow: '#FFFFFF',
    shadowOpacity: 0.1,
    border: '#333333',
    primary: '#0A84FF',
    inputText: '#FFFFFF',
    inputBg: '#1E1E1E',
    placeholder: '#AAAAAA',
    buttonText: '#FFFFFF',
    buttonBorder: '#444444',
    inputBg: '#1E1E1E',

  },
};

const themes = {
  light: lightTheme,
  dark: darkTheme,
};
export default themes;
