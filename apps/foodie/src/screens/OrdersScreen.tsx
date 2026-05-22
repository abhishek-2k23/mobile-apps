import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { IconClock, IconCart, IconRestaurant } from "../icons";
import FoodImage from "../components/FoodImage";
import { C, GRAD } from "../constants/colors";
import { RESTAURANTS } from "../constants/data";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const FOOD_QUOTES = [
  { q: "\"Jo kal khaaya tha, woh aaj bhi yaad hai.\"", by: "— Every foodie, ever" },
  { q: "\"Khana pakka ho ya na ho, plate full honi chahiye.\"", by: "— Dadi ka gyaan" },
  { q: "\"Tell me what you eat, I'll tell you who you are.\"", by: "— Brillat-Savarin" },
  { q: "\"Cooking is love made visible.\"", by: "— Kitchen wisdom" },
  { q: "\"Bhookh is the best sauce.\"", by: "— Hunger, probably" },
  { q: "\"A good meal makes the world a little smaller.\"", by: "— Anthony Bourdain" },
];

const QUICK_ACTIONS = [
  { icon: "map-marker-radius-outline", label: "Track Order",  color: "#F5A623", screen: "TrackOrder"  },
  { icon: "heart-outline",             label: "Saved Places", color: "#E8436A", screen: "SavedPlaces" },
  { icon: "tag-outline",               label: "Offers",       color: "#00D97E", screen: "Offers"      },
] as const;

const FAVOURITES = RESTAURANTS.slice(0, 6);

