import { Pressable } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ProfileScreen from "../screens/ProfileScreen";
import { MyOrdersScreen, SettingsScreen, HelpScreen } from "../screens/DrawerScreens";
import CustomDrawer from "./CustomDrawer";

const Drawer = createDrawerNavigator();

function BackBtn({ navigation }: { navigation: any }) {
  return (
    <Pressable
      style={{ marginLeft: 8, padding: 8 }}
      onPress={() => navigation.navigate("ProfileMain")}
    >
      <MaterialCommunityIcons name="arrow-left" size={22} color="#FFFFFF" />
    </Pressable>
  );
}

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
      <Drawer.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={({ navigation }) => ({
          title: "My Orders",
          headerLeft: () => <BackBtn navigation={navigation} />,
        })}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          title: "Settings",
          headerLeft: () => <BackBtn navigation={navigation} />,
        })}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={({ navigation }) => ({
          title: "Help & Support",
          headerLeft: () => <BackBtn navigation={navigation} />,
        })}
      />
    </Drawer.Navigator>
  );
}
