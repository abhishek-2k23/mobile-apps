import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../screens/ProfileScreen";
import { MyOrdersScreen, SettingsScreen, HelpScreen } from "../screens/DrawerScreens";
import CustomDrawer from "./CustomDrawer";

const Drawer = createDrawerNavigator();

export default function ProfileDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#0C0906" },
        headerTintColor: "#F5A623",
        headerTitleStyle: { fontWeight: "800", color: "#FFFFFF" },
        drawerType: "front",
        drawerStyle: { width: 280, backgroundColor: "#0C0906" },
        sceneStyle: { backgroundColor: "#0C0906" },
      }}
    >
      <Drawer.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Profile", headerShown: false }}
      />
      <Drawer.Screen name="MyOrders" component={MyOrdersScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Help"     component={HelpScreen}     options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}
