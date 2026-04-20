import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/hooks/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(commerce)/ventes"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(commerce)/clients"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(commerce)/fournisseurs"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(commerce)/vente-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(commerce)/proformas"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(commerce)/produits"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
