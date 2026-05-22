import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

type P = { size?: number; color?: string };

export const IconRestaurant  = ({ size = 22, color = "#FF6B35" }: P) => <MaterialCommunityIcons name="silverware-fork-knife"   size={size} color={color} />;
export const IconBolt        = ({ size = 22, color = "#FF6B35" }: P) => <MaterialCommunityIcons name="lightning-bolt"          size={size} color={color} />;
export const IconLocation    = ({ size = 22, color = "#FF6B35" }: P) => <Ionicons               name="location-sharp"          size={size} color={color} />;
export const IconHome        = ({ size = 22, color = "#888"    }: P) => <MaterialCommunityIcons name="home"                    size={size} color={color} />;
export const IconSearch      = ({ size = 22, color = "#888"    }: P) => <Ionicons               name="search"                  size={size} color={color} />;
export const IconOrders      = ({ size = 22, color = "#888"    }: P) => <MaterialCommunityIcons name="clipboard-list-outline"  size={size} color={color} />;
export const IconProfile     = ({ size = 22, color = "#888"    }: P) => <Ionicons               name="person"                  size={size} color={color} />;
export const IconCart        = ({ size = 22, color = "#fff"    }: P) => <MaterialCommunityIcons name="cart"                    size={size} color={color} />;
export const IconStar        = ({ size = 16, color = "#FF6B35" }: P) => <MaterialCommunityIcons name="star"                    size={size} color={color} />;
export const IconClock       = ({ size = 16, color = "#888"    }: P) => <MaterialCommunityIcons name="clock-outline"           size={size} color={color} />;
export const IconChevronRight= ({ size = 20, color = "#555"    }: P) => <MaterialCommunityIcons name="chevron-right"           size={size} color={color} />;
export const IconMenu        = ({ size = 22, color = "#fff"    }: P) => <MaterialCommunityIcons name="menu"                    size={size} color={color} />;
export const IconSettings    = ({ size = 22, color = "#888"    }: P) => <MaterialCommunityIcons name="cog-outline"             size={size} color={color} />;
export const IconHelp        = ({ size = 22, color = "#888"    }: P) => <MaterialCommunityIcons name="help-circle-outline"     size={size} color={color} />;
export const IconLogout      = ({ size = 22, color = "#FF6B35" }: P) => <MaterialCommunityIcons name="logout"                  size={size} color={color} />;
