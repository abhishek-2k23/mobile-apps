import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { C, GRAD } from "../constants/colors";

export default function CartScreen({ route, navigation }: any) {
  const restaurantName = route.params?.restaurantName ?? "Current restaurant";
  const { cartCount, setCartCount, addOrder } = useAuth();
  const itemPrice   = 229;
  const deliveryFee = 39;

  const placeOrder = async () => {
    if (cartCount === 0) return;
    await addOrder({
      place: restaurantName,
      items: `${cartCount} menu item${cartCount > 1 ? "s" : ""}`,
      total: cartCount * itemPrice + deliveryFee,
    });
    setCartCount(0);
    navigation.replace("OrderPlaced", { restaurantName });
  };

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={["bottom"]}>
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.title}>Your Cart</Text>
          <Text style={s.sub}>From {restaurantName}</Text>

          <View style={s.divider} />

          {cartCount > 0 ? (
            <View style={s.item}>
              <View style={s.itemInfo}>
                <Text style={s.itemName}>Menu items</Text>
                <Text style={s.itemDesc}>{cartCount}x from {restaurantName}</Text>
              </View>
              <View style={s.qtyRow}>
                <Pressable style={s.qtyBtn} onPress={() => setCartCount((n) => Math.max(n - 1, 0))}>
                  <Text style={s.qtyText}>-</Text>
                </Pressable>
                <Text style={s.qtyCount}>{cartCount}</Text>
                <Pressable style={s.qtyBtn} onPress={() => setCartCount((n) => n + 1)}>
                  <Text style={s.qtyText}>+</Text>
                </Pressable>
              </View>
              <Text style={s.itemPrice}>₹{cartCount * itemPrice}</Text>
            </View>
          ) : (
            <View style={s.emptyCart}>
              <Text style={s.emptyTitle}>Cart is empty</Text>
              <Text style={s.emptyText}>Add a dish to start your order.</Text>
            </View>
          )}

          <View style={s.divider} />

          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Subtotal</Text>
            <Text style={s.summaryValue}>₹{cartCount * itemPrice}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Delivery fee</Text>
            <Text style={s.summaryValue}>₹{deliveryFee}</Text>
          </View>
          <View style={[s.summaryRow, s.summaryTotal]}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>₹{cartCount * itemPrice + deliveryFee}</Text>
          </View>
        </ScrollView>

        <View style={s.footer}>
          <Pressable style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backText}>Keep Browsing</Text>
          </Pressable>
          <Pressable
            style={[s.orderBtn, cartCount === 0 && s.orderBtnDisabled]}
            onPress={placeOrder}
            disabled={cartCount === 0}
          >
            <LinearGradient colors={GRAD.amberH} style={s.orderBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={s.orderText}>Place Order</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  scroll: { padding: 20 },

  title: { fontSize: 26, fontWeight: "800", color: C.text, letterSpacing: -0.5 },
  sub:   { fontSize: 14, color: C.text60, marginTop: 4 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 20 },

  item: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  itemInfo:  { flex: 1 },
  itemName:  { fontSize: 15, fontWeight: "700", color: C.text },
  itemDesc:  { fontSize: 12, color: C.text40, marginTop: 2 },
  itemPrice: { fontSize: 15, color: C.text, fontWeight: "700" },

  qtyRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: C.amberMid,
    borderRadius: 999, overflow: "hidden",
    backgroundColor: C.amberLo,
  },
  qtyBtn:   { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  qtyText:  { color: C.amber, fontSize: 20, fontWeight: "900" },
  qtyCount: { minWidth: 26, textAlign: "center", color: C.text, fontSize: 13, fontWeight: "800" },

  emptyCart: {
    alignItems: "center", borderRadius: 18,
    borderWidth: 1, borderColor: C.border,
    padding: 24, backgroundColor: C.card,
  },
  emptyTitle: { color: C.text, fontSize: 17, fontWeight: "800" },
  emptyText:  { color: C.text40, fontSize: 13, marginTop: 5 },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: C.text60 },
  summaryValue: { fontSize: 14, color: C.text80 },
  summaryTotal: { marginTop: 4, paddingTop: 14, borderTopWidth: 1, borderTopColor: C.border },
  totalLabel: { fontSize: 16, color: C.text, fontWeight: "700" },
  totalValue: { fontSize: 16, color: C.amber, fontWeight: "800" },

  footer: {
    flexDirection: "row", gap: 12, padding: 20,
    borderTopWidth: 1, borderTopColor: C.border,
  },
  backBtn: {
    flex: 1, paddingVertical: 15, borderRadius: 14,
    borderWidth: 1, borderColor: C.border2,
    alignItems: "center", backgroundColor: C.cardN,
  },
  backText: { color: C.text60, fontSize: 15, fontWeight: "700" },
  orderBtn:         { flex: 1, borderRadius: 14, overflow: "hidden" },
  orderBtnDisabled: { opacity: 0.35 },
  orderBtnGrad:     { paddingVertical: 15, alignItems: "center" },
  orderText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
