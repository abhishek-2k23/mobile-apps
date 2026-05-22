import { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";
import { C, GRAD } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";

const CHEESY_TRACK_QUOTES = [
  "Bhai, thoda sabr karo. Biryani pakti hai, jaldi nahi hoti. 🍛",
  "Rider on his way — bas ek aur chai peeke aayega. ☕",
  "Patience is a virtue. Especially when cheese is melting. 🧀",
  "Aapka khana aa raha hai. Zyada sochoge toh bhookh aur lagegi. 😅",
  "The best things in life are worth waiting for. Like your order. 🙌",
];

const STAGES = [
  { icon: "clipboard-check-outline", label: "Order Placed",    sub: "Your order has been confirmed" },
  { icon: "chef-hat",                label: "Kitchen Prep",    sub: "Chef is working the magic" },
  { icon: "motorbike",               label: "Out for Delivery", sub: "Rider is on the way" },
  { icon: "home-circle-outline",     label: "Delivered",       sub: "Enjoy your meal!" },
] as const;

const DUMMY_ORDER = {
  id: "FD-2847",
  place: "Charcoal Tandoor",
  items: "2 menu items",
  total: 697,
  rider: "Raju Bhaiya",
  phone: "+91 98765 43210",
  eta: "8 min",
  activeStage: 2,
};

export default function TrackOrderScreen({ navigation }: any) {
  const { cartCount, orders } = useAuth();
  const { C, GRAD } = useTheme();
  const s = useMemo(() => makeStyles(C, GRAD), [C]);
  const hasOrder = cartCount > 0 || orders.length > 0;
  const order = orders.length > 0 ? { ...DUMMY_ORDER, place: orders[0].place, total: orders[0].total } : DUMMY_ORDER;
  const quote = CHEESY_TRACK_QUOTES[Math.floor(Math.random() * CHEESY_TRACK_QUOTES.length)];

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={["top"]}>
        {/* Header */}
        <View style={s.header}>
          <Pressable style={s.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>Track Order</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

          {/* Quote */}
          <View style={s.quoteCard}>
            <MaterialCommunityIcons name="map-marker-path" size={24} color={C.amber} />
            <Text style={s.quoteText}>{quote}</Text>
          </View>

          {!hasOrder ? (
            /* No active order state */
            <View style={s.emptyState}>
              <MaterialCommunityIcons name="map-search-outline" size={52} color={C.text20} />
              <Text style={s.emptyTitle}>No active order</Text>
              <Text style={s.emptyText}>Abhi kuch order nahi hai. Browse karo, kuch zabardast choose karo. 🍽️</Text>
              <Pressable style={s.browseBtn} onPress={() => navigation.navigate("Home")}>
                <LinearGradient colors={GRAD.amberH} style={s.browseBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={s.browseBtnText}>Go Browse</Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Order info card */}
              <View style={s.orderCard}>
                <View style={s.orderRow}>
                  <View style={s.orderIcon}>
                    <MaterialCommunityIcons name="storefront-outline" size={20} color={C.amber} />
                  </View>
                  <View style={s.orderCopy}>
                    <Text style={s.orderPlace}>{order.place}</Text>
                    <Text style={s.orderItems}>{order.items}</Text>
                  </View>
                  <Text style={s.orderTotal}>₹{order.total}</Text>
                </View>
                <View style={s.orderIdRow}>
                  <MaterialCommunityIcons name="pound" size={12} color={C.text40} />
                  <Text style={s.orderId}>{order.id}</Text>
                  <View style={s.etaPill}>
                    <MaterialCommunityIcons name="clock-outline" size={12} color={C.amber} />
                    <Text style={s.etaText}>{DUMMY_ORDER.eta} away</Text>
                  </View>
                </View>
              </View>

              {/* Progress stages */}
              <Text style={s.sectionTitle}>Delivery progress</Text>
              <View style={s.stages}>
                {STAGES.map((stage, i) => {
                  const isDone   = i < DUMMY_ORDER.activeStage;
                  const isActive = i === DUMMY_ORDER.activeStage;
                  return (
                    <View key={stage.label} style={s.stageRow}>
                      {/* Icon + connector */}
                      <View style={s.stageLeft}>
                        <View style={[s.stageCircle, isDone && s.stageCircleDone, isActive && s.stageCircleActive]}>
                          <MaterialCommunityIcons
                            name={isDone ? "check" : stage.icon}
                            size={18}
                            color={isDone || isActive ? "#0C0906" : C.text40}
                          />
                        </View>
                        {i < STAGES.length - 1 && (
                          <View style={[s.stageLine, isDone && s.stageLineDone]} />
                        )}
                      </View>
                      {/* Text */}
                      <View style={s.stageCopy}>
                        <Text style={[s.stageLabel, (isDone || isActive) && s.stageLabelActive]}>
                          {stage.label}
                        </Text>
                        <Text style={s.stageSub}>{isActive ? `🔥 ${stage.sub}` : stage.sub}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Rider card */}
              <Text style={s.sectionTitle}>Your rider</Text>
              <View style={s.riderCard}>
                <View style={s.riderAvatar}>
                  <MaterialCommunityIcons name="account-circle" size={44} color={C.amber} />
                </View>
                <View style={s.riderInfo}>
                  <Text style={s.riderName}>{DUMMY_ORDER.rider}</Text>
                  <Text style={s.riderSub}>4.9 ★  ·  1200+ deliveries</Text>
                </View>
                <Pressable style={s.callBtn}>
                  <MaterialCommunityIcons name="phone-outline" size={20} color={C.amber} />
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const makeStyles = (C: any, GRAD: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: C.cardN, borderWidth: 1, borderColor: C.borderN, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "800", color: C.text },
  content: { padding: 20, paddingBottom: 40 },

  quoteCard: {
    flexDirection: "row", gap: 12, alignItems: "flex-start", padding: 16, borderRadius: 18,
    backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid, marginBottom: 20,
  },
  quoteText: { flex: 1, color: C.text80, fontSize: 14, lineHeight: 21, fontStyle: "italic" },

  emptyState: { alignItems: "center", paddingTop: 40, gap: 14 },
  emptyTitle: { color: C.text, fontSize: 20, fontWeight: "800" },
  emptyText:  { color: C.text60, fontSize: 14, textAlign: "center", lineHeight: 21, maxWidth: 280 },
  browseBtn: { marginTop: 8, borderRadius: 14, overflow: "hidden" },
  browseBtnGrad: { paddingHorizontal: 32, paddingVertical: 14 },
  browseBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  orderCard: {
    backgroundColor: C.card2, borderRadius: 18, borderWidth: 1, borderColor: C.border2,
    padding: 15, marginBottom: 20,
  },
  orderRow:   { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  orderIcon:  { width: 40, height: 40, borderRadius: 12, backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid, alignItems: "center", justifyContent: "center" },
  orderCopy:  { flex: 1 },
  orderPlace: { color: C.text, fontSize: 15, fontWeight: "800" },
  orderItems: { color: C.text60, fontSize: 12, marginTop: 2 },
  orderTotal: { color: C.amber, fontSize: 16, fontWeight: "900" },
  orderIdRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  orderId:    { color: C.text40, fontSize: 12, flex: 1 },
  etaPill:    { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.amberLo, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  etaText:    { color: C.amber, fontSize: 12, fontWeight: "800" },

  sectionTitle: { color: C.text, fontSize: 17, fontWeight: "800", marginBottom: 14 },

  stages: { marginBottom: 24 },
  stageRow:  { flexDirection: "row", gap: 14 },
  stageLeft: { alignItems: "center", width: 36 },
  stageCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.cardN, borderWidth: 1, borderColor: C.borderN,
    alignItems: "center", justifyContent: "center",
  },
  stageCircleDone:   { backgroundColor: C.amber, borderColor: C.amber },
  stageCircleActive: { backgroundColor: C.amberMid, borderColor: C.amber },
  stageLine:     { width: 2, flex: 1, minHeight: 24, backgroundColor: C.borderN, marginVertical: 4 },
  stageLineDone: { backgroundColor: C.amber },
  stageCopy:  { flex: 1, paddingBottom: 20 },
  stageLabel: { color: C.text60, fontSize: 15, fontWeight: "700" },
  stageLabelActive: { color: C.text },
  stageSub:   { color: C.text40, fontSize: 12, marginTop: 3 },

  riderCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: C.card2, borderRadius: 18,
    borderWidth: 1, borderColor: C.border2, padding: 14,
  },
  riderAvatar: {},
  riderInfo:   { flex: 1 },
  riderName:   { color: C.text, fontSize: 16, fontWeight: "800" },
  riderSub:    { color: C.text60, fontSize: 12, marginTop: 3 },
  callBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid,
    alignItems: "center", justifyContent: "center",
  },
});
