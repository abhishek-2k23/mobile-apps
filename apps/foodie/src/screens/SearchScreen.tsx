import {
  View, Text, TextInput, StyleSheet, FlatList, Pressable,
  ScrollView, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState, useMemo, useCallback } from "react";
import { IconSearch, IconStar, IconClock } from "../icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FoodImage from "../components/FoodImage";
import { C, GRAD } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES, RESTAURANTS, type Restaurant } from "../constants/data";
import { useFocusEffect } from "@react-navigation/native";
import { useQuote } from "../hooks/useQuote";
import { QuoteCard } from "../components/QuoteCard";

const { width: SW } = Dimensions.get("window");
const COL_W = (SW - 20 * 2 - 10) / 2;

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const { C, GRAD } = useTheme();
  const s = useMemo(() => makeStyles(C, GRAD), [C]);
  const { quote, next } = useQuote();
  useFocusEffect(useCallback(() => { next(); }, [next]));

  const filtered = RESTAURANTS.filter((r) =>
    `${r.name} ${r.cuisine} ${r.category}`.toLowerCase().includes(query.toLowerCase())
  );

  const openRestaurant = (item: Restaurant) =>
    navigation.navigate("RestaurantDetail", {
      id: item.id, name: item.name, price: item.price,
      image: item.image, cuisine: item.cuisine, rating: item.rating, time: item.time,
    });

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={["top"]}>

        {/* Search bar row */}
        <View style={s.header}>
          <Pressable style={s.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={C.text} />
          </Pressable>
          <View style={s.inputWrap}>
            <IconSearch size={17} color={C.text40} />
            <TextInput
              ref={inputRef}
              style={s.input}
              placeholder="Search dishes or restaurants…"
              placeholderTextColor={C.text20}
              value={query}
              onChangeText={setQuery}
              autoFocus
              selectionColor={C.amber}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable hitSlop={10} onPress={() => setQuery("")}>
                <MaterialCommunityIcons name="close-circle" size={18} color={C.text40} />
              </Pressable>
            )}
          </View>
        </View>

        {query.length === 0 ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.browseContent}>

            {/* Quote of the moment */}
            <View style={s.quoteWrap}>
              <QuoteCard key={quote.text} quote={quote} />
            </View>

            {/* Category image grid */}
            <Text style={s.sectionTitle}>Browse by category</Text>
            <View style={s.catGrid}>
              {CATEGORIES.map((cat) => (
                <Pressable key={cat.label} style={s.catCard} onPress={() => setQuery(cat.label)}>
                  <FoodImage uri={cat.image} style={s.catImg} />
                  <LinearGradient colors={["transparent", "rgba(12,9,6,0.90)"]} style={StyleSheet.absoluteFill} />
                  <View style={s.catBadge}>
                    <Text style={s.catLabel}>{cat.label}</Text>
                    <Text style={s.catCount}>
                      {RESTAURANTS.filter((r) => r.category === cat.label).length} places
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* All restaurants */}
            <Text style={s.sectionTitle}>All restaurants</Text>
            {RESTAURANTS.map((item) => (
              <RestaurantRow key={item.id} item={item} onPress={() => openRestaurant(item)} />
            ))}
          </ScrollView>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.resultsList}
            ListHeaderComponent={
              <Text style={s.resultsHeader}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query}"
              </Text>
            }
            renderItem={({ item }) => (
              <RestaurantRow item={item} onPress={() => openRestaurant(item)} />
            )}
            ListEmptyComponent={
              <View style={s.empty}>
                <MaterialCommunityIcons name="food-off-outline" size={40} color={C.text20} />
                <Text style={s.emptyTitle}>Nothing found</Text>
                <Text style={s.emptyText}>Try a different dish or restaurant name.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function RestaurantRow({ item, onPress }: { item: Restaurant; onPress: () => void }) {
  const { C, GRAD } = useTheme();
  const rs = useMemo(() => makeRsStyles(C), [C]);
  return (
    <Pressable style={rs.card} onPress={onPress}>
      <View style={rs.imgWrap}>
        <FoodImage uri={item.image} style={rs.img} />
        <LinearGradient colors={GRAD.dark} style={rs.imgGrad} />
        <View style={rs.offerPill}>
          <Text style={rs.offerText}>{item.offer}</Text>
        </View>
      </View>
      <View style={rs.body}>
        <View style={rs.titleRow}>
          <Text style={rs.name} numberOfLines={1}>{item.name}</Text>
          <View style={rs.ratingPill}>
            <IconStar size={11} color={C.amber} />
            <Text style={rs.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={rs.cuisine} numberOfLines={1}>{item.cuisine}</Text>
        <View style={rs.meta}>
          <View style={rs.metaItem}>
            <IconClock size={12} color={C.text40} />
            <Text style={rs.metaText}>{item.time}</Text>
          </View>
          <Text style={rs.dot}>·</Text>
          <Text style={rs.metaText}>{item.distance}</Text>
          <Text style={rs.price}>From ₹{item.price}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const makeStyles = (C: any, GRAD: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: C.cardN, borderWidth: 1, borderColor: C.borderN,
    alignItems: "center", justifyContent: "center",
  },
  inputWrap: {
    flex: 1, height: 46, flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: C.card2, borderRadius: 14,
    borderWidth: 1, borderColor: C.border2, paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 15, color: C.text },

  browseContent: { paddingHorizontal: 20, paddingBottom: 32 },
  quoteWrap: { marginBottom: 24, marginTop: 4 },
  sectionTitle:  { color: C.text, fontSize: 18, fontWeight: "800", marginBottom: 14, marginTop: 4 },

  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 },
  catCard: {
    width: COL_W, height: 110, borderRadius: 18, overflow: "hidden",
    backgroundColor: C.card, justifyContent: "flex-end",
    borderWidth: 1, borderColor: C.border,
  },
  catImg:   { width: "100%", height: "100%", position: "absolute" as any },
  catBadge: { padding: 12 },
  catLabel: { color: C.text, fontSize: 15, fontWeight: "900" },
  catCount: { color: C.text60, fontSize: 11, fontWeight: "700", marginTop: 2 },

  resultsList:   { paddingHorizontal: 20, paddingBottom: 32 },
  resultsHeader: { color: C.text60, fontSize: 13, fontWeight: "700", marginBottom: 14, marginTop: 4 },

  empty: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyTitle: { color: C.text80, fontSize: 17, fontWeight: "800" },
  emptyText:  { color: C.text40, fontSize: 13 },
});

const makeRsStyles = (C: any) => StyleSheet.create({
  card: {
    flexDirection: "row", gap: 0, marginBottom: 14,
    backgroundColor: C.card, borderRadius: 18,
    borderWidth: 1, borderColor: C.border, overflow: "hidden",
  },
  imgWrap: { width: 110, height: 110, position: "relative" },
  img:     { width: "100%", height: "100%" },
  imgGrad: { position: "absolute", bottom: 0, left: 0, right: 0, height: 50 },
  offerPill: {
    position: "absolute", bottom: 8, left: 8,
    backgroundColor: C.amber, borderRadius: 7,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  offerText: { color: "#0C0906", fontSize: 9, fontWeight: "900" },
  body:     { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  name:     { flex: 1, color: C.text, fontSize: 15, fontWeight: "800" },
  ratingPill: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: C.amberLo, borderRadius: 7,
    paddingHorizontal: 6, paddingVertical: 3,
  },
  ratingText: { color: C.amber, fontSize: 11, fontWeight: "800" },
  cuisine:    { color: C.text60, fontSize: 12, marginBottom: 10 },
  meta:       { flexDirection: "row", alignItems: "center", gap: 6 },
  metaItem:   { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText:   { color: C.text40, fontSize: 11, fontWeight: "600" },
  dot:        { color: C.text20, fontSize: 12 },
  price:      { color: C.amber, fontSize: 11, fontWeight: "800", marginLeft: "auto" as any },
});
