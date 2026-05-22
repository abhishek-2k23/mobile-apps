import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { IconStar, IconClock, IconCart } from "../icons";
import { useMenuCart } from "../hooks/useCart";
import { MENU_ITEMS } from "../constants/data";
import { C, GRAD } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";
import FoodImage from "../components/FoodImage";

const FALLBACK = {
  name: "Foodie Kitchen", price: 279,
  image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85",
  cuisine: "Seasonal plates", rating: "4.7", time: "24 min",
};

export default function RestaurantDetailScreen({ route, navigation }: any) {
  const params  = route.params ?? {};
  const name    = params.name    ?? FALLBACK.name;
  const price   = params.price   ?? FALLBACK.price;
  const image   = params.image   ?? FALLBACK.image;
  const cuisine = params.cuisine ?? FALLBACK.cuisine;
  const rating  = params.rating  ?? FALLBACK.rating;
  const time    = params.time    ?? FALLBACK.time;

  const { counts, add, remove, getCount } = useMenuCart();
  const totalInCart = Object.values(counts).reduce((a, b) => a + b, 0);
  const { C, GRAD } = useTheme();
  const s = useMemo(() => makeStyles(C, GRAD), [C]);

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={s.heroWrap}>
          <FoodImage uri={image} style={s.hero} />
          <LinearGradient
            colors={["transparent", "rgba(12,9,6,0.80)", C.bg]}
            locations={[0.4, 0.75, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <SafeAreaView edges={["bottom"]}>
          <View style={s.content}>
            <Text style={s.name}>{name}</Text>
            <Text style={s.cuisine}>{cuisine}</Text>

            <View style={s.metaRow}>
              <View style={s.meta}>
                <IconStar size={14} color={C.amber} />
                <Text style={s.metaText}>{rating}</Text>
              </View>
              <View style={s.meta}>
                <IconClock size={14} color={C.text40} />
                <Text style={s.metaText}>{time}</Text>
              </View>
              <Text style={s.metaPrice}>From ₹{price}</Text>
            </View>

            <View style={s.divider} />
            <Text style={s.menuTitle}>Menu ({MENU_ITEMS.length} items)</Text>

            {MENU_ITEMS.map((item) => {
              const count = getCount(item.id);
              return (
                <View key={item.id} style={s.menuItem}>
                  <FoodImage uri={item.image} style={s.menuImg} />
                  <View style={s.menuInfo}>
                    <Text style={s.menuName}>{item.name}</Text>
                    <Text style={s.menuDesc} numberOfLines={2}>{item.desc}</Text>
                    <Text style={s.menuPrice}>₹{item.price}</Text>
                  </View>
                  {count > 0 ? (
                    <View style={s.qtyControl}>
                      <Pressable style={s.qtyBtn} onPress={() => remove(item.id)}>
                        <Text style={s.qtyBtnText}>-</Text>
                      </Pressable>
                      <Text style={s.qtyCount}>{count}</Text>
                      <Pressable style={s.qtyBtn} onPress={() => add(item.id)}>
                        <Text style={s.qtyBtnText}>+</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable style={s.addBtn} onPress={() => add(item.id)}>
                      <Text style={s.addBtnText}>+</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        </SafeAreaView>
      </ScrollView>

      {totalInCart > 0 && (
        <SafeAreaView edges={["bottom"]} style={s.cartBarWrap}>
          <Pressable style={s.cartBar} onPress={() => navigation.navigate("Cart", { restaurantName: name })}>
            <LinearGradient colors={GRAD.amberH} style={s.cartBarGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View style={s.cartBadge}><Text style={s.cartBadgeText}>{totalInCart}</Text></View>
              <IconCart size={18} color="#fff" />
              <Text style={s.cartBarText}>View Cart</Text>
            </LinearGradient>
          </Pressable>
        </SafeAreaView>
      )}
    </View>
  );
}

const makeStyles = (C: any, GRAD: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  heroWrap: { width: "100%", height: 280 },
  hero: { width: "100%", height: "100%" },
  content: { padding: 20 },
  name:    { fontSize: 26, fontWeight: "800", color: C.text, letterSpacing: -0.5 },
  cuisine: { fontSize: 14, color: C.text60, marginTop: 4, marginBottom: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  meta:    { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText:  { fontSize: 13, color: C.text60 },
  metaPrice: { marginLeft: "auto" as any, fontSize: 14, color: C.amber, fontWeight: "700" },
  divider:   { height: 1, backgroundColor: C.border, marginVertical: 20 },
  menuTitle: { fontSize: 18, fontWeight: "800", color: C.text, marginBottom: 16 },

  menuItem: {
    flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 12,
    backgroundColor: C.card, borderRadius: 16, padding: 10,
    borderWidth: 1, borderColor: C.border,
  },
  menuImg:   { width: 70, height: 70, borderRadius: 12 },
  menuInfo:  { flex: 1 },
  menuName:  { fontSize: 15, fontWeight: "700", color: C.text },
  menuDesc:  { fontSize: 12, color: C.text40, marginTop: 3, lineHeight: 17 },
  menuPrice: { fontSize: 14, color: C.amber, fontWeight: "700", marginTop: 6 },

  addBtn:     { width: 34, height: 34, borderRadius: 17, backgroundColor: C.amber, alignItems: "center", justifyContent: "center" },
  addBtnText: { color: "#0C0906", fontSize: 22, lineHeight: 24, fontWeight: "900" },
  qtyControl: {
    minWidth: 90, height: 36, borderRadius: 18,
    borderWidth: 1, borderColor: C.amber,
    backgroundColor: C.amberLo,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", overflow: "hidden",
  },
  qtyBtn:     { width: 30, height: "100%", alignItems: "center", justifyContent: "center" },
  qtyBtnText: { color: C.amber, fontSize: 20, lineHeight: 22, fontWeight: "800" },
  qtyCount:   { minWidth: 20, textAlign: "center", color: C.text, fontSize: 13, fontWeight: "900" },

  cartBarWrap: { paddingHorizontal: 20, paddingBottom: 8, backgroundColor: C.bg },
  cartBar:     { borderRadius: 16, overflow: "hidden" },
  cartBarGrad: { paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  cartBadge:   { width: 22, height: 22, borderRadius: 11, backgroundColor: "rgba(0,0,0,0.25)", alignItems: "center", justifyContent: "center" },
  cartBadgeText: { color: "#fff", fontSize: 11, fontWeight: "900" },
  cartBarText:   { color: "#fff", fontSize: 16, fontWeight: "700" },
});
