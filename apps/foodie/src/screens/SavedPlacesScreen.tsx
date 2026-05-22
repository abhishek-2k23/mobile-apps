import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FoodImage from "../components/FoodImage";
import { C, GRAD } from "../constants/colors";
import { RESTAURANTS } from "../constants/data";
import { IconStar, IconClock } from "../icons";

const SAVED = RESTAURANTS.slice(0, 5);

const CHEESY_QUOTES = [
  { text: "Yeh jagahein dil ke kareeb hain... aur hamare servers pe bhi. 📍", emoji: "❤️" },
  { text: "Kuch rishte khane ki wajah se bante hain. Inse nata kabhi na todo.", emoji: "🏠" },
  { text: "Apni fav jagah save karo. Bhookh kab lag jaaye, koi nahi jaanta.", emoji: "💾" },
];

export default function SavedPlacesScreen({ navigation }: any) {
  const quote = CHEESY_QUOTES[Math.floor(Math.random() * CHEESY_QUOTES.length)];

  const openRestaurant = (item: typeof RESTAURANTS[0]) =>
    navigation.navigate("Home", {
      screen: "RestaurantDetail",
      params: { id: item.id, name: item.name, price: item.price, image: item.image, cuisine: item.cuisine, rating: item.rating, time: item.time },
    });

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={["top"]}>
        {/* Header */}
        <View style={s.header}>
          <Pressable style={s.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>Saved Places</Text>
          <View style={s.countPill}>
            <Text style={s.countText}>{SAVED.length}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

          {/* Quote card */}
          <View style={s.quoteCard}>
            <Text style={s.quoteEmoji}>{quote.emoji}</Text>
            <Text style={s.quoteText}>{quote.text}</Text>
          </View>

          {/* Saved list */}
          {SAVED.map((item, i) => (
            <Pressable key={item.id} style={s.card} onPress={() => openRestaurant(item)}>
              <View style={s.imgWrap}>
                <FoodImage uri={item.image} style={s.img} />
                <LinearGradient colors={GRAD.dark} style={s.imgGrad} />
                <View style={s.heartBtn}>
                  <MaterialCommunityIcons name="heart" size={14} color={C.ruby} />
                </View>
              </View>
              <View style={s.body}>
                <View style={s.titleRow}>
                  <Text style={s.name} numberOfLines={1}>{item.name}</Text>
                  <View style={s.ratingPill}>
                    <IconStar size={11} color={C.amber} />
                    <Text style={s.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={s.cuisine} numberOfLines={1}>{item.cuisine}</Text>
                <View style={s.meta}>
                  <IconClock size={12} color={C.text40} />
                  <Text style={s.metaText}>{item.time}</Text>
                  <Text style={s.dot}>·</Text>
                  <Text style={s.metaText}>{item.distance}</Text>
                  <Text style={s.price}>₹{item.price}+</Text>
                </View>
              </View>
            </Pressable>
          ))}

          {/* Bottom cheesy hint */}
          <View style={s.bottomHint}>
            <MaterialCommunityIcons name="heart-outline" size={16} color={C.text20} />
            <Text style={s.bottomHintText}>Tap ❤️ on any restaurant to save it here.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: C.cardN, borderWidth: 1, borderColor: C.borderN, alignItems: "center", justifyContent: "center" },
  title:     { flex: 1, fontSize: 22, fontWeight: "800", color: C.text },
  countPill: { backgroundColor: C.amberLo, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: C.amberMid },
  countText: { color: C.amber, fontSize: 13, fontWeight: "900" },
  content: { padding: 20, paddingBottom: 40 },

  quoteCard: {
    flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 18,
    backgroundColor: "rgba(232,67,106,0.10)", borderWidth: 1, borderColor: "rgba(232,67,106,0.22)",
    marginBottom: 20,
  },
  quoteEmoji: { fontSize: 28 },
  quoteText:  { flex: 1, color: C.text80, fontSize: 13, lineHeight: 20, fontStyle: "italic" },

  card: {
    flexDirection: "row", backgroundColor: C.card, borderRadius: 18,
    borderWidth: 1, borderColor: C.border, overflow: "hidden", marginBottom: 14,
  },
  imgWrap: { width: 110, height: 110, position: "relative" },
  img:     { width: "100%", height: "100%" },
  imgGrad: { position: "absolute", bottom: 0, left: 0, right: 0, height: 50 },
  heartBtn: {
    position: "absolute", top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(232,67,106,0.20)",
    borderWidth: 1, borderColor: "rgba(232,67,106,0.40)",
    alignItems: "center", justifyContent: "center",
  },
  body:     { flex: 1, padding: 12, justifyContent: "center" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  name:     { flex: 1, color: C.text, fontSize: 15, fontWeight: "800" },
  ratingPill: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: C.amberLo, borderRadius: 7, paddingHorizontal: 6, paddingVertical: 3 },
  ratingText: { color: C.amber, fontSize: 11, fontWeight: "800" },
  cuisine:    { color: C.text60, fontSize: 12, marginBottom: 8 },
  meta:       { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText:   { color: C.text40, fontSize: 11, fontWeight: "600" },
  dot:        { color: C.text20, fontSize: 12 },
  price:      { color: C.amber, fontSize: 11, fontWeight: "800", marginLeft: "auto" as any },

  bottomHint: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 },
  bottomHintText: { color: C.text20, fontSize: 12 },
});
