import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  useColorScheme,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Mock Data ---
const MOCK_NOTES = [
  { id: '1', title: 'Design Meeting', content: 'Discuss the new typography system and color palette for the mobile app.', date: 'Oct 24' },
  { id: '2', title: 'Grocery List', content: 'Oat milk, Avocados, Coffee beans, Sourdough bread.', date: 'Oct 23' },
  { id: '3', title: 'Project Ideas', content: 'Build a habit tracker using React Native and Firebase.', date: 'Oct 20' },
];

export default function NotesApp() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isDarkMode = colorScheme === 'dark';

  // State to toggle between views for demonstration purposes
  const [currentView, setCurrentView] = useState('listing');

  // Dynamic Styles based on Theme
  const themeContainer = isDarkMode ? styles.darkContainer : styles.lightContainer;
  const themeText = isDarkMode ? styles.darkText : styles.lightText;
  const themeCard = isDarkMode ? styles.darkCard : styles.lightCard;

  // --- View 1: Notes Listing Screen ---
  const NotesListingScreen = () => (
    <SafeAreaView style={StyleSheet.compose(styles.safeArea, themeContainer)}>
      <View style={styles.headerRow}>
        <Text style={StyleSheet.compose(styles.title, themeText)}>My Notes</Text>
        <View style={styles.switchContainer}>
          <Text style={[themeText, { marginRight: 8 }]}>🌙</Text>
          <Switch value={isDarkMode} />
        </View>
      </View>

      <TextInput
        placeholder="Search notes..."
        placeholderTextColor={isDarkMode ? '#888' : '#666'}
        style={StyleSheet.compose(styles.searchBar, isDarkMode ? styles.darkInput : styles.lightInput)}
      />

      <FlatList
        data={MOCK_NOTES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => (
          <Pressable 
            style={({ pressed }) => StyleSheet.flatten([themeCard, styles.noteCard, pressed && styles.pressedCard])}
            onPress={() => setCurrentView('editor')}
          >
            <View style={styles.cardHeader}>
              <Text style={StyleSheet.compose(styles.noteTitle, themeText)}>{item.title}</Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Text numberOfLines={2} style={styles.snippetText}>{item.content}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );

  // --- View 2: Note Editor Screen ---
  const NoteEditorScreen = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={StyleSheet.compose(styles.safeArea, themeContainer)}
    >
      <ScrollView bounce={false}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba' }} 
          style={[styles.editorHeader, { height: width > 600 ? 300 : 200 }]}
        >
          <View style={styles.overlay}>
             <Pressable style={styles.backButton} onPress={() => setCurrentView('listing')}>
                <Text style={styles.buttonText}>← Back</Text>
             </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.editorPadding}>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#999"
            style={StyleSheet.compose(styles.titleInput, themeText)}
          />
          <TextInput
            placeholder="Start writing..."
            placeholderTextColor="#999"
            multiline
            style={StyleSheet.compose(styles.bodyInput, themeText)}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={() => setCurrentView('listing')}>
          <Text style={styles.saveButtonText}>Save Note</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );

  return currentView === 'listing' ? <NotesListingScreen /> : <NoteEditorScreen />;
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#F8F9FA',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  lightText: {
    color: '#1A1A1A',
  },
  darkText: {
    color: '#FFFFFF',
  },
  searchBar: {
    margin: 20,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  lightInput: {
    backgroundColor: '#E9ECEF',
  },
  darkInput: {
    backgroundColor: '#2C2C2C',
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noteCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  darkCard: {
    backgroundColor: '#1E1E1E',
  },
  pressedCard: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateText: {
    color: '#888',
    fontSize: 12,
  },
  snippetText: {
    color: '#666',
    lineHeight: 20,
  },
  // Editor Styles
  editorHeader: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    justifyContent: 'flex-start',
  },
  backButton: {
    marginTop: 20,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  editorPadding: {
    padding: 20,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 15,
  },
  bodyInput: {
    fontSize: 18,
    lineHeight: 26,
    minHeight: 300,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});