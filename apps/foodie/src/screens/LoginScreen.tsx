import {
  View, Text, Pressable, StyleSheet, ActivityIndicator,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import Animated, {
  FadeInDown, FadeInUp, FadeIn, useSharedValue, useAnimatedStyle, withSpring,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import { useQuote } from "../hooks/useQuote";
import { QuoteCard } from "../components/QuoteCard";

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const { C, GRAD } = useTheme();
  const styles = useMemo(() => makeStyles(C, GRAD), [C]);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { quote, next } = useQuote();
  useFocusEffect(useCallback(() => { next(); }, [next]));

  const scale = useSharedValue(1);
  const animatedBtn = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    setMode((m) => (m === "login" ? "signup" : "login"));
  };

  return (
    <View style={styles.root}>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1974&auto=format&fit=crop" }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      <LinearGradient colors={GRAD.hero} style={StyleSheet.absoluteFill} />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInDown.duration(800)} style={styles.brand}>
              <View style={styles.logo}>
                <LinearGradient
                  colors={GRAD.amberH}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialCommunityIcons name="silverware-fork-knife" size={34} color="white" />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Foodie</Text>
              <Text style={styles.subtitle}>Delicious food delivered to your door</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).duration(900)}>
              <BlurView intensity={35} tint="dark" style={styles.card}>
                <View style={styles.cardGlow} />

                <Text style={styles.cardTitle}>
                  {mode === "login" ? "Welcome Back 👋" : "Create Account"}
                </Text>
                <Text style={styles.cardSub}>
                  {mode === "login" ? "Login to continue" : "Join the food journey"}
                </Text>

                <View style={styles.field}>
                  <MaterialCommunityIcons name="email-outline" size={20} color={C.text60} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor={C.text40}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    selectionColor={C.amber}
                  />
                </View>

                <View style={styles.field}>
                  <MaterialCommunityIcons name="lock-outline" size={20} color={C.text60} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={C.text40}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    selectionColor={C.amber}
                  />
                  <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                    <MaterialCommunityIcons
                      name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={C.text60}
                    />
                  </Pressable>
                </View>

                {mode === "signup" && (
                  <View style={styles.field}>
                    <MaterialCommunityIcons name="lock-check-outline" size={20} color={C.text60} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor={C.text40}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!confirmVisible}
                      selectionColor={C.amber}
                    />
                  </View>
                )}

                {!!error && <Text style={styles.error}>{error}</Text>}

                <Animated.View style={animatedBtn}>
                  <Pressable
                    onPressIn={() => { scale.value = withSpring(0.96); }}
                    onPressOut={() => { scale.value = withSpring(1); }}
                    onPress={handleAuth}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={GRAD.amberH}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.button}
                    >
                      {loading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text style={styles.buttonText}>
                          {mode === "login" ? "Sign In" : "Create Account"}
                        </Text>
                      )}
                    </LinearGradient>
                  </Pressable>
                </Animated.View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  </Text>
                  <Pressable onPress={switchMode}>
                    <Text style={styles.switchLink}>
                      {mode === "login" ? " Sign Up" : " Sign In"}
                    </Text>
                  </Pressable>
                </View>
              </BlurView>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (C: any, GRAD: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },

  glowTop: {
    position: "absolute", width: 280, height: 280, borderRadius: 999,
    backgroundColor: C.amberLo, top: -100, right: -70,
  },
  glowBottom: {
    position: "absolute", width: 260, height: 260, borderRadius: 999,
    backgroundColor: C.amberLo, bottom: -110, left: -60,
  },

  brand: { alignItems: "center", marginBottom: 20 },
  quoteWrap: { marginBottom: 20 },
  logo:  { marginBottom: 20 },
  logoGradient: {
    width: 84, height: 84, borderRadius: 30,
    justifyContent: "center", alignItems: "center",
    shadowColor: C.amber, shadowOpacity: 0.45, shadowRadius: 22, elevation: 16,
  },
  title:    { color: "#fff", fontSize: 42, fontWeight: "900", letterSpacing: -1 },
  subtitle: { color: C.text80, marginTop: 8, fontSize: 15 },

  card: {
    borderRadius: 30, overflow: "hidden", padding: 24,
    borderWidth: 1, borderColor: C.amberMid,
    backgroundColor: "rgba(255,255,255,0.07)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18, shadowRadius: 25, elevation: 18,
  },
  cardGlow: {
    position: "absolute", width: 180, height: 180, borderRadius: 999,
    backgroundColor: C.amberLo, top: -60, right: -30,
  },
  cardTitle: { color: "#fff", fontSize: 28, fontWeight: "800" },
  cardSub:   { color: C.text60, marginTop: 8, marginBottom: 24 },

  field: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.amberLo,
    borderRadius: 18, paddingHorizontal: 16, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  input: { flex: 1, color: "#fff", paddingVertical: 16, paddingHorizontal: 12, fontSize: 15 },

  button: {
    paddingVertical: 18, borderRadius: 18, alignItems: "center", marginTop: 8,
    shadowColor: C.amber, shadowOpacity: 0.35, shadowRadius: 18, elevation: 12,
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  switchRow:  { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  switchText: { color: C.text60 },
  switchLink: { color: C.amber, fontWeight: "700" },
  error:      { color: C.amber, marginBottom: 12 },
});
