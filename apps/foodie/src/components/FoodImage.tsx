import { useState } from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

const FALLBACK = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80";

export default function FoodImage({
  uri,
  style,
}: {
  uri: string;
  style: StyleProp<ImageStyle>;
}) {
  const [src, setSrc] = useState(uri);
  return (
    <Image
      source={{ uri: src || FALLBACK }}
      style={style}
      onError={() => setSrc(FALLBACK)}
    />
  );
}
