import {
  View, Text, Pressable, StyleSheet, ActivityIndicator,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { C, GRAD } from "../constants/colors";

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode]                       = useState<"login" | "signup">("login");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible]   = useState(false);
  const [error, setError]                     = useState("");
  const [loading, setLoading]                 = useState(false);

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
      setError(e instanceof Error ? e.message : "Could not continue.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    setPasswordVisible(false);
    setConfirmVisible(false);
    setMode((m) => (m === "login" ? "signup" : "login"));
  };

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
          <ScrollView
            contentContainerStyle={s.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Brand */}
            <View style={s.brand}>
              <View style={s.logoRow}>
                <View style={s.logoIcon}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={26} color={C.amber} />
                </View>
                <Text style={s.logoText}>Foodie</Text>
              </View>
              <Text style={s.tagline}>discover  ·  order  ·  enjoy</Text>
            </View>

            {/* Glass card */}
            <View style={s.card}>
              <Text style={s.cardTitle}>{mode === "login" ? "Welcome back" : "Create account"}</Text>
              <Text style={s.cardSub}>{mode === "login" ? "Sign in to continue" : "Join Foodie today"}</Text>

              {/* Email */}
              <View style={s.field}>
                <MaterialCommunityIcons name="email-outline" size={18} color={C.text40} />
                <TextInput
                  style={s.input}
                  placeholder="Email address"
                  placeholderTextColor={C.text20}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  selectionColor={C.amber}
                  returnKeyType="next"
                />
              </View>

              {/* Password */}
              <View style={s.field}>
                <MaterialCommunityIcons name="lock-outline" size={18} color={C.text40} />
                <TextInput
                  style={s.input}
                  placeholder="Password"
                  placeholderTextColor={C.text20}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  selectionColor={C.amber}
                  returnKeyType={mode === "signup" ? "next" : "done"}
                  onSubmitEditing={mode === "login" ? handleAuth : undefined}
                />
                <Pressable hitSlop={10} onPress={() => setPasswordVisible((v) => !v)}>
                  <MaterialCommunityIcons
                    name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={C.text40}
                  />
                </Pressable>
              </View>

              {/* Confirm password — signup only */}
              {mode === "signup" && (
                <View style={s.field}>
                  <MaterialCommunityIcons name="lock-check-outline" size={18} color={C.text40} />
                  <TextInput
                    style={s.input}
                    placeholder="Confirm password"
                    placeholderTextColor={C.text20}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!confirmVisible}
                    selectionColor={C.amber}
                    returnKeyType="done"
                    onSubmitEditing={handleAuth}
                  />
                  <Pressable hitSlop={10} onPress={() => setConfirmVisible((v) => !v)}>
                    <MaterialCommunityIcons
                      name={confirmVisible ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={C.text40}
                    />
                  </Pressable>
                </View>
              )}

              {!!error && <Text style={s.error}>{error}</Text>}

              <Pressable
                style={({ pressed }) => [s.btn, { opacity: pressed ? 0.85 : 1 }]}
                onPress={handleAuth}
                disabled={loading}
              >
                <LinearGradient colors={GRAD.amberH} style={s.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.btnText}>{mode === "login" ? "Sign In" : "Create Account"}</Text>
                  }
                </LinearGradient>
              </Pressable>

              <View style={s.switchRow}>
                <Text style={s.switchLabel}>
                  {mode === "signup" ? "Already have an account?  " : "Don't have an account?  "}
                </Text>
                <Text style={s.switchLink} onPress={switchMode}>
                  {mode === "signup" ? "Sign in" : "Sign up"}
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 48 },

  brand: { alignItems: "center", marginBottom: 40 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  logoIcon: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: C.amberLo,
    borderWidth: 1, borderColor: C.amberMid,
    alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: 42, fontWeight: "900", color: C.text, letterSpacing: -1.5 },
  tagline: { fontSize: 12, color: C.text40, letterSpacing: 2, textTransform: "uppercase" },

  card: {
    backgroundColor: C.card2, borderRadius: 24,
    borderWidth: 1, borderColor: C.border2,
    padding: 24, gap: 14,
  },
  cardTitle: { fontSize: 24, fontWeight: "800", color: C.text, marginBottom: 2 },
  cardSub:   { fontSize: 14, color: C.text60, marginBottom: 4 },

  field: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 14, paddingHorizontal: 16,
  },
  input: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 15 },

  error: { color: "#FF6B6B", fontSize: 13, lineHeight: 18 },

  btn: { borderRadius: 14, overflow: "hidden", marginTop: 4 },
  btnGrad: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  switchRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: 2 },
  switchLabel: { color: C.text60, fontSize: 14 },
  switchLink:  { color: C.amber, fontSize: 14, fontWeight: "700" },
});
