import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../screens/OrdersScreen";
import TrackOrderScreen from "../screens/TrackOrderScreen";
import SavedPlacesScreen from "../screens/SavedPlacesScreen";
import OffersScreen from "../screens/OffersScreen";

const Stack = createNativeStackNavigator();

export default function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0C0906" } }}>
      <Stack.Screen name="OrdersMain" component={OrdersScreen} />
      <Stack.Screen name="TrackOrder"   component={TrackOrderScreen} />
      <Stack.Screen name="SavedPlaces"  component={SavedPlacesScreen} />
      <Stack.Screen name="Offers"       component={OffersScreen} />
    </Stack.Navigator>
  );
}
