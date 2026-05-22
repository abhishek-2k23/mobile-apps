import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native"
import { useState, useMemo } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { Image as ExpoImage } from "expo-image"
import { IconLocation, IconOrders, IconSettings, IconHelp } from "../icons"
import { useAuth } from "../context/AuthContext"
import { C, GRAD } from "../constants/colors"
import { useTheme } from "../context/ThemeContext"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"

const CHEESY_LOGOUT_QUOTES = [
  { text: "Yaar, mat jao... pizza thanda ho jayega.", emoji: "🥺" },
  { text: "Aapka biryani kab se wait kar raha hai. Sochlo.", emoji: "🍛" },

  // Extra cheesy + foodie vibes 🍕
  { text: "Tum logout karoge toh momo udaas ho jayenge.", emoji: "🥟" },
  { text: "Chef ne extra cheese sirf aapke liye dala tha.", emoji: "🧀" },
  { text: "Abhi toh cravings start hui thi...", emoji: "😩" },
  { text: "Aap jaa rahe ho ya snacks ko ignore kar rahe ho?", emoji: "🍿" },
  {
    text: "Warning: Logout se midnight cravings aur dangerous ho sakti hain.",
    emoji: "🌙",
  },
  { text: "Golgappe ne personally bola hai — mat jao.", emoji: "🥹" },
  { text: "Aapke bina feed bhi adhoora lag raha hai.", emoji: "📱" },
  { text: "Ek last scroll mein shayad perfect dish mil jaaye.", emoji: "👀" },
  {
    text: "Dil toh bachcha hai ji... aur bachcha fries maang raha hai.",
    emoji: "🍟",
  },
  { text: "Logout karne se calories kam nahi hoti waise.", emoji: "😌" },
  { text: "Samosa still believes in this relationship.", emoji: "💔" },
  { text: "Aap gaye toh garlic bread kis ke liye warm rahega?", emoji: "🥖" },
  { text: "Itni jaldi kya hai? Dessert toh dekho.", emoji: "🍰" },
  { text: "App छोड़ doge, lekin cravings nahi.", emoji: "🤌" },
  {
    text: "Bhookh aur pyaar... dono baar baar laut ke aate hain.",
    emoji: "❤️",
  },
  { text: "Your next favorite meal is probably one scroll away.", emoji: "✨" },
  {
    text: "Khana emotional support hota hai. Don’t leave it hanging.",
    emoji: "🍜",
  },
  { text: "Stay. The burgers are getting nervous.", emoji: "🍔" },
  { text: "Aaj cheat day maan lo na...", emoji: "😏" },
  { text: "Logout karne se pani puri cravings cancel nahi hoti.", emoji: "💧" },
  { text: "Tumhare bina noodles bhi lonely feel kar rahe hain.", emoji: "🍜" },
  {
    text: "Mat jao... abhi toh cravings properly loaded bhi nahi hui.",
    emoji: "⏳",
  },
  { text: "Khana dekh ke logout karna paap hota hai.", emoji: "😔" },
  { text: "Aapke taste buds abhi aur explore karna chahte hain.", emoji: "👅" },
  { text: "Fries before goodbyes.", emoji: "🍟" },
  { text: "Biryani ne typing start kiya hai...", emoji: "⌨️" },
  { text: "Logout mat karo... chef ki feelings hurt ho jayengi.", emoji: "👨‍🍳" },
  { text: "Ek cheesy pizza aur hum dono settle ho jayenge.", emoji: "🍕" },
  { text: "Aap scroll karo, calories hum handle kar lenge.", emoji: "😌" },
  { text: "Tandoori smoke is literally calling your name.", emoji: "🔥" },
  { text: "Aapke next comfort food ka dil toot jayega.", emoji: "💔" },
  { text: "Stay for the dessert plot twist.", emoji: "🍨" },
  {
    text: "Kya pata next swipe mein soulmate sandwich mil jaaye.",
    emoji: "🥪",
  },
  {
    text: "Tum jaa rahe ho aur yahan brownies garam ho rahi hain.",
    emoji: "🍫",
  },
  {
    text: "Suna hai jo logout karte hain unhe late night cravings zyada hoti hain.",
    emoji: "🌚",
  },
  { text: "Pasta said: 'Don’t leave me hanging.'", emoji: "🍝" },
  { text: "Abhi toh butter chicken ka era start hua tha.", emoji: "🧈" },
  {
    text: "Aap offline jaa sakte ho, par cravings online rahengi.",
    emoji: "📶",
  },
  { text: "Chai aur pakode aapko miss karenge.", emoji: "☕" },
  { text: "Ek foodie kabhi truly logout nahi karta.", emoji: "😌" },
  { text: "Mat jao yaar... recommendation algorithm ro dega.", emoji: "🤖" },
  { text: "Stay hungry. Literally.", emoji: "😋" },
  { text: "Aaj ka cheat meal abhi pending hai boss.", emoji: "📋" },
  { text: "Your future self wants that extra slice.", emoji: "🍕" },
  { text: "Aapke bina kitchen vibes incomplete lag rahe hain.", emoji: "✨" },
  {
    text: "Yeh app nahi... ek emotional food support system hai.",
    emoji: "🥹",
  },
  { text: "Ice cream melts faster than your logout decision.", emoji: "🍦" },
  { text: "Aakhri baar menu dekh lo... bas last time.", emoji: "👀" },
  {
    text: "Food delivery guy already believes in this relationship.",
    emoji: "🛵",
  },
  { text: "Tum logout karoge toh cookies sad ho jayengi.", emoji: "🍪" },
  { text: "Aapka snack soulmate abhi bhi wait kar raha hai.", emoji: "💫" },
  { text: "Mood off hai? Garlic bread therapy try karo.", emoji: "🧄" },
  { text: "App band karne se bhookh band nahi hoti.", emoji: "😭" },
  { text: "Khana sirf food nahi, feeling hai.", emoji: "❤️" },
  { text: "Aaj calories count mat karo, memories count karo.", emoji: "📸" },
  { text: "Burger flipped just to impress you.", emoji: "🍔" },
  { text: "Ek warm brownie deserves your attention.", emoji: "🤎" },
  { text: "The snacks are rooting for you to stay.", emoji: "🥨" },
  {
    text: "Aap logout kar rahe ho ya happiness skip kar rahe ho?",
    emoji: "😶",
  },
  { text: "Good food takes time... aur thoda aur scrolling.", emoji: "📱" },
]

