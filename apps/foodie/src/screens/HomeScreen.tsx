import { View, Text, FlatList, Pressable, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { IconSearch, IconStar, IconClock, IconLocation } from "../icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FoodImage from "../components/FoodImage";
import { useAuth } from "../context/AuthContext";
import { C, GRAD } from "../constants/colors";
import { CATEGORIES, RESTAURANTS, HERO_BANNER, type Restaurant } from "../constants/data";

const { width: SW } = Dimensions.get("window");

const FEATURED = RESTAURANTS.filter((r) => r.featured);

export default function HomeScreen({ navigation }: any) {
  const { vegMode } = useAuth();
  const [foodType, setFoodType] = useState<"veg" | "nonveg">(vegMode ? "veg" : "nonveg");
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    setFoodType(vegMode ? "veg" : "nonveg");
  }, [vegMode]);

  const visibleRestaurants = RESTAURANTS.filter(
    (r) => r.type === foodType && (!category || r.category === category)
  );

  const openRestaurant = (item: Restaurant) => {
    navigation.navigate("RestaurantDetail", {
      id: item.id, name: item.name, price: item.price,
      image: item.image, cuisine: item.cuisine, rating: item.rating, time: item.time,
    });
  };

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={["top"]}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.locationBlock}>
            <View style={s.locationRow}>
              <IconLocation size={13} color={C.amber} />
              <Text style={s.locationLabel}>18 min delivery</Text>
            </View>
            <Text style={s.locationCity}>Bengaluru, India</Text>
          </View>

          {/* Veg / Non-veg toggle — redesigned */}
          <View style={s.toggle}>
            <Pressable
              style={[s.toggleSide, foodType === "veg" && s.toggleVegActive]}
              onPress={() => setFoodType("veg")}
            >
              <MaterialCommunityIcons
                name="leaf"
                size={15}
                color={foodType === "veg" ? "#fff" : C.emerald}
              />
              <Text style={[s.toggleLabel, foodType === "veg" && s.toggleLabelActive]}>Veg</Text>
            </Pressable>
            <View style={s.toggleDivider} />
            <Pressable
              style={[s.toggleSide, foodType === "nonveg" && s.toggleNvActive]}
              onPress={() => setFoodType("nonveg")}
            >
              <MaterialCommunityIcons
                name="food-drumstick"
                size={15}
                color={foodType === "nonveg" ? "#fff" : C.ruby}
              />
              <Text style={[s.toggleLabel, foodType === "nonveg" && s.toggleLabelActive]}>Non-veg</Text>
            </Pressable>
          </View>
        </View>

        {/* Search bar */}
        <Pressable style={s.searchBar} onPress={() => navigation.navigate("Search")}>
          <IconSearch size={18} color={C.text40} />
          <Text style={s.searchText}>Search for bowls, tandoor, desserts…</Text>
          <View style={s.searchBadge}>
            <MaterialCommunityIcons name="tune-variant" size={16} color={C.amber} />
          </View>
        </Pressable>

        <FlatList
          data={visibleRestaurants}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
          ListHeaderComponent={
            <>
              {/* ── Hero Banner ── */}
              <Pressable style={s.hero} onPress={() => openRestaurant(RESTAURANTS[2])}>
                <FoodImage uri={HERO_BANNER.image} style={s.heroImg} />
                <LinearGradient colors={GRAD.hero} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
                <LinearGradient colors={GRAD.heroTop} style={s.heroTopGrad} />
                <View style={s.heroTagRow}>
                  <View style={s.heroTag}>
                    <Text style={s.heroTagText}>{HERO_BANNER.tag}</Text>
                  </View>
                </View>
                <View style={s.heroContent}>
                  <Text style={s.heroTitle}>{HERO_BANNER.title}</Text>
                  <Text style={s.heroSub}>{HERO_BANNER.sub}</Text>
                  <View style={s.heroBtn}>
                    <LinearGradient colors={GRAD.amber} style={s.heroBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Text style={s.heroBtnText}>Order Now</Text>
                    </LinearGradient>
                  </View>
                </View>
              </Pressable>

              {/* ── Categories ── */}
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Find your mood</Text>
                <Text style={s.sectionAction} onPress={() => setCategory(null)}>All</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catContent}>
                {CATEGORIES.map((cat) => {
                  const isActive = category === cat.label;
                  return (
                    <Pressable key={cat.label} style={s.catTile} onPress={() => setCategory(isActive ? null : cat.label)}>
                      <FoodImage uri={cat.image} style={s.catImg} />
                      <LinearGradient colors={["transparent", "rgba(12,9,6,0.82)"]} style={StyleSheet.absoluteFill} />
                      {isActive && <View style={s.catActiveBorder} />}
                      <Text style={s.catLabel}>{cat.label}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* ── Featured ── */}
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Featured</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.featuredContent}>
                {FEATURED.map((item) => (
                  <Pressable key={item.id} style={s.featCard} onPress={() => openRestaurant(item)}>
                    <FoodImage uri={item.image} style={s.featImg} />
                    <LinearGradient colors={GRAD.dark} style={s.featGrad} />
                    <View style={s.featOfferPill}>
                      <Text style={s.featOfferText}>{item.offer}</Text>
                    </View>
                    <View style={s.featBody}>
                      <Text style={s.featName} numberOfLines={1}>{item.name}</Text>
                      <View style={s.featMeta}>
                        <IconStar size={11} color={C.amber} />
                        <Text style={s.featMetaText}>{item.rating}</Text>
                        <IconClock size={11} color={C.text40} />
                        <Text style={s.featMetaText}>{item.time}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>

              {/* ── Near You heading ── */}
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Near you</Text>
                <Text style={s.sectionAction}>Sort</Text>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <Pressable style={s.card} onPress={() => openRestaurant(item)}>
              <View style={s.cardImgWrap}>
                <FoodImage uri={item.image} style={s.cardImg} />
                <LinearGradient colors={GRAD.dark} style={s.cardImgGrad} />
                <View style={s.cardOfferPill}>
                  <Text style={s.cardOfferText}>{item.offer}</Text>
                </View>
                <View style={s.cardTypeDot}>
                  <MaterialCommunityIcons
                    name={item.type === "veg" ? "leaf" : "food-drumstick"}
                    size={13}
                    color={item.type === "veg" ? C.emerald : C.ruby}
                  />
                </View>
              </View>
              <View style={s.cardBody}>
                <View style={s.cardTitleRow}>
                  <Text style={s.cardName} numberOfLines={1}>{item.name}</Text>
                  <View style={s.ratingPill}>
                    <IconStar size={11} color={C.amber} />
                    <Text style={s.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={s.cardCuisine} numberOfLines={1}>{item.cuisine}</Text>
                <View style={s.cardMeta}>
                  <View style={s.metaRow}>
                    <IconClock size={12} color={C.text40} />
                    <Text style={s.metaText}>{item.time}</Text>
                  </View>
                  <Text style={s.dot}>·</Text>
                  <Text style={s.metaText}>{item.distance}</Text>
                  <Text style={s.priceText}>From ₹{item.price}</Text>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={s.emptyResults}>
              <Text style={s.emptyTitle}>No {foodType} picks here yet</Text>
              <Text style={s.emptyAction} onPress={() => setCategory(null)}>Clear filter</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, gap: 14 },
  locationBlock: { flex: 1, gap: 3 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  locationLabel: { fontSize: 11, color: C.amber, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.4 },
  locationCity: { fontSize: 20, fontWeight: "800", color: C.text },

  // ── New Veg/NonVeg toggle ──
  toggle: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.card2, borderRadius: 14,
    borderWidth: 1, borderColor: C.border2, overflow: "hidden",
  },
  toggleSide: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 11, paddingVertical: 9,
  },
  toggleVegActive: { backgroundColor: C.emerald },
  toggleNvActive:  { backgroundColor: C.ruby },
  toggleDivider: { width: 1, height: 28, backgroundColor: C.border2 },
  toggleLabel: { fontSize: 12, fontWeight: "800", color: C.text60 },
  toggleLabelActive: { color: "#fff" },

  searchBar: {
    marginHorizontal: 20, marginBottom: 16, height: 48, borderRadius: 14,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14,
  },
  searchText: { flex: 1, color: C.text40, fontSize: 14, fontWeight: "600" },
  searchBadge: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.amberLo, alignItems: "center", justifyContent: "center",
  },

  listContent: { paddingBottom: 32 },

  hero: { marginHorizontal: 20, marginBottom: 24, height: 230, borderRadius: 22, overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", position: "absolute" as any },
  heroTopGrad: { position: "absolute", top: 0, left: 0, right: 0, height: 80 },
  heroTagRow: { position: "absolute", top: 14, left: 14 },
  heroTag: { backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amber, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  heroTagText: { color: C.amber, fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.5 },
  heroContent: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 18 },
  heroTitle: { fontSize: 28, fontWeight: "900", color: C.text, letterSpacing: -0.8, marginBottom: 4 },
  heroSub:   { fontSize: 13, color: C.text60, marginBottom: 14 },
  heroBtn:   { alignSelf: "flex-start" },
  heroBtnGrad: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999 },
  heroBtnText: { color: "#fff", fontSize: 13, fontWeight: "800" },

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle:  { fontSize: 18, fontWeight: "800", color: C.text },
  sectionAction: { fontSize: 13, color: C.amber, fontWeight: "800" },

  catContent: { paddingHorizontal: 20, gap: 10, paddingBottom: 26 },
  catTile: { width: 86, height: 64, borderRadius: 14, overflow: "hidden", justifyContent: "flex-end" },
  catImg:  { width: "100%", height: "100%", position: "absolute" as any },
  catActiveBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 14, borderWidth: 2, borderColor: C.amber },
  catLabel: { color: C.text, fontSize: 11, fontWeight: "800", paddingHorizontal: 8, paddingBottom: 7 },

  featuredContent: { paddingHorizontal: 20, gap: 12, paddingBottom: 26 },
  featCard: { width: 180, borderRadius: 18, overflow: "hidden", backgroundColor: C.card2, borderWidth: 1, borderColor: C.border },
  featImg:  { width: "100%", height: 130 },
  featGrad: { position: "absolute", top: 70, left: 0, right: 0, height: 60 },
  featOfferPill: { position: "absolute", top: 10, left: 10, backgroundColor: C.amberMid, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  featOfferText: { color: C.text, fontSize: 10, fontWeight: "900" },
  featBody: { padding: 10 },
  featName: { color: C.text, fontSize: 14, fontWeight: "800", marginBottom: 5 },
  featMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  featMetaText: { color: C.text60, fontSize: 12, fontWeight: "600" },

  card: {
    marginHorizontal: 20, marginBottom: 16, borderRadius: 20,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border, overflow: "hidden",
  },
  cardImgWrap: { height: 155, position: "relative" },
  cardImg:     { width: "100%", height: "100%" },
  cardImgGrad: { position: "absolute", bottom: 0, left: 0, right: 0, height: 80 },
  cardOfferPill: { position: "absolute", bottom: 10, left: 10, backgroundColor: C.amber, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  cardOfferText: { color: "#0C0906", fontSize: 10, fontWeight: "900" },
  cardTypeDot: { position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: 13, backgroundColor: "rgba(12,9,6,0.70)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", alignItems: "center", justifyContent: "center" },
  cardBody: { padding: 14 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  cardName: { flex: 1, color: C.text, fontSize: 17, fontWeight: "800" },
  ratingPill: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: C.amberLo, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4,
  },
  ratingText:  { color: C.amber, fontSize: 11, fontWeight: "800" },
  cardCuisine: { color: C.text60, fontSize: 13, marginBottom: 10 },
  cardMeta:    { flexDirection: "row", alignItems: "center", gap: 7 },
  metaRow:     { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText:    { color: C.text40, fontSize: 12, fontWeight: "600" },
  dot:         { color: C.text20, fontSize: 14 },
  priceText:   { color: C.amber, fontSize: 12, fontWeight: "800", marginLeft: "auto" as any },

  emptyResults: {
    marginHorizontal: 20, alignItems: "center", padding: 28,
    borderRadius: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
  },
  emptyTitle:  { color: C.text, fontSize: 15, fontWeight: "800" },
  emptyAction: { color: C.amber, fontSize: 13, fontWeight: "800", marginTop: 8 },
});
