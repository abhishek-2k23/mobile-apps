import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from "react-native";
import { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image as ExpoImage } from "expo-image";
import { IconLocation, IconOrders, IconSettings, IconHelp } from "../icons";
import { useAuth } from "../context/AuthContext";
import { C, GRAD } from "../constants/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const CHEESY_LOGOUT_QUOTES = [
  { text: "Yaar, mat jao... pizza thanda ho jayega.", emoji: "🥺" },
  { text: "Aapka biryani kab se wait kar raha hai. Sochlo.", emoji: "🍛" },
  { text: "Are bhai, rehne do. Garma garam khana toh khao.", emoji: "🌶️" },
  { text: "The fridge won't fill itself. Stay.", emoji: "🧊" },
  { text: "Ek order aur. Bas ek. Phir jaana.", emoji: "🙏" },
];

const ACTIONS = [
  { label: "My Orders", sub: "Track and repeat meals",           screen: "MyOrders", Icon: IconOrders,   color: C.amber  },
  { label: "Settings",  sub: "Addresses, payments, preferences", screen: "Settings", Icon: IconSettings, color: "#A78BFA" },
];

const STAT_ICONS = ["clipboard-outline", "heart-outline", "star-outline"] as const;

const DP = require("../../assets/images/icon.png");

export default function ProfileScreen({ navigation }: any) {
  const { user, orders, logout } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const logoutQuote = useMemo(
    () => CHEESY_LOGOUT_QUOTES[Math.floor(Math.random() * CHEESY_LOGOUT_QUOTES.length)],
    []
  );

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Profile</Text>
            <Pressable style={s.menuBtn} onPress={() => navigation.navigate("Help")}>
              <IconHelp size={22} color={C.text} />
            </Pressable>
          </View>

          {/* Hero card */}
          <LinearGradient colors={["rgba(245,166,35,0.12)", "rgba(245,166,35,0.04)"]} style={s.heroCard}>
            <View style={s.heroTop}>
              <View style={s.avatarWrap}>
                <ExpoImage source={DP} style={s.avatar} contentFit="cover" />
                <View style={s.avatarBadge}>
                  <MaterialCommunityIcons name="check-decagram" size={16} color={C.amber} />
                </View>
              </View>
              <View style={s.userCopy}>
                <Text style={s.name}>{user?.name ?? "Foodie User"}</Text>
                <Text style={s.email}>{user?.email ?? "hello@foodie.app"}</Text>
                <View style={s.locationPill}>
                  <IconLocation size={12} color={C.amber} />
                  <Text style={s.locationText}>Bengaluru, India</Text>
                </View>
              </View>
            </View>

            {/* Stats row */}
            <View style={s.statsRow}>
              {[
                { label: "Orders",  value: `${orders.length}`, icon: STAT_ICONS[0] },
                { label: "Saved",   value: "8",                icon: STAT_ICONS[1] },
                { label: "Reviews", value: "12",               icon: STAT_ICONS[2] },
              ].map((stat, i) => (
                <View key={stat.label} style={[s.stat, i < 2 && s.statBorder]}>
                  <MaterialCommunityIcons name={stat.icon} size={18} color={C.amber} />
                  <Text style={s.statValue}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* Membership banner */}
          <LinearGradient colors={GRAD.amber} style={s.memberCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={s.memberLeft}>
              <Text style={s.memberLabel}>Foodie Club</Text>
              <Text style={s.memberTitle}>Free deliveries unlocked</Text>
              <Text style={s.memberText}>You saved ₹312 on bowls & bakery runs.</Text>
            </View>
            <View style={s.memberBadge}>
              <MaterialCommunityIcons name="crown" size={28} color="rgba(255,255,255,0.90)" />
            </View>
          </LinearGradient>

          {/* Actions */}
          <Text style={s.sectionTitle}>Account</Text>
          {ACTIONS.map(({ label, sub, screen, Icon, color }) => (
            <Pressable key={label} style={s.actionRow} onPress={() => navigation.navigate(screen)}>
              <View style={[s.actionIcon, { backgroundColor: `${color}18` }]}>
                <Icon size={19} color={color} />
              </View>
              <View style={s.actionTextWrap}>
                <Text style={s.actionTitle}>{label}</Text>
                <Text style={s.actionSub}>{sub}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={C.text40} />
            </Pressable>
          ))}

          {/* Logout */}
          <Pressable style={s.actionRow} onPress={() => setLogoutVisible(true)}>
            <View style={[s.actionIcon, { backgroundColor: `${C.ruby}18` }]}>
              <MaterialCommunityIcons name="logout" size={19} color={C.ruby} />
            </View>
            <View style={s.actionTextWrap}>
              <Text style={s.actionTitle}>Logout</Text>
              <Text style={s.actionSub}>Goodbye, see you at the next meal!</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={C.text40} />
          </Pressable>

          {/* App version */}
          <View style={s.versionRow}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={14} color={C.text20} />
            <Text style={s.versionText}>Foodie v1.0  ·  Made with ❤️ &amp; hunger</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Logout confirmation modal */}
      <Modal visible={logoutVisible} transparent animationType="fade" onRequestClose={() => setLogoutVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalEmoji}>{logoutQuote.emoji}</Text>
            <Text style={s.modalTitle}>Leaving already?</Text>
            <Text style={s.modalQuote}>{logoutQuote.text}</Text>
            <Pressable style={s.stayBtn} onPress={() => setLogoutVisible(false)}>
              <LinearGradient colors={GRAD.amberH} style={s.stayGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={s.stayText}>Stay & eat 🍕</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={s.logoutConfirmBtn} onPress={() => { setLogoutVisible(false); logout(); }}>
              <Text style={s.logoutConfirmText}>Yes, logout</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  title: { fontSize: 28, fontWeight: "800", color: C.text },
  menuBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: C.cardN, borderWidth: 1, borderColor: C.borderN,
    alignItems: "center", justifyContent: "center",
  },

  heroCard: {
    borderRadius: 22, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: C.border2, gap: 18,
  },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatarWrap: { position: "relative" },
  avatar: { width: 76, height: 76, borderRadius: 38, borderWidth: 2, borderColor: C.amberMid },
  avatarBadge: {
    position: "absolute", bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.amberMid,
    alignItems: "center", justifyContent: "center",
  },
  userCopy: { flex: 1 },
  name:  { fontSize: 21, fontWeight: "800", color: C.text },
  email: { fontSize: 13, color: C.text60, marginTop: 3 },
  locationPill: {
    marginTop: 10, alignSelf: "flex-start",
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999,
    backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid,
  },
  locationText: { color: C.amber, fontSize: 12, fontWeight: "800" },

  statsRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: C.border2 },
  stat: { flex: 1, alignItems: "center", paddingTop: 14, gap: 4 },
  statBorder: { borderRightWidth: 1, borderRightColor: C.border2 },
  statValue:  { fontSize: 20, fontWeight: "900", color: C.text },
  statLabel:  { fontSize: 11, color: C.text60, fontWeight: "700" },

  memberCard: { borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "center", marginBottom: 24 },
  memberLeft: { flex: 1 },
  memberLabel: { color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1 },
  memberTitle: { color: "#fff", fontSize: 17, fontWeight: "900", marginTop: 5 },
  memberText:  { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 4 },
  memberBadge: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },

  sectionTitle: { color: C.text, fontSize: 18, fontWeight: "800", marginBottom: 12 },
  actionRow: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: C.card, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 10,
  },
  actionIcon: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  actionTextWrap: { flex: 1 },
  actionTitle: { color: C.text, fontSize: 15, fontWeight: "800" },
  actionSub:   { color: C.text40, fontSize: 12, marginTop: 3 },

  versionRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 20 },
  versionText: { color: C.text20, fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.60)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: C.card2, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, paddingBottom: 44, borderTopWidth: 1, borderColor: C.border2,
    gap: 14, alignItems: "center",
  },
  modalEmoji:        { fontSize: 44 },
  modalTitle:        { color: C.text, fontSize: 22, fontWeight: "900" },
  modalQuote:        { color: C.text60, fontSize: 14, lineHeight: 22, textAlign: "center", fontStyle: "italic" },
  stayBtn:           { width: "100%", borderRadius: 16, overflow: "hidden" },
  stayGrad:          { paddingVertical: 16, alignItems: "center" },
  stayText:          { color: "#fff", fontSize: 16, fontWeight: "900" },
  logoutConfirmBtn:  { width: "100%", borderRadius: 16, borderWidth: 1.5, borderColor: C.ruby, paddingVertical: 14, alignItems: "center" },
  logoutConfirmText: { color: C.ruby, fontSize: 15, fontWeight: "800" },
});