const ACTIONS = [
  {
    label: "My Orders",
    sub: "Track and repeat meals",
    screen: "MyOrders",
    Icon: IconOrders,
    color: C.amber,
  },
  {
    label: "Settings",
    sub: "Addresses, payments, preferences",
    screen: "Settings",
    Icon: IconSettings,
    color: "#A78BFA",
  },
]

const STAT_ICONS = [
  "clipboard-outline",
  "heart-outline",
  "star-outline",
] as const

const DP = { uri: "https://avatars.githubusercontent.com/u/86549937?s=400&u=79dfb37de04aad186f57d43e3a9ac97a0d426c63&v=4" }

export default function ProfileScreen({ navigation }: any) {
  const { user, orders, logout } = useAuth()
  const [logoutVisible, setLogoutVisible] = useState(false)
  const { C, GRAD } = useTheme()
  const s = useMemo(() => makeStyles(C, GRAD), [C])

  const [logoutQuote, setLogoutQuote] = useState(CHEESY_LOGOUT_QUOTES[0])

  const openLogout = () => {
    setLogoutQuote(CHEESY_LOGOUT_QUOTES[Math.floor(Math.random() * CHEESY_LOGOUT_QUOTES.length)])
    setLogoutVisible(true)
  }

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.content}
        >
          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Profile</Text>
            <Pressable
              style={s.menuBtn}
              onPress={() => navigation.navigate("Help")}
            >
              <IconHelp size={22} color={C.text} />
            </Pressable>
          </View>

          {/* Hero card */}
          <LinearGradient
            colors={["rgba(245,166,35,0.12)", "rgba(245,166,35,0.04)"]}
            style={s.heroCard}
          >
            <View style={s.heroTop}>
              <View style={s.avatarWrap}>
                <ExpoImage source={DP} style={s.avatar} contentFit="cover" />
                <View style={s.avatarBadge}>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={16}
                    color={C.amber}
                  />
                </View>
              </View>
              <View style={s.userCopy}>
                <Text style={s.name}>{user?.name ?? "Foodie User"}</Text>
                <Text style={s.email}>{user?.email ?? "hello@foodie.app"}</Text>
                <View style={s.locationPill}>
                  <IconLocation size={12} color={C.amber} />
                  <Text style={s.locationText}>Ranchi, India</Text>
                </View>
              </View>
            </View>

            {/* Stats row */}
            <View style={s.statsRow}>
              {[
                {
                  label: "Orders",
                  value: `${orders.length}`,
                  icon: STAT_ICONS[0],
                },
                { label: "Saved", value: "8", icon: STAT_ICONS[1] },
                { label: "Reviews", value: "12", icon: STAT_ICONS[2] },
              ].map((stat, i) => (
                <View key={stat.label} style={[s.stat, i < 2 && s.statBorder]}>
                  <MaterialCommunityIcons
                    name={stat.icon}
                    size={18}
                    color={C.amber}
                  />
                  <Text style={s.statValue}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* Membership banner */}
          <LinearGradient
            colors={GRAD.amber}
            style={s.memberCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={s.memberLeft}>
              <Text style={s.memberLabel}>Foodie Club</Text>
              <Text style={s.memberTitle}>Free deliveries unlocked</Text>
              <Text style={s.memberText}>
                You saved ₹312 on bowls & bakery runs.
              </Text>
            </View>
            <View style={s.memberBadge}>
              <MaterialCommunityIcons
                name="crown"
                size={28}
                color="rgba(255,255,255,0.90)"
              />
            </View>
          </LinearGradient>

          {/* Actions */}
          <Text style={s.sectionTitle}>Account</Text>
          {ACTIONS.map(({ label, sub, screen, Icon, color }) => (
            <Pressable
              key={label}
              style={s.actionRow}
              onPress={() => navigation.navigate(screen)}
            >
              <View style={[s.actionIcon, { backgroundColor: `${color}18` }]}>
                <Icon size={19} color={color} />
              </View>
              <View style={s.actionTextWrap}>
                <Text style={s.actionTitle}>{label}</Text>
                <Text style={s.actionSub}>{sub}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={C.text40}
              />
            </Pressable>
          ))}

          {/* Logout */}
          <Pressable style={s.actionRow} onPress={openLogout}>
            <View style={[s.actionIcon, { backgroundColor: `${C.ruby}18` }]}>
              <MaterialCommunityIcons name="logout" size={19} color={C.ruby} />
            </View>
            <View style={s.actionTextWrap}>
              <Text style={s.actionTitle}>Logout</Text>
              <Text style={s.actionSub}>
                Goodbye, see you at the next meal!
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={C.text40}
            />
          </Pressable>

          {/* App version */}
          <View style={s.versionRow}>
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={14}
              color={C.text20}
            />
            <Text style={s.versionText}>
              Foodie v1.0 · Made with ❤️, spices & late-night cravings
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Logout bottom sheet — overlays profile at z-index 100 */}
      {logoutVisible && (
        <>
          <Pressable
            style={s.backdrop}
            onPress={() => setLogoutVisible(false)}
          />
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Leaving already?</Text>
            <BlurView intensity={18} tint="dark" style={s.glassLine}>
              <Text style={s.glassEmoji}>{logoutQuote.emoji}</Text>
              <Text style={s.glassText}>{logoutQuote.text}</Text>
            </BlurView>
            <Pressable style={s.stayBtn} onPress={() => setLogoutVisible(false)}>
              <Text style={s.stayText}>Stay & eat 🍕</Text>
            </Pressable>
            <Pressable
              style={s.logoutConfirmBtn}
              onPress={() => {
                setLogoutVisible(false)
                logout()
              }}
            >
              <Text style={s.logoutConfirmText}>Yes, logout</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  )
}

const makeStyles = (C: any, GRAD: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: { fontSize: 28, fontWeight: "800", color: C.text },
  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.cardN,
    borderWidth: 1,
    borderColor: C.borderN,
    alignItems: "center",
    justifyContent: "center",
  },

  heroCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border2,
    gap: 18,
  },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: C.amberMid,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.amberMid,
    alignItems: "center",
    justifyContent: "center",
  },
  userCopy: { flex: 1 },
  name: { fontSize: 21, fontWeight: "800", color: C.text },
  email: { fontSize: 13, color: C.text60, marginTop: 3 },
  locationPill: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: C.amberLo,
    borderWidth: 1,
    borderColor: C.amberMid,
  },
  locationText: { color: C.amber, fontSize: 12, fontWeight: "800" },

  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: C.border2,
  },
  stat: { flex: 1, alignItems: "center", paddingTop: 14, gap: 4 },
  statBorder: { borderRightWidth: 1, borderRightColor: C.border2 },
  statValue: { fontSize: 20, fontWeight: "900", color: C.text },
  statLabel: { fontSize: 11, color: C.text60, fontWeight: "700" },

  memberCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  memberLeft: { flex: 1 },
  memberLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  memberTitle: { color: "#fff", fontSize: 17, fontWeight: "900", marginTop: 5 },
  memberText: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 4 },
  memberBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 10,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTextWrap: { flex: 1 },
  actionTitle: { color: C.text, fontSize: 15, fontWeight: "800" },
  actionSub: { color: C.text40, fontSize: 12, marginTop: 3 },

  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    marginTop: 20,
  },
  versionText: { color: C.text20, fontSize: 12 },

  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 99,
  },
  modalSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: 36,
    borderTopWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: C.amber,
    backgroundColor: C.bg2,
    gap: 16,
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.amberMid,
    marginBottom: 4,
  },
  modalTitle: { color: C.text, fontSize: 22, fontWeight: "900" },
  glassLine: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  glassEmoji: { fontSize: 38 },
  glassText: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 25,
  },
  stayBtn: {
    width: "100%", borderRadius: 16,
    backgroundColor: C.amber,
    paddingVertical: 16, alignItems: "center",
  },
  stayText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  logoutConfirmBtn: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.ruby,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutConfirmText: { color: C.ruby, fontSize: 15, fontWeight: "800" },
})
