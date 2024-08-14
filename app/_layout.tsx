import { Stack, useLocalSearchParams } from "expo-router";

export default function RootLayout() {
  const params = useLocalSearchParams();
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false, 
          // title: "Home"
        }}
      />
      <Stack.Screen 
        name="Categories/[id]"
        options={{}}
      />
      <Stack.Screen 
        name="Categories/Passages/[passage]"
        options={{}}
      />
      <Stack.Screen 
        name="Categories/Verse/[verse]"
        options={{
          title: ''
        }}
      />
      

    </Stack>
  );
}
