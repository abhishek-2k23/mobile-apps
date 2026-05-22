import { useRef, useEffect, useState, useMemo } from "react";
import {
  View, Text, Pressable, StyleSheet, FlatList, Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import FoodImage from "../components/FoodImage";
import { C, GRAD } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width: SW, height: SH } = Dimensions.get("window");

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&q=90",
    hindi: "\"Bhookh lage... bas tap karo.\"",
    english: "Hot meals, fast delivery, zero waiting drama.",
    icon: "fire" as const,
  },
  {
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=90",
    hindi: "\"Taste bhi, speed bhi, full vibe bhi.\"",
    english: "Curated kitchens made for every mood.",
    icon: "rocket-launch" as const,
  },
  {
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=90",
    hindi: "\"Late night cravings? Hum online hain.\"",
    english: "Because hunger doesn’t follow office hours.",
    icon: "fire" as const,
  },
  {
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=900&q=90",
    hindi: "\"Chai, snacks aur endless scrolling.\"",
    english: "Your next favorite meal starts here.",
    icon: "rocket-launch" as const,
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { C, GRAD } = useTheme();
  const s = useMemo(() => makeStyles(C, GRAD), [C]);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (index + 1) % SLIDES.length;
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    }, 3800);
    return () => clearInterval(timer);
  }, [index]);

  const goTo = (i: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
  };

  return (
    <View style={s.root}>
      {/* Full-screen sliding images */}
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={s.slide}>
            <FoodImage uri={item.image} style={s.slideImg} />
          </View>
        )}
      />

      {/* Dark gradient overlay */}
      <LinearGradient
        colors={["rgba(12,9,6,0.15)", "rgba(12,9,6,0.60)", C.bg]}
        locations={[0, 0.45, 0.88]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
        {/* Brand top */}
        <View style={s.brandRow}>
          <View style={s.brandIcon}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={18} color={C.amber} />
          </View>
          <Text style={s.brand}>FOODIE</Text>
        </View>

        {/* Quote block */}
        <View style={s.quoteBlock} pointerEvents="none">
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={s.iconWrap}>
              <MaterialCommunityIcons name={SLIDES[index].icon} size={26} color={C.amber} />
            </View>
            <Text style={s.hindi}>{SLIDES[index].hindi}</Text>
            <Text style={s.english}>{SLIDES[index].english}</Text>
          </Animated.View>
        </View>

        {/* Bottom area */}
        <View style={s.bottom}>
          {/* Dot indicators */}
          <View style={s.dots}>
            {SLIDES.map((_, i) => (
              <Pressable key={i} onPress={() => goTo(i)}>
                <View style={[s.dot, i === index && s.dotActive]} />
              </Pressable>
            ))}
          </View>

          {/* CTA */}
          <Pressable
            style={({ pressed }) => [s.btn, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => navigation.replace("MainTabs")}
          >
            <LinearGradient colors={GRAD.amber} style={s.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={s.btnText}>Get Started</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
            </LinearGradient>
          </Pressable>

          <Text style={s.skip} onPress={() => navigation.replace("MainTabs")}>
            Skip for now
          </Text>
        </View>

        {/* Left / right edge slide arrows */}
        <Pressable
          style={s.arrowLeft}
          onPress={() => goTo((index - 1 + SLIDES.length) % SLIDES.length)}
        >
          <MaterialCommunityIcons name="chevron-left" size={26} color="rgba(255,255,255,0.85)" />
        </Pressable>
        <Pressable
          style={s.arrowRight}
          onPress={() => goTo((index + 1) % SLIDES.length)}
        >
          <MaterialCommunityIcons name="chevron-right" size={26} color="rgba(255,255,255,0.85)" />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const makeStyles = (C: any, GRAD: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  slide: { width: SW, height: SH },
  slideImg: { width: "100%", height: "100%", resizeMode: "cover" },

  safe: { ...StyleSheet.absoluteFillObject, justifyContent: "space-between" },

  brandRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 28, paddingTop: 8,
  },
  brandIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid,
    alignItems: "center", justifyContent: "center",
  },
  brand: { fontSize: 16, fontWeight: "900", color: C.text, letterSpacing: 3 },

  quoteBlock: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 28, paddingBottom: 40 },
  iconWrap: {
    width: 52, height: 52, borderRadius: 18,
    backgroundColor: C.amberLo, borderWidth: 1, borderColor: C.amberMid,
    alignItems: "center", justifyContent: "center", marginBottom: 18,
  },
  hindi:   { fontSize: 28, fontWeight: "900", color: C.text, letterSpacing: -0.6, lineHeight: 34, marginBottom: 12 },
  english: { fontSize: 15, color: C.text80, lineHeight: 22, fontWeight: "500" },

  bottom: { paddingHorizontal: 28, paddingBottom: 8, gap: 20 },
  dots: { flexDirection: "row", gap: 8, alignSelf: "center" },
  dot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  dotActive: { width: 22, backgroundColor: C.amber },

  arrowLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -24 }],
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(12,9,6,0.35)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -24 }],
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(12,9,6,0.35)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  btn: { borderRadius: 16, overflow: "hidden" },
  btnGrad: { paddingVertical: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  skip:    { color: C.text40, fontSize: 14, textAlign: "center", paddingBottom: 6 },
});
