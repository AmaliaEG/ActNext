/**
 * @file Styles.js
 * @description
 * Contains all shared style definitions used across the application, including layout, buttons, headers,
 * modals, card components, drawer styles, and task expansion views.
 * Also includes `GroupColours`, a color map used to visually distinguish different SalesAnalysisId groups.
 * 
 * This file centralizes styling for better consistency and reusability throughout the app.
 * 
 * @module Styles
 * @author s235280
 * @since 2025-09-06
 */

// Style.js
import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  // ===== LAYOUT STYLES ===== //
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    padding: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== BACKGROUND IMAGE ===== //
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backgroundImage: {
    position: 'absolute',
    transform: [{scale:1.65}],
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: '35%',
    opacity: 0.5, 
  },

  // ===== CARD STYLES ===== //
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 25,
    marginBottom: 20,
    borderRadius: 10,
    position: 'relative',
    shadowOffset: { width: 0, height: 9 },
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4, 
    },
    shadowOpacity: 0.25, 
    shadowRadius: 4,
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
  CompanyNameText: {
    marginLeft: 15,
    marginTop: -7,
    fontSize: 17,
  },
  text: {
    fontSize: 19,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  descriptionText: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 20,
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 20,
  },

  // ===== HEADER + MENU STYLES ===== //
  menuContainer: {
    backgroundColor: '#f5f7f7', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 35,
    paddingTop: '20%',
    marginBottom: 25,
    position: 'relative',
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    alignItems: 'center',
    position: 'absolute',
    paddingTop: '10%',
  },
  menuButton: {
    paddingTop: '10%',
    padding: 1,
    position: 'absolute',
    left: 25,
  },
  menuIcon: {
    size: 45,
  },

  // ===== WARNING STYLES ===== //
  warningContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
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

  // ===== BUTTON STYLES ===== //
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
  buttonContainer: {
    margin: 10, 
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  Appbutton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

  // ===== NAVIGATOR ===== //
  gearWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  gearButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 30,
    elevation: 4,
  },
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    gap: 14,
    borderBottomWidth: 1,
    marginBottom: 10,
    // paddingBottom: 30,
  },
  drawerLogo: {
    width: 48,
    height: 48,
  },
  drawerTitle: {
    fontSize: 30,
    flexDirection: 'row',
  },
  drawerTitleAct: {
    fontWeight: 'bold',
  },
  drawerTitleNxt: {
    fontWeight: 'normal',
  },

  // ===== TASK EXPANSION ===== //
  Taskcontainer: {
      flex: 1,
      backgroundColor: "white",
  },
  Taskheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 35,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  TaskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
  contentContainer:{
    padding: 25,
    margin: 16,
    marginTop: 25,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  companyRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: 10,
  },
  companyNameContainer: {
    borderWidth: 1,
    borderColor: '#f2f4f5', // Light gray border
    borderRadius: 6,
    padding: 3,
    backgroundColor: '#f2f4f5',
    alignSelf: 'flex-start',
    width: 'auto',
  },
  companyName: {
    fontSize: 17,
    fontWeight: 'regular',
  },
  starButton: {
    padding: 0,
    marginRight: -7,
  },
  targetGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  colorCircle: {
    width: 15,
    height: 15,
    borderRadius: 6,
    marginRight: 6,
  },
  groupNameText: {
    fontSize: 17,
    color: '#333',
  },
  contentText: {
    fontSize: 18,
    lineHeight: 24,
    color: 'black',
    marginTop: 14,
  },
  rightAlignedButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
      paddingTop: 16,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  likedButton: {
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
  },
  dislikedButton: {
      backgroundColor: '#F44336',
      borderColor: '#F44336',
  },
  likedText: {
      color: 'white',
  },
  dislikedText: {
      color: 'white',
  },
  commentSection: {
    marginTop: 20,
    marginHorizontal: 25,
    paddingHorizontal: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  commentInputContainer: {  // New style for the wrapper
    borderRadius: 10,
    backgroundColor: '#fff',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
    marginBottom: 10,  // Spacing below the input
  },
  commentInput: {
    borderWidth: 0,  // Remove default border
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: 'transparent',
  },
  commentHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    fontStyle: 'italic',
  },
  saveButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  finishedButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: -40,
  },
  finishedButton: {
      backgroundColor: '#2196F3',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
  },
  finishedButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
});

// Shared color constants
export const GroupColours = {
  1: '#E865AE', // Win Back
  2: '#F8CE47', // Regain Performance
  3: '#66D9D9', // Growth
};