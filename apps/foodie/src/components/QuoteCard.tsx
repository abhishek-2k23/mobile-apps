import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { type Quote } from "../constants/quotes";

export function QuoteCard({ quote }: { quote: Quote }) {
  const { C } = useTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(200)}
      style={[s.card, { backgroundColor: C.amberLo, borderColor: C.amberMid }]}
    >
      <View style={[s.bar, { backgroundColor: C.amber }]} />
      <View style={s.body}>
        <Text style={[s.mark, { color: C.amber }]}>"</Text>
        <Text style={[s.text, { color: C.text80 }]}>{quote.text}</Text>
        <Text style={[s.author, { color: C.amber }]}>— {quote.author}</Text>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  body: { flex: 1 },
  mark: { fontSize: 40, fontWeight: "900", lineHeight: 32, marginBottom: 6 },
  text: { fontSize: 13, lineHeight: 21, fontStyle: "italic" },
  author: { fontSize: 12, fontWeight: "800", marginTop: 10 },
});
