import React, { useState, useMemo, memo, useEffect, useCallback } from 'react';
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
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';

const NOTES_FILE = FileSystem.documentDirectory + 'notes.json';

async function readNotes() {
  try {
    const info = await FileSystem.getInfoAsync(NOTES_FILE);
    if (!info.exists) return [];
    const raw = await FileSystem.readAsStringAsync(NOTES_FILE);
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeNotes(notes) {
  await FileSystem.writeAsStringAsync(NOTES_FILE, JSON.stringify(notes));
}

// ─── Theme ───────────────────────────────────────────────────────────────────

const LIGHT = {
  bg: '#F7F8FC',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F8',
  text: '#0D0F1A',
  subtext: '#6B7280',
  muted: '#9CA3AF',
  primary: '#6C63FF',
  primaryLight: '#EDE9FF',
  danger: '#EF4444',
  border: '#E5E7EB',
  cardShadow: '#00000014',
};

const DARK = {
  bg: '#0D0F1A',
  surface: '#161824',
  surfaceAlt: '#1E2130',
  text: '#F1F3FA',
  subtext: '#9CA3AF',
  muted: '#6B7280',
  primary: '#8B83FF',
  primaryLight: '#2A2560',
  danger: '#F87171',
  border: '#2A2D3E',
  cardShadow: '#00000040',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / 86400000);
  if (days === 0) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── NoteCard ─────────────────────────────────────────────────────────────────

const NoteCard = memo(({ item, colors, onPress, onLongPress }) => {
  const scale = new Animated.Value(1);

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 20 }).start();

  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.noteCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.cardShadow,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.cardTop}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title || 'Untitled Note'}
          </Text>
          <Text style={[styles.cardDate, { color: colors.muted }]}>
            {formatDate(item.updatedAt)}
          </Text>
        </View>
        {!!item.content && (
          <Text style={[styles.cardSnippet, { color: colors.subtext }]} numberOfLines={2}>
            {item.content}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
});

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = memo(({ colors, hasSearch }) => (
  <View style={styles.emptyWrap}>
    <Text style={styles.emptyIcon}>{hasSearch ? '🔍' : '📝'}</Text>
    <Text style={[styles.emptyTitle, { color: colors.text }]}>
      {hasSearch ? 'No results' : 'No notes yet'}
    </Text>
    <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
      {hasSearch ? 'Try a different search term' : 'Tap + to create your first note'}
    </Text>
  </View>
));

// ─── ListingView ─────────────────────────────────────────────────────────────

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
    handleDeleteNote,
  }) => {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerLabel, { color: colors.subtext }]}>My Notes</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Notes</Text>
          </View>
          <Pressable
            onPress={() => setIsDarkMode((v) => !v)}
            style={[styles.themeBtn, { backgroundColor: colors.surfaceAlt }]}
          >
            <Text style={styles.themeBtnIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={[styles.searchIcon, { color: colors.muted }]}>⌕</Text>
          <TextInput
            placeholder="Search notes…"
            placeholderTextColor={colors.muted}
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {!!searchQuery && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={[styles.searchClear, { color: colors.muted }]}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Note count */}
        {filteredNotes.length > 0 && (
          <Text style={[styles.noteCount, { color: colors.muted }]}>
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
          </Text>
        )}

        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.listContent, filteredNotes.length === 0 && { flex: 1 }]}
          ListEmptyComponent={<EmptyState colors={colors} hasSearch={!!searchQuery} />}
          renderItem={({ item }) => (
            <NoteCard
              item={item}
              colors={colors}
              onPress={() => handleOpenNote(item)}
              onLongPress={() => handleDeleteNote(item.id)}
            />
          )}
        />

        {/* FAB */}
        <Pressable
          style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          onPress={handleNewNote}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
);

// ─── EditorView ───────────────────────────────────────────────────────────────

