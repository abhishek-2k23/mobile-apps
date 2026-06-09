import React, { useState, useMemo, memo, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Alert,
  ScrollView,
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

// ─── Note Palettes ────────────────────────────────────────────────────────────

const NOTE_PALETTES = [
  { bg: '#FFF3E0', pin: '#E8773A', border: '#FFD9A0', ink: '#3E2723' }, // peach
  { bg: '#F3E5F5', pin: '#8E44AD', border: '#DDB8F0', ink: '#2D0040' }, // lavender
  { bg: '#E8F5E9', pin: '#27AE60', border: '#A5D6A7', ink: '#1B2E1C' }, // mint
  { bg: '#E3F2FD', pin: '#1976D2', border: '#90CAF9', ink: '#0D2137' }, // sky
  { bg: '#FCE4EC', pin: '#C2185B', border: '#F48FB1', ink: '#2D0014' }, // rose
  { bg: '#FFFDE7', pin: '#F9A825', border: '#FFF176', ink: '#2D2400' }, // lemon
  { bg: '#E0F7FA', pin: '#0097A7', border: '#80DEEA', ink: '#002B30' }, // teal
  { bg: '#FBE9E7', pin: '#D84315', border: '#FFAB91', ink: '#2D0A00' }, // coral
];

const NOTE_PALETTES_DARK = [
  { bg: '#3D2B1A', pin: '#E8773A', border: '#5A3A20', ink: '#FFDDB3' },
  { bg: '#2E1A3D', pin: '#CE93D8', border: '#3D2050', ink: '#E8C8F5' },
  { bg: '#1A2E1C', pin: '#81C784', border: '#253D27', ink: '#C8E6C9' },
  { bg: '#1A2E3D', pin: '#64B5F6', border: '#1E3A50', ink: '#BBDEFB' },
  { bg: '#3D1A28', pin: '#F48FB1', border: '#501A30', ink: '#F8BBD0' },
  { bg: '#3D3A00', pin: '#FFD54F', border: '#504D00', ink: '#FFF9C4' },
  { bg: '#003D45', pin: '#4DD0E1', border: '#005060', ink: '#B2EBF2' },
  { bg: '#3D2010', pin: '#FF8A65', border: '#502A15', ink: '#FFCCBC' },
];

function getPalette(id, isDark) {
  if (!id) return isDark ? NOTE_PALETTES_DARK[0] : NOTE_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % NOTE_PALETTES.length;
  return isDark ? NOTE_PALETTES_DARK[idx] : NOTE_PALETTES[idx];
}

function getRotation(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 3) + id.charCodeAt(i)) | 0;
  const steps = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, -1.2, 1.2, -0.8, 0.8];
  return steps[Math.abs(hash) % steps.length];
}

// ─── Global Theme ─────────────────────────────────────────────────────────────

const LIGHT = {
  bg: '#EDE8DF',
  text: '#1A1208',
  subtext: '#6B5E4A',
  muted: '#9C8B78',
  primary: '#5C4BD3',
  danger: '#E53E3E',
  border: '#D9CEBC',
  searchBg: '#F7F3EB',
};

const DARK = {
  bg: '#1C1610',
  text: '#F5EFE5',
  subtext: '#A09080',
  muted: '#6B5E4A',
  primary: '#8B83FF',
  danger: '#F87171',
  border: '#3A3028',
  searchBg: '#251F18',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ─── Pin ──────────────────────────────────────────────────────────────────────

const Pin = memo(({ color, large = false }) => {
  const d = large ? 22 : 14;
  const needleH = large ? 14 : 9;
  const shineD = large ? 7 : 4;
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: d, height: d, borderRadius: d / 2,
          backgroundColor: color,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4, shadowRadius: 3,
          elevation: 5,
          justifyContent: 'flex-start', alignItems: 'flex-end',
          paddingTop: large ? 3 : 2, paddingRight: large ? 4 : 2,
        }}
      >
        <View style={{
          width: shineD, height: shineD, borderRadius: shineD / 2,
          backgroundColor: 'rgba(255,255,255,0.6)',
        }} />
      </View>
      <View style={{
        width: 2.5, height: needleH,
        backgroundColor: color, opacity: 0.55,
        borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
      }} />
    </View>
  );
});

// ─── NoteCard ─────────────────────────────────────────────────────────────────

