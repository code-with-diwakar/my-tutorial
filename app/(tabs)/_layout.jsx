import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
     <Stack.Screen name="home" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