const EditorView = memo(
  ({
    colors,
    isDarkMode,
    tempTitle,
    tempContent,
    setTempTitle,
    setTempContent,
    handleSave,
    handleClose,
    isEditing,
  }) => {
    const wordCount = tempContent.trim() ? tempContent.trim().split(/\s+/).length : 0;
    const charCount = tempContent.length;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Editor toolbar */}
          <View style={[styles.editorToolbar, { borderBottomColor: colors.border }]}>
            <Pressable
              style={[styles.toolbarBtn, { backgroundColor: colors.surfaceAlt }]}
              onPress={handleClose}
            >
              <Text style={[styles.toolbarBtnText, { color: colors.subtext }]}>← Back</Text>
            </Pressable>

            <Text style={[styles.toolbarStatus, { color: colors.muted }]}>
              {isEditing ? 'Editing' : 'New Note'}
            </Text>

            <Pressable
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          </View>

          {/* Input area */}
          <View style={[styles.inputArea, { backgroundColor: colors.bg }]}>
            <TextInput
              placeholder="Title"
              placeholderTextColor={colors.muted}
              style={[styles.titleInput, { color: colors.text }]}
              value={tempTitle}
              onChangeText={setTempTitle}
              autoFocus
              blurOnSubmit={false}
              returnKeyType="next"
              maxLength={100}
            />

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TextInput
              placeholder="Start typing your note…"
              placeholderTextColor={colors.muted}
              multiline
              scrollEnabled
              textAlignVertical="top"
              style={[styles.bodyInput, { color: colors.text }]}
              value={tempContent}
              onChangeText={setTempContent}
              blurOnSubmit={false}
            />
          </View>

          {/* Footer stats */}
          <View style={[styles.editorFooter, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
            <Text style={[styles.footerStat, { color: colors.muted }]}>
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </Text>
            <Text style={[styles.footerStat, { color: colors.muted }]}>{charCount} chars</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
);

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const systemTheme = useColorScheme();

  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');
  const [currentView, setCurrentView] = useState('listing');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempTitle, setTempTitle] = useState('');
  const [tempContent, setTempContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  const colors = isDarkMode ? DARK : LIGHT;

  // ── Persistence ────────────────────────────────────────────────────────────

  useEffect(() => {
    readNotes().then((saved) => {
      if (saved.length) setNotes(saved);
    }).finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) writeNotes(notes);
  }, [notes, loaded]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    if (!tempTitle.trim() && !tempContent.trim()) {
      setCurrentView('listing');
      return;
    }
    const now = new Date().toISOString();
    if (editingNoteId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNoteId
            ? { ...n, title: tempTitle, content: tempContent, updatedAt: now }
            : n
        )
      );
    } else {
      setNotes((prev) => [
        { id: Date.now().toString(), title: tempTitle, content: tempContent, createdAt: now, updatedAt: now },
        ...prev,
      ]);
    }
    setTempTitle('');
    setTempContent('');
    setEditingNoteId(null);
    setCurrentView('listing');
  }, [editingNoteId, tempTitle, tempContent]);

  const handleOpenNote = useCallback((note) => {
    setTempTitle(note.title);
    setTempContent(note.content);
    setEditingNoteId(note.id);
    setCurrentView('editor');
  }, []);

  const handleNewNote = useCallback(() => {
    setTempTitle('');
    setTempContent('');
    setEditingNoteId(null);
    setCurrentView('editor');
  }, []);

  const handleClose = useCallback(() => {
    setTempTitle('');
    setTempContent('');
    setEditingNoteId(null);
    setCurrentView('listing');
  }, []);

  const handleDeleteNote = useCallback((id) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setNotes((prev) => prev.filter((n) => n.id !== id)),
      },
    ]);
  }, []);

  const filteredNotes = useMemo(
    () =>
      notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, notes]
  );

  if (!loaded) return null;

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
      handleDeleteNote={handleDeleteNote}
    />
  ) : (
    <EditorView
      colors={colors}
      isDarkMode={isDarkMode}
      tempTitle={tempTitle}
      tempContent={tempContent}
      setTempTitle={setTempTitle}
      setTempContent={setTempContent}
      handleSave={handleSave}
      handleClose={handleClose}
      isEditing={!!editingNoteId}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  headerTitle: { fontSize: 36, fontWeight: '800', letterSpacing: -0.5 },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeBtnIcon: { fontSize: 20 },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15 },
  searchClear: { fontSize: 14, paddingLeft: 8 },

  noteCount: { fontSize: 12, fontWeight: '500', paddingHorizontal: 24, marginBottom: 8 },

  // List
  listContent: { paddingHorizontal: 24, paddingBottom: 120 },

  // Note card
  noteCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 },
      android: { elevation: 2 },
    }),
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '700', flex: 1, marginRight: 8 },
  cardDate: { fontSize: 11, fontWeight: '500' },
  cardSnippet: { fontSize: 14, lineHeight: 20 },

  // Empty state
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14 },

  // FAB
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12 },
    }),
  },
  fabText: { color: '#FFF', fontSize: 30, fontWeight: '300', marginTop: -2 },

  // Editor toolbar
  editorToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  toolbarBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  toolbarBtnText: { fontSize: 14, fontWeight: '600' },
  toolbarStatus: { fontSize: 13, fontWeight: '500' },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  // Editor inputs
  inputArea: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  titleInput: { fontSize: 28, fontWeight: '800', marginBottom: 16, letterSpacing: -0.3 },
  divider: { height: 1, marginBottom: 16 },
  bodyInput: { flex: 1, fontSize: 16, lineHeight: 26 },

  // Editor footer
  editorFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  footerStat: { fontSize: 12, fontWeight: '500' },
});