const NoteCard = memo(({ item, isDarkMode, onPress, onLongPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const palette = getPalette(item.id, isDarkMode);
  const rotation = getRotation(item.id);

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.95, speed: 25, bounciness: 3, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, speed: 20, bounciness: 3, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.cardWrapper}
    >
      <View style={styles.pinAnchor} pointerEvents="none">
        <Pin color={palette.pin} />
      </View>
      <Animated.View
        style={[
          styles.noteCard,
          {
            backgroundColor: palette.bg,
            borderColor: palette.border,
            transform: [{ scale }, { rotate: `${rotation}deg` }],
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: palette.ink }]} numberOfLines={2}>
          {item.title || 'Untitled'}
        </Text>
        {!!item.content && (
          <Text style={[styles.cardSnippet, { color: palette.ink }]} numberOfLines={3}>
            {item.content}
          </Text>
        )}
        <Text style={[styles.cardDate, { color: palette.ink }]}>
          {formatDate(item.updatedAt)}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = memo(({ colors, hasSearch }) => (
  <View style={styles.emptyWrap}>
    <Text style={styles.emptyIcon}>{hasSearch ? '🔍' : '📌'}</Text>
    <Text style={[styles.emptyTitle, { color: colors.text }]}>
      {hasSearch ? 'No results' : 'Board is empty'}
    </Text>
    <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
      {hasSearch ? 'Try a different search term' : 'Tap + to pin your first note'}
    </Text>
  </View>
));

// ─── ListingView ──────────────────────────────────────────────────────────────

const ListingView = memo(({
  colors, isDarkMode, setIsDarkMode,
  searchQuery, setSearchQuery,
  filteredNotes, handleOpenDetail, handleNewNote, handleDeleteNote,
}) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  const count = filteredNotes.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <View>
          <Text style={[styles.headerDate, { color: colors.muted }]}>{today}</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {count > 0 ? `${count} ${count === 1 ? 'Note' : 'Notes'}` : 'My Board'}
          </Text>
        </View>
        <Pressable
          onPress={() => setIsDarkMode(v => !v)}
          style={[styles.themeBtn, { backgroundColor: colors.searchBg, borderColor: colors.border }]}
        >
          <Text style={{ fontSize: 18 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
        </Pressable>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.searchBg, borderColor: colors.border }]}>
        <Text style={{ fontSize: 16, color: colors.muted, marginRight: 8 }}>⌕</Text>
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
            <Text style={{ color: colors.muted, paddingLeft: 8, fontSize: 14 }}>✕</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrap}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.listContent, filteredNotes.length === 0 && { flex: 1 }]}
        ListEmptyComponent={<EmptyState colors={colors} hasSearch={!!searchQuery} />}
        renderItem={({ item }) => (
          <NoteCard
            item={item}
            isDarkMode={isDarkMode}
            onPress={() => handleOpenDetail(item)}
            onLongPress={() => handleDeleteNote(item.id)}
          />
        )}
      />

      <Pressable
        style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
        onPress={handleNewNote}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
});

// ─── DetailView ───────────────────────────────────────────────────────────────

const DetailView = memo(({ note, isDarkMode, onBack, onEdit, onDelete }) => {
  const palette = getPalette(note.id, isDarkMode);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(48)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.detailTopBar}>
        <Pressable onPress={onBack} style={[styles.topBarBtn, { backgroundColor: `${palette.ink}14` }]}>
          <Text style={[styles.topBarBtnText, { color: palette.ink }]}>← Back</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={[styles.topBarBtn, { backgroundColor: `${palette.ink}14` }]}>
          <Text style={{ color: palette.ink, opacity: 0.7, fontSize: 17 }}>🗑</Text>
        </Pressable>
      </View>

      <View style={styles.detailPinWrap}>
        <Pin color={palette.pin} large />
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          contentContainerStyle={styles.detailContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.detailTitle, { color: palette.ink }]}>
            {note.title || 'Untitled Note'}
          </Text>

          <View style={[styles.detailRule, { backgroundColor: palette.pin }]} />

          {note.content ? (
            <Text style={[styles.detailBody, { color: palette.ink }]}>
              {note.content}
            </Text>
          ) : (
            <Text style={[styles.detailBodyEmpty, { color: palette.ink }]}>
              No content
            </Text>
          )}

          <Text style={[styles.detailDate, { color: palette.ink }]}>
            {formatFullDate(note.updatedAt)}
          </Text>
        </ScrollView>
      </Animated.View>

      <Pressable
        onPress={onEdit}
        style={({ pressed }) => [
          styles.editFab,
          { backgroundColor: palette.pin, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={styles.editFabText}>✏️</Text>
      </Pressable>
    </SafeAreaView>
  );
});

