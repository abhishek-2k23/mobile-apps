import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { DrawerContentScrollView, DrawerContentComponentProps } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Image as ExpoImage } from "expo-image";
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { IconOrders, IconSettings, IconHelp, IconLogout } from "../icons";
import { C, GRAD } from "../constants/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ITEMS = [
  { label: "My Orders",      screen: "MyOrders", Icon: IconOrders   },
  { label: "Settings",       screen: "Settings", Icon: IconSettings },
  { label: "Help & Support", screen: "Help",     Icon: IconHelp     },
];

const CHEESY_QUOTES = [
  { text: "Yaar, mat jao... pizza thanda ho jayega.", emoji: "🥺" },
  { text: "Aapka biryani kab se wait kar raha hai. Sochlo.", emoji: "🍛" },
  { text: "Are you sure? Mummy ki roti yaad nahi aayegi kya?", emoji: "🥲" },
  { text: "Bhookhe rahoge bahar? Koi na... hum yaad karenge.", emoji: "😔" },
  { text: "Jo jata hai woh miss karta hai — aur hamaari dal makhani.", emoji: "🧈" },
  { text: "Gordon Ramsay bhi rota hai goodbyes pe. For real.", emoji: "👨‍🍳" },
  { text: "Log aate hain, log jaate hain, lekin khana hamesha dil mein rehta hai.", emoji: "❤️" },
  { text: "Ek baar aur sochlo. Gulab jamun abhi bhi garam hai.", emoji: "🍯" },
  { text: "Dosti, mohabbat, aur achha khana — teen cheezein kabhi chhodni nahi chahiye.", emoji: "🤝" },
  { text: "Jaoge? Fine. But remember — bhookh hamesha wapas aati hai.", emoji: "😤" },
];

const DP = require("../../assets/images/icon.png");

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { logout, user } = useAuth();
  const active = props.state.routes[props.state.index].name;
  const [showLogout, setShowLogout] = useState(false);

  const quote = useMemo(
    () => CHEESY_QUOTES[Math.floor(Math.random() * CHEESY_QUOTES.length)],
    []
  );

  const handleLogout = async () => {
    setShowLogout(false);
    props.navigation.closeDrawer();
    await logout();
  };

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <DrawerContentScrollView {...props} contentContainerStyle={s.scroll}>
        {/* User info */}
        <View style={s.userSection}>
          <ExpoImage source={DP} style={s.avatar} contentFit="cover" />
          <Text style={s.name}>{user?.name ?? "Foodie User"}</Text>
          <Text style={s.email}>{user?.email ?? "hello@foodie.app"}</Text>
        </View>

        {/* Nav items */}
        <View style={s.items}>
          {ITEMS.map(({ label, screen, Icon }) => {
            const isActive = active === screen;
            return (
              <Pressable
                key={screen}
                style={[s.item, isActive && s.itemActive]}
                onPress={() => props.navigation.navigate(screen)}
              >
                <Icon size={20} color={isActive ? C.amber : C.text40} />
                <Text style={[s.itemText, isActive && s.itemTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Logout */}
        <Pressable style={s.logoutBtn} onPress={() => setShowLogout(true)}>
          <IconLogout size={20} color={C.amber} />
          <Text style={s.logoutText}>Logout</Text>
        </Pressable>
      </DrawerContentScrollView>

      {/* Logout confirmation modal */}
      <Modal
        visible={showLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogout(false)}
      >
        <Pressable style={s.backdrop} onPress={() => setShowLogout(false)}>
          <Pressable style={s.sheet} onPress={(e) => e.stopPropagation()}>
            <LinearGradient colors={["#1A1008", "#0C0906"]} style={StyleSheet.absoluteFill} />
            <View style={s.sheetBorder} />

            <Text style={s.emoji}>{quote.emoji}</Text>
            <Text style={s.quoteText}>{quote.text}</Text>
            <Text style={s.quoteLabel}>— Foodie, pleading</Text>

            <View style={s.sheetDivider} />

            <Text style={s.confirmTitle}>Sure you want to leave?</Text>
            <Text style={s.confirmSub}>Your cart and saved preferences will be cleared.</Text>

            <View style={s.sheetActions}>
              <Pressable style={s.stayBtn} onPress={() => setShowLogout(false)}>
                <LinearGradient colors={GRAD.amberH} style={s.stayGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={16} color="#fff" />
                  <Text style={s.stayText}>Stay & eat</Text>
                </LinearGradient>
              </Pressable>
              <Pressable style={s.leaveBtn} onPress={handleLogout}>
                <Text style={s.leaveText}>Yes, logout</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1, paddingTop: 0 },

  userSection: {
    padding: 24, paddingTop: 52,
    borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 8,
  },
  avatar: { width: 66, height: 66, borderRadius: 33, marginBottom: 14, borderWidth: 2, borderColor: C.amberMid },
  name:  { fontSize: 18, fontWeight: "800", color: C.text },
  email: { fontSize: 13, color: C.text40, marginTop: 3 },

  items: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  item: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, marginBottom: 2,
  },
  itemActive:     { backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid },
  itemText:       { fontSize: 15, color: C.text40, fontWeight: "600" },
  itemTextActive: { color: C.amber, fontWeight: "700" },

  logoutBtn: {
    flexDirection: "row", alignItems: "center", gap: 14,
    margin: 12, padding: 14, borderRadius: 14,
    backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid,
  },
  logoutText: { fontSize: 15, color: C.amber, fontWeight: "700" },

  // ── Modal ──
  backdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    overflow: "hidden", padding: 28, paddingBottom: 40,
    borderWidth: 1, borderBottomWidth: 0, borderColor: C.border2,
  },
  sheetBorder: {
    position: "absolute", top: 10, left: "50%", marginLeft: -20,
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: C.border2,
  },

  emoji:       { fontSize: 40, textAlign: "center", marginBottom: 12 },
  quoteText:   { color: C.text80, fontSize: 16, fontStyle: "italic", lineHeight: 24, textAlign: "center" },
  quoteLabel:  { color: C.text40, fontSize: 12, textAlign: "center", marginTop: 6, fontWeight: "700" },
  sheetDivider: { height: 1, backgroundColor: C.border, marginVertical: 22 },

  confirmTitle: { color: C.text, fontSize: 20, fontWeight: "900", textAlign: "center" },
  confirmSub:   { color: C.text60, fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 19 },

  sheetActions: { flexDirection: "row", gap: 12, marginTop: 24 },
  stayBtn:  { flex: 1, borderRadius: 14, overflow: "hidden" },
  stayGrad: { paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  stayText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  leaveBtn: {
    flex: 1, paddingVertical: 15, borderRadius: 14,
    backgroundColor: "rgba(232,67,106,0.12)",
    borderWidth: 1, borderColor: "rgba(232,67,106,0.30)",
    alignItems: "center", justifyContent: "center",
  },
  leaveText: { color: C.ruby, fontSize: 15, fontWeight: "700" },
});
