import { LinkingOptions } from "@react-navigation/native";

export const linking: LinkingOptions<any> = {
  prefixes: ["foodie://"],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Home: {
            screens: {
              RestaurantDetail: "restaurant/:id",
            },
          },
        },
      },
    },
  },
};
