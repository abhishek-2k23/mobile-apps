import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import HomeStack from "./HomeStack";
import OrdersStack from "./OrdersStack";
import ProfileDrawer from "./ProfileDrawer";
import { IconHome, IconOrders, IconProfile } from "../icons";

const Tab = createBottomTabNavigator();

const TAB_BAR_STYLE = {
  backgroundColor: "rgba(12,9,6,0.97)",
  borderTopColor: "rgba(250,190,60,0.14)",
  borderTopWidth: 1,
  height: 64,
  paddingBottom: 10,
} as const;

const HIDDEN_SCREENS = new Set(["RestaurantDetail", "Cart", "OrderPlaced", "Search"]);

export default function MainTabs() {
  const { cartCount } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: "#0C0906" },
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: "#F5A623",
        tabBarInactiveTintColor: "rgba(255,255,255,0.35)",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", letterSpacing: 0.2 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, React.ReactNode> = {
            Home:    <IconHome    size={size} color={color} />,
            Orders:  <IconOrders  size={size} color={color} />,
            Profile: <IconProfile size={size} color={color} />,
          };
          return icons[route.name] ?? null;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "HomeMain";
          return {
            tabBarStyle: [
              TAB_BAR_STYLE,
              HIDDEN_SCREENS.has(routeName) && { display: "none" },
            ],
          };
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined }}
      />
      <Tab.Screen name="Profile" component={ProfileDrawer} />
    </Tab.Navigator>
  );
}
