import { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FoodImage from "../components/FoodImage";
import { C, GRAD } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";
import { RESTAURANTS } from "../constants/data";

const OFFERS = [
  {
    id: "1",
    code: "FIRSTBITE",
    title: "50% off your first order",
    sub: "Valid on orders above ₹199. Because first times should be special. 💘",
    discount: "50%",
    validity: "Ends tonight",
    color: C.amber,
    restaurant: RESTAURANTS[0],
  },
  {
    id: "2",
    code: "BIRYANIDAY",
    title: "Free delivery on Tandoor",
    sub: "Biryani ka din hai aaj! No delivery charges, full khushiyan. 🍛",
    discount: "FREE",
    validity: "Today only",
    color: C.ruby,
    restaurant: RESTAURANTS[2],
  },
  {
    id: "3",
    code: "BOWLLOVER",
    title: "Buy 2 bowls, get 1 free",
    sub: "Teen bowls, ek ka daam. Maths simple, khana simpler. 🥗",
    discount: "1 FREE",
    validity: "This week",
    color: C.emerald,
    restaurant: RESTAURANTS[1],
  },
  {
    id: "4",
    code: "SWEETDEAL",
    title: "Desserts at ₹99",
    sub: "Meetha zaroori hai. Aur ₹99 mein toh bilkul zaroori hai. 🍰",
    discount: "₹99",
    validity: "Weekend only",
    color: "#A78BFA",
    restaurant: RESTAURANTS[4],
  },
];

const CHEESY_QUOTES = [
  "Mufat mein milne wali cheezein: dhoop, pavan, aur Foodie ke offers. ☀️",
  "Discount dhundh ke laana ek kala hai. Hum ne yeh kala tumhare liye seekhi hai. 🎨",
  "Savings + great food = ek perfect din. Do the math. 🧮",
];

export default function OffersScreen({ navigation }: any) {
  const { C, GRAD } = useTheme();
  const s = useMemo(() => makeStyles(C, GRAD), [C]);
  const quote = CHEESY_QUOTES[Math.floor(Math.random() * CHEESY_QUOTES.length)];

  const openRestaurant = (restaurant: typeof RESTAURANTS[0]) =>
    navigation.navigate("Home", {
      screen: "RestaurantDetail",
      params: { id: restaurant.id, name: restaurant.name, price: restaurant.price, image: restaurant.image, cuisine: restaurant.cuisine, rating: restaurant.rating, time: restaurant.time },
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
          <View style={s.headerText}>
            <Text style={s.title}>Offers & Deals</Text>
            <Text style={s.subtitle}>{OFFERS.length} active offers</Text>
          </View>
          <View style={s.tagBadge}>
            <MaterialCommunityIcons name="tag-multiple" size={18} color={C.amber} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

          {/* Quote banner */}
          <LinearGradient colors={GRAD.amber} style={s.quoteBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <MaterialCommunityIcons name="brightness-7" size={26} color="rgba(255,255,255,0.80)" />
            <Text style={s.quoteText}>{quote}</Text>
          </LinearGradient>

          {/* Offer cards */}
          {OFFERS.map((offer) => (
            <View key={offer.id} style={s.card}>
              {/* Image strip */}
              <View style={s.imgStrip}>
                <FoodImage uri={offer.restaurant.image} style={s.img} />
                <LinearGradient colors={["transparent", "rgba(12,9,6,0.85)"]} style={StyleSheet.absoluteFill} />
                <View style={[s.discountBadge, { backgroundColor: offer.color }]}>
                  <Text style={s.discountText}>{offer.discount}</Text>
                </View>
                <View style={s.validityPill}>
                  <MaterialCommunityIcons name="clock-outline" size={11} color={C.text60} />
                  <Text style={s.validityText}>{offer.validity}</Text>
                </View>
              </View>

              {/* Body */}
              <View style={s.cardBody}>
                <Text style={s.offerTitle}>{offer.title}</Text>
                <Text style={s.offerSub}>{offer.sub}</Text>

                <View style={s.codeRow}>
                  <View style={[s.codePill, { borderColor: offer.color, backgroundColor: `${offer.color}15` }]}>
                    <MaterialCommunityIcons name="ticket-percent-outline" size={14} color={offer.color} />
                    <Text style={[s.codeText, { color: offer.color }]}>{offer.code}</Text>
                  </View>
                  <Pressable
                    style={[s.claimBtn, { backgroundColor: offer.color }]}
                    onPress={() => openRestaurant(offer.restaurant)}
                  >
                    <Text style={s.claimText}>Claim Now</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}

          {/* Bottom hint */}
          <View style={s.bottomHint}>
            <MaterialCommunityIcons name="information-outline" size={14} color={C.text20} />
            <Text style={s.bottomHintText}>Codes apply automatically at checkout. Terms apply.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const makeStyles = (C: any, GRAD: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: C.cardN, borderWidth: 1, borderColor: C.borderN, alignItems: "center", justifyContent: "center" },
  headerText: { flex: 1 },
  title:    { fontSize: 22, fontWeight: "800", color: C.text },
  subtitle: { fontSize: 12, color: C.text40, marginTop: 2 },
  tagBadge: { width: 40, height: 40, borderRadius: 13, backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid, alignItems: "center", justifyContent: "center" },
  content: { padding: 20, paddingBottom: 40 },

  quoteBanner: { borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  quoteText:   { flex: 1, color: "rgba(255,255,255,0.90)", fontSize: 13, lineHeight: 20, fontWeight: "600" },

  card: {
    backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.border,
    overflow: "hidden", marginBottom: 16,
  },
  imgStrip: { height: 130, position: "relative" },
  img:      { width: "100%", height: "100%" },
  discountBadge: {
    position: "absolute", top: 12, left: 12,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
  },
  discountText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  validityPill: {
    position: "absolute", bottom: 10, right: 10,
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(12,9,6,0.70)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  validityText: { color: C.text60, fontSize: 11, fontWeight: "700" },

  cardBody:   { padding: 15 },
  offerTitle: { color: C.text, fontSize: 16, fontWeight: "900", marginBottom: 6 },
  offerSub:   { color: C.text60, fontSize: 13, lineHeight: 19, marginBottom: 14 },

  codeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  codePill: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 7,
    borderWidth: 1, borderStyle: "dashed" as any, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  codeText:  { fontSize: 13, fontWeight: "900", letterSpacing: 0.5 },
  claimBtn:  { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  claimText: { color: "#fff", fontSize: 13, fontWeight: "800" },

  bottomHint: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center" },
  bottomHintText: { color: C.text20, fontSize: 11 },
});
