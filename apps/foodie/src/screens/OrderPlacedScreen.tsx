import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { C, GRAD } from "../constants/colors";

export default function OrderPlacedScreen({ route, navigation }: any) {
  const restaurantName = route.params?.restaurantName ?? "the restaurant";

  return (
    <View style={s.root}>
      <LinearGradient colors={GRAD.page} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
        <View style={s.content}>
          <View style={s.iconRing}>
            <LinearGradient colors={GRAD.amberH} style={s.iconGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MaterialCommunityIcons name="check-bold" size={36} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={s.title}>Order placed!</Text>
          <Text style={s.sub}>Your order from {restaurantName} is confirmed and on its way.</Text>
        </View>

        <Pressable
          style={({ pressed }) => [s.btn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "HomeMain" }] })}
        >
          <LinearGradient colors={GRAD.amberH} style={s.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={s.btnText}>Back to Home</Text>
          </LinearGradient>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1, padding: 24 },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },

  iconRing: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: C.amberLo,
    borderWidth: 2, borderColor: C.amberMid,
    alignItems: "center", justifyContent: "center",
    marginBottom: 24,
  },
  iconGradient: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },

  title: { color: C.text, fontSize: 30, fontWeight: "900", letterSpacing: -0.5 },
  sub:   { color: C.text60, fontSize: 15, lineHeight: 22, textAlign: "center", marginTop: 10, maxWidth: 280 },

  btn: { borderRadius: 16, overflow: "hidden" },
  btnGrad: { alignItems: "center", paddingVertical: 17 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
