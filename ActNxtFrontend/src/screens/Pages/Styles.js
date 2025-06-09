// InsightStyles.js
import { StyleSheet } from 'react-native';

export const InsightStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    padding: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Menu/header styles
  menuContainer: {
    marginBottom: 10,
    padding: 25,
    marginLeft: 0,
    marginRight: 0,
  },
  menuButton: {
    padding: 10,
    marginTop: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  
  // Item card styles
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 25,
    borderRadius: 10,
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    padding: 5,
  },
  colorDot: {
    position: 'absolute',
    marginLeft: -5,
    width: 15,
    height: 15,
    borderRadius: 50,
  },
  
  // Text styles
  CompanyNameText: {
    marginLeft: 15,
    marginTop: -7,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20, 
  },
  dateText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20, 
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20, 
    fontStyle: 'italic', 
  },
  
  // Warning styles
  warningContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',s
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  warningText: {
    color: 'yellow',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Button styles
  unarchiveButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  unarchiveButtonText: {
    fontWeight: 'bold',
  },
});

// Export color constants that are used across components
export const GroupColours = {
  1: '#E862AE', // Light salmon for Win Back
  2: '#F8CF46', // Gold for Regain Performance
  3: '#5CD2CD'  // Pale green for Growth
};