// ─── EditorView ───────────────────────────────────────────────────────────────

const EditorView = memo(({
  colors, isDarkMode,
  tempTitle, tempContent, setTempTitle, setTempContent,
  handleSave, handleClose, isEditing, editNoteId,
}) => {
  const palette = editNoteId ? getPalette(editNoteId, isDarkMode) : null;
  const bg = palette ? palette.bg : colors.bg;
  const ink = palette ? palette.ink : colors.text;
  const borderColor = palette ? palette.border : colors.border;
  const btnBg = palette ? palette.pin : colors.primary;
  const mutedColor = palette ? `${palette.ink}66` : colors.muted;

  const wordCount = tempContent.trim() ? tempContent.trim().split(/\s+/).length : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={[styles.editorToolbar, { borderBottomColor: borderColor }]}>
          <Pressable style={[styles.toolbarBtn, { backgroundColor: `${ink}14` }]} onPress={handleClose}>
            <Text style={[styles.toolbarBtnText, { color: ink }]}>← Back</Text>
          </Pressable>
          <Text style={[styles.toolbarStatus, { color: mutedColor }]}>
            {isEditing ? 'Editing' : 'New Note'}
          </Text>
          <Pressable style={[styles.saveBtn, { backgroundColor: btnBg }]} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
        </View>

        <View style={[styles.inputArea, { backgroundColor: bg }]}>
          <TextInput
            placeholder="Title"
            placeholderTextColor={mutedColor}
            style={[styles.titleInput, { color: ink }]}
            value={tempTitle}
            onChangeText={setTempTitle}
            autoFocus
            blurOnSubmit={false}
            returnKeyType="next"
            maxLength={100}
          />
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <TextInput
            placeholder="Start writing…"
            placeholderTextColor={mutedColor}
            multiline
            scrollEnabled
            textAlignVertical="top"
            style={[styles.bodyInput, { color: ink }]}
            value={tempContent}
            onChangeText={setTempContent}
            blurOnSubmit={false}
          />
        </View>

        <View style={[styles.editorFooter, { backgroundColor: bg, borderTopColor: borderColor }]}>
          <Text style={[styles.footerStat, { color: mutedColor }]}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </Text>
          <Text style={[styles.footerStat, { color: mutedColor }]}>{tempContent.length} chars</Text>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const systemTheme = useColorScheme();
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');
  const [currentView, setCurrentView] = useState('listing'); // 'listing' | 'detail' | 'editor'
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempTitle, setTempTitle] = useState('');
  const [tempContent, setTempContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  const colors = isDarkMode ? DARK : LIGHT;

  useEffect(() => {
    readNotes()
      .then(saved => { if (saved.length) setNotes(saved); })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) writeNotes(notes);
  }, [notes, loaded]);

  const handleSave = useCallback(() => {
    if (!tempTitle.trim() && !tempContent.trim()) {
      setCurrentView(editingNoteId ? 'detail' : 'listing');
      return;
    }
    const now = new Date().toISOString();
    if (editingNoteId) {
      const patch = { title: tempTitle, content: tempContent, updatedAt: now };
      setNotes(prev => prev.map(n => n.id === editingNoteId ? { ...n, ...patch } : n));
      setActiveNote(prev => ({ ...prev, ...patch }));
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: tempTitle, content: tempContent,
        createdAt: now, updatedAt: now,
      };
      setNotes(prev => [newNote, ...prev]);
      setActiveNote(newNote);
    }
    setTempTitle('');
    setTempContent('');
    setEditingNoteId(null);
    setCurrentView('detail');
  }, [editingNoteId, tempTitle, tempContent]);

  const handleOpenDetail = useCallback(note => {
    setActiveNote(note);
    setCurrentView('detail');
  }, []);

  const handleEditFromDetail = useCallback(() => {
    if (!activeNote) return;
    setTempTitle(activeNote.title);
    setTempContent(activeNote.content ?? '');
    setEditingNoteId(activeNote.id);
    setCurrentView('editor');
  }, [activeNote]);

  const handleNewNote = useCallback(() => {
    setTempTitle('');
    setTempContent('');
    setEditingNoteId(null);
    setActiveNote(null);
    setCurrentView('editor');
  }, []);

  const handleCloseEditor = useCallback(() => {
    setTempTitle('');
    setTempContent('');
    setCurrentView(editingNoteId ? 'detail' : 'listing');
    setEditingNoteId(null);
  }, [editingNoteId]);

  const handleBackFromDetail = useCallback(() => {
    setActiveNote(null);
    setCurrentView('listing');
  }, []);

  const handleDeleteFromDetail = useCallback(() => {
    if (!activeNote) return;
    const id = activeNote.id;
    Alert.alert('Delete Note', 'Delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => {
          setNotes(prev => prev.filter(n => n.id !== id));
          setActiveNote(null);
          setCurrentView('listing');
        },
      },
    ]);
  }, [activeNote]);

  const handleDeleteNote = useCallback(id => {
    Alert.alert('Delete Note', 'Delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setNotes(prev => prev.filter(n => n.id !== id)) },
    ]);
  }, []);

  const filteredNotes = useMemo(
    () => notes.filter(n =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery, notes]
  );

  if (!loaded) return null;

  if (currentView === 'detail' && activeNote) {
    return (
      <DetailView
        note={activeNote}
        isDarkMode={isDarkMode}
        onBack={handleBackFromDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />
    );
  }

  if (currentView === 'editor') {
    return (
      <EditorView
        colors={colors}
        isDarkMode={isDarkMode}
        tempTitle={tempTitle}
        tempContent={tempContent}
        setTempTitle={setTempTitle}
        setTempContent={setTempContent}
        handleSave={handleSave}
        handleClose={handleCloseEditor}
        isEditing={!!editingNoteId}
        editNoteId={editingNoteId}
      />
    );
  }

  return (
    <ListingView
      colors={colors}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredNotes={filteredNotes}
      handleOpenDetail={handleOpenDetail}
      handleNewNote={handleNewNote}
      handleDeleteNote={handleDeleteNote}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ── Listing header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
  },
  headerDate: { fontSize: 11, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 2 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  themeBtn: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },

  // ── Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },

  // ── Grid
  columnWrap: { paddingHorizontal: 12 },
  listContent: { paddingBottom: 120, paddingTop: 4 },

  // ── Pinned card
  cardWrapper: { flex: 1, margin: 6, paddingTop: 18 },
  pinAnchor: {
    position: 'absolute', top: 0, left: 0, right: 0,
    alignItems: 'center', zIndex: 10,
  },
  noteCard: {
    borderRadius: 6, padding: 14, paddingTop: 20,
    borderWidth: 1, minHeight: 110,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.18, shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6, lineHeight: 20 },
  cardSnippet: { fontSize: 13, lineHeight: 19, opacity: 0.72, marginBottom: 8 },
  cardDate: { fontSize: 10, fontWeight: '500', opacity: 0.45, marginTop: 4 },

  // ── Empty state
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14 },

  // ── FAB
  fab: {
    position: 'absolute', right: 24, bottom: 36,
    width: 58, height: 58, borderRadius: 29,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
    }),
  },
  fabText: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -2 },

  // ── Detail
  detailTopBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  topBarBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  topBarBtnText: { fontSize: 14, fontWeight: '600' },
  detailPinWrap: { alignItems: 'center', marginBottom: 6 },
  detailContent: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 120 },
  detailTitle: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5, lineHeight: 42, marginBottom: 18 },
  detailRule: { height: 3, width: 52, borderRadius: 2, opacity: 0.4, marginBottom: 22 },
  detailBody: { fontSize: 17, lineHeight: 29, opacity: 0.82, marginBottom: 36 },
  detailBodyEmpty: { fontSize: 15, fontStyle: 'italic', opacity: 0.38, marginBottom: 36 },
  detailDate: { fontSize: 12, fontWeight: '500', opacity: 0.4 },
  editFab: {
    position: 'absolute', right: 24, bottom: 40,
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 },
    }),
  },
  editFabText: { fontSize: 22 },

  // ── Editor
  editorToolbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1,
  },
  toolbarBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  toolbarBtnText: { fontSize: 14, fontWeight: '600' },
  toolbarStatus: { fontSize: 13, fontWeight: '500' },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  inputArea: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  titleInput: { fontSize: 28, fontWeight: '800', marginBottom: 16, letterSpacing: -0.3 },
  divider: { height: 1, marginBottom: 16 },
  bodyInput: { flex: 1, fontSize: 16, lineHeight: 26 },
  editorFooter: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 16,
    paddingHorizontal: 24, paddingVertical: 10, borderTopWidth: 1,
  },
  footerStat: { fontSize: 12, fontWeight: '500' },
});