export default function OrdersScreen({ navigation }: any) {
  const { cartCount, orders, setCartCount } = useAuth();
  const subtotal = cartCount * 229;

  const quote = useMemo(
    () => FOOD_QUOTES[Math.floor(Math.random() * FOOD_QUOTES.length)],
    []
  );

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Orders</Text>
            <Text style={s.subtitle}>Track, repeat and discover</Text>
          </View>

          {/* Food Quote Card */}
          <View style={s.quoteCard}>
            <LinearGradient colors={["rgba(245,166,35,0.10)", "rgba(245,166,35,0.03)"]} style={StyleSheet.absoluteFill} />
            <MaterialCommunityIcons name="format-quote-open" size={28} color={C.amber} style={{ opacity: 0.6 }} />
            <Text style={s.quoteText}>{quote.q}</Text>
            <Text style={s.quoteBy}>{quote.by}</Text>
          </View>

          {/* Active Cart */}
          {cartCount > 0 ? (
            <Pressable
              style={s.activeCard}
              onPress={() => navigation.navigate("Home", { screen: "Cart", params: { restaurantName: "Current restaurant" } })}
            >
              <View style={s.activeTop}>
                <View style={s.iconBubble}>
                  <IconCart size={20} color="#fff" />
                </View>
                <View style={s.activeCopy}>
                  <Text style={s.activeLabel}>Cart waiting 🛒</Text>
                  <Text style={s.activeTitle}>{cartCount} item{cartCount > 1 ? "s" : ""} ready to checkout</Text>
                </View>
                <Text style={s.activePrice}>₹{subtotal}</Text>
              </View>
              <View style={s.progressTrack}>
                <LinearGradient colors={GRAD.amberH} style={s.progressFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
              </View>
              <Text style={s.activeHint}>Tap to review your cart and place the order</Text>
            </Pressable>
          ) : (
            <View style={s.emptyCart}>
              <IconRestaurant size={26} color={C.amber} />
              <Text style={s.emptyCartTitle}>No active order</Text>
              <Text style={s.emptyCartText}>Browse home and start building your cart.</Text>
            </View>
          )}

          {/* Quick Actions */}
          <Text style={s.sectionTitle}>Quick actions</Text>
          <View style={s.actionsGrid}>
            {QUICK_ACTIONS.map((a) => (
              <Pressable key={a.label} style={s.actionTile} onPress={() => navigation.navigate(a.screen)}>
                <View style={[s.actionIcon, { backgroundColor: `${a.color}18` }]}>
                  <MaterialCommunityIcons name={a.icon} size={22} color={a.color} />
                </View>
                <Text style={s.actionLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Favourites */}
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Favourite spots</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.favsRow}>
            {FAVOURITES.map((r) => (
              <Pressable
                key={r.id}
                style={s.favCard}
                onPress={() => navigation.navigate("Home", {
                  screen: "RestaurantDetail",
                  params: { id: r.id, name: r.name, price: r.price, image: r.image, cuisine: r.cuisine, rating: r.rating, time: r.time },
                })}
              >
                <FoodImage uri={r.image} style={s.favImg} />
                <LinearGradient colors={GRAD.dark} style={s.favGrad} />
                <View style={s.favBody}>
                  <Text style={s.favName} numberOfLines={1}>{r.name}</Text>
                  <Text style={s.favTime}>{r.time}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* Past Orders */}
          <Text style={s.sectionTitle}>Past orders</Text>
          {orders.length === 0 ? (
            <View style={s.historyEmpty}>
              <MaterialCommunityIcons name="history" size={30} color={C.text20} />
              <Text style={s.historyEmptyTitle}>No orders yet</Text>
              <Text style={s.historyEmptyText}>Placed orders will land here.</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={s.orderCard}>
                <View style={s.orderTop}>
                  <View style={s.orderIconWrap}>
                    <MaterialCommunityIcons name="storefront-outline" size={18} color={C.amber} />
                  </View>
                  <View style={s.orderCopy}>
                    <Text style={s.orderPlace}>{order.place}</Text>
                    <Text style={s.orderItems}>{order.items}</Text>
                  </View>
                  <Text style={s.orderTotal}>₹{order.total}</Text>
                </View>
                <View style={s.orderMeta}>
                  <IconClock size={13} color={C.text40} />
                  <Text style={s.orderDate}>{order.date}</Text>
                  <Text style={s.orderId}>{order.id}</Text>
                </View>
                <View style={s.orderActions}>
                  <Pressable
                    style={s.reorderBtn}
                    onPress={() => {
                      setCartCount(Math.max(Number.parseInt(order.items, 10) || 1, 1));
                      navigation.navigate("Home", { screen: "Cart", params: { restaurantName: order.place } });
                    }}
                  >
                    <MaterialCommunityIcons name="refresh" size={13} color={C.amber} />
                    <Text style={s.reorderText}>Reorder</Text>
                  </Pressable>
                  <Pressable style={s.rateBtn}>
                    <MaterialCommunityIcons name="star-outline" size={13} color={C.text60} />
                    <Text style={s.rateText}>Rate</Text>
                  </Pressable>
                  <Pressable style={s.helpBtn}>
                    <MaterialCommunityIcons name="help-circle-outline" size={13} color={C.text60} />
                    <Text style={s.rateText}>Help</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  content: { paddingBottom: 32 },

  header: { paddingHorizontal: 20, paddingTop: 16, marginBottom: 16 },
  title:    { fontSize: 28, fontWeight: "800", color: C.text },
  subtitle: { color: C.text40, fontSize: 13, marginTop: 4 },

  quoteCard: {
    marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: 20,
    overflow: "hidden", borderWidth: 1, borderColor: C.border2,
    backgroundColor: C.card,
  },
  quoteText: { color: C.text80, fontSize: 15, fontStyle: "italic", lineHeight: 22, marginTop: 4, marginBottom: 8 },
  quoteBy:   { color: C.amber, fontSize: 12, fontWeight: "800" },

  activeCard: {
    marginHorizontal: 20, backgroundColor: C.amberLo, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: C.amberMid, marginBottom: 24,
  },
  activeTop:   { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBubble:  { width: 44, height: 44, borderRadius: 14, backgroundColor: C.amber, alignItems: "center", justifyContent: "center" },
  activeCopy:  { flex: 1 },
  activeLabel: { color: C.amber, fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.8 },
  activeTitle: { color: C.text, fontSize: 16, fontWeight: "800", marginTop: 3 },
  activePrice: { color: C.text, fontSize: 16, fontWeight: "900" },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: C.border, marginTop: 16, overflow: "hidden" },
  progressFill:  { width: "62%", height: "100%", borderRadius: 3 },
  activeHint:    { color: C.text60, fontSize: 12, marginTop: 12 },

  emptyCart: {
    marginHorizontal: 20, alignItems: "center", justifyContent: "center", minHeight: 110,
    backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.border, gap: 8, marginBottom: 24,
  },
  emptyCartTitle: { color: C.text, fontSize: 16, fontWeight: "800" },
  emptyCartText:  { color: C.text40, fontSize: 13 },

  sectionRow:   { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { color: C.text, fontSize: 18, fontWeight: "800", paddingHorizontal: 20, marginBottom: 12, marginTop: 4 },

  actionsGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 10,
    paddingHorizontal: 20, marginBottom: 24,
  },
  actionTile: {
    width: "30%", flexGrow: 1, alignItems: "center", gap: 8,
    paddingVertical: 14, paddingHorizontal: 8, borderRadius: 16,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
  },
  actionIcon:  { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  actionLabel: { color: C.text80, fontSize: 11, fontWeight: "700", textAlign: "center" },

  favsRow: { paddingHorizontal: 20, gap: 12, paddingBottom: 24 },
  favCard: { width: 140, borderRadius: 16, overflow: "hidden", backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  favImg:  { width: "100%", height: 100 },
  favGrad: { position: "absolute", top: 40, left: 0, right: 0, height: 60 },
  favBody: { padding: 10 },
  favName: { color: C.text, fontSize: 13, fontWeight: "800" },
  favTime: { color: C.amber, fontSize: 11, fontWeight: "700", marginTop: 3 },

  orderCard: {
    marginHorizontal: 20, backgroundColor: C.card, borderRadius: 18,
    borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 12,
  },
  orderTop:     { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  orderIconWrap: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid, alignItems: "center", justifyContent: "center" },
  orderCopy:    { flex: 1 },
  orderPlace:   { color: C.text, fontSize: 15, fontWeight: "800" },
  orderItems:   { color: C.text60, fontSize: 12, marginTop: 2 },
  orderTotal:   { color: C.amber, fontSize: 15, fontWeight: "900" },
  orderMeta:    { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  orderDate:    { color: C.text40, fontSize: 12, fontWeight: "700" },
  orderId:      { color: C.text20, fontSize: 12, fontWeight: "700", marginLeft: "auto" as any },
  orderActions: { flexDirection: "row", gap: 8 },
  reorderBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
    backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid,
  },
  reorderText: { color: C.amber, fontSize: 12, fontWeight: "900" },
  rateBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
    backgroundColor: C.cardN, borderWidth: 1, borderColor: C.borderN,
  },
  helpBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
    backgroundColor: C.cardN, borderWidth: 1, borderColor: C.borderN,
  },
  rateText: { color: C.text60, fontSize: 12, fontWeight: "800" },

  historyEmpty: {
    marginHorizontal: 20, borderRadius: 18, borderWidth: 1, borderColor: C.border,
    backgroundColor: C.card, padding: 28, alignItems: "center", gap: 8,
  },
  historyEmptyTitle: { color: C.text80, fontSize: 16, fontWeight: "800" },
  historyEmptyText:  { color: C.text40, fontSize: 13, textAlign: "center" },
});
