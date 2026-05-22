import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import RestaurantDetailScreen from "../screens/RestaurantDetailScreen";
import CartScreen from "../screens/CartScreen";
import OrderPlacedScreen from "../screens/OrderPlacedScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#0C0906" },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} options={{ animation: "fade" }} />
    </Stack.Navigator>
  );
}
