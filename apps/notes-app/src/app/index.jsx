import React, { useState, useMemo, memo } from 'react';
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
  StatusBar,
  Switch,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// Listing View
const ListingView = memo(
  ({
    colors,
    isDarkMode,
    setIsDarkMode,
    searchQuery,
    setSearchQuery,
    filteredNotes,
    handleOpenNote,
    handleNewNote,
  }) => {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.bg }]}
      >
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Notes
          </Text>

          <View style={styles.row}>
            <Text
              style={{
                color: colors.subtext,
                marginRight: 8,
              }}
            >
              {isDarkMode ? 'Dark' : 'Light'}
            </Text>

            <Switch
              value={isDarkMode}
              onValueChange={(val) => setIsDarkMode(val)}
              trackColor={{
                false: '#767577',
                true: '#34C759',
              }}
            />
          </View>
        </View>

        <TextInput
          placeholder="Search notes..."
          placeholderTextColor={colors.subtext}
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
            },
          ]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleOpenNote(item)}
              style={({ pressed }) => [
                styles.noteCard,
                {
                  backgroundColor: colors.card,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {item.title}
              </Text>

              <Text
                numberOfLines={2}
                style={[
                  styles.cardSnippet,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                {item.content}
              </Text>

              <Text style={styles.cardDate}>{item.date}</Text>
            </Pressable>
          )}
        />

        <Pressable style={styles.fab} onPress={handleNewNote}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
);

// Editor View
const EditorView = memo(
  ({
    colors,
    width,
    isDarkMode,
    tempTitle,
    tempContent,
    setTempTitle,
    setTempContent,
    handleSave,
    handleClose,
  }) => {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.bg }]}
        edges={['top', 'bottom']}
      >
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1557683316-973673baf926',
            }}
            style={[
              styles.editorImage,
              {
                height: width > 600 ? 250 : 160,
              },
            ]}
          >
            <View style={styles.editorHeaderActions}>
              <Pressable
                style={styles.circleBtn}
                onPress={handleClose}
              >
                <Text style={styles.btnText}>✕</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.saveBtn,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          </ImageBackground>

          <View
            style={[
              styles.inputArea,
              {
                backgroundColor: colors.bg,
              },
            ]}
          >
            <TextInput
              placeholder="Header"
              placeholderTextColor={colors.subtext}
              style={[
                styles.titleInput,
                {
                  color: colors.text,
                },
              ]}
              value={tempTitle}
              onChangeText={setTempTitle}
              autoFocus
              blurOnSubmit={false}
            />

            <TextInput
              placeholder="Start typing your note..."
              placeholderTextColor={colors.subtext}
              multiline
              scrollEnabled
              textAlignVertical="top"
              style={[
                styles.bodyInput,
                {
                  color: colors.text,
                },
              ]}
              value={tempContent}
              onChangeText={setTempContent}
              blurOnSubmit={false}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
);

export default function App() {
  const systemTheme = useColorScheme();
  const { width } = useWindowDimensions();

  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Welcome!',
      content: 'Tap the + button to create your first note.',
      date: 'May 12',
    },
  ]);

  const [isDarkMode, setIsDarkMode] = useState(
    systemTheme === 'dark'
  );

  const [currentView, setCurrentView] = useState('listing');

  const [searchQuery, setSearchQuery] = useState('');

  // Editor State
  const [tempTitle, setTempTitle] = useState('');
  const [tempContent, setTempContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Theme
  const colors = {
    bg: isDarkMode ? '#121212' : '#F2F2F7',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    subtext: isDarkMode ? '#A1A1A1' : '#636366',
    primary: '#007AFF',
    inputBg: isDarkMode ? '#2C2C2E' : '#E5E5EA',
  };

  // Actions
  const handleSave = () => {
    if (tempTitle.trim() || tempContent.trim()) {
      if (editingNoteId) {
        // Update Existing Note
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNoteId
              ? {
                  ...note,
                  title: tempTitle || 'Untitled Note',
                  content: tempContent,
                }
              : note
          )
        );
      } else {
        // Create New Note
        const newNote = {
          id: Date.now().toString(),
          title: tempTitle || 'Untitled Note',
          content: tempContent,
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        };

        setNotes((prevNotes) => [newNote, ...prevNotes]);
      }
    }

    setTempTitle('');
    setTempContent('');
    setEditingNoteId(null);
    setCurrentView('listing');
  };

  const handleOpenNote = (note) => {
    setTempTitle(note.title);
    setTempContent(note.content);
    setEditingNoteId(note.id);
    setCurrentView('editor');
  };

  const handleNewNote = () => {
    setTempTitle('');
    setTempContent('');
    setEditingNoteId(null);
    setCurrentView('editor');
  };

  const handleClose = () => {
    setTempTitle('');
    setTempContent('');
    setEditingNoteId(null);
    setCurrentView('listing');
  };

  // Filter Notes
  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        note.content
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, notes]);

  // Render
  return currentView === 'listing' ? (
    <ListingView
      colors={colors}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredNotes={filteredNotes}
      handleOpenNote={handleOpenNote}
      handleNewNote={handleNewNote}
    />
  ) : (
    <EditorView
      colors={colors}
      width={width}
      isDarkMode={isDarkMode}
      tempTitle={tempTitle}
      tempContent={tempContent}
      setTempTitle={setTempTitle}
      setTempContent={setTempContent}
      handleSave={handleSave}
      handleClose={handleClose}
    />
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
  },

  searchBar: {
    margin: 20,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  noteCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },

      android: {
        elevation: 3,
      },
    }),
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },

  cardSnippet: {
    fontSize: 14,
    lineHeight: 20,
  },

  cardDate: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 8,
    fontWeight: '500',
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },

  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -4,
  },

  // Editor
  editorImage: {
    width: '100%',
  },

  editorHeaderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    marginTop: 10,
  },

  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
  },

  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },

  inputArea: {
    flex: 1,
    padding: 20,
  },

  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  bodyInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 26,
    textAlignVertical: 'top',
  },
});