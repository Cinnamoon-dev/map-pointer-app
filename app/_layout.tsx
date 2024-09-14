import { Tabs } from "expo-router";
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';


export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="bluetooth" color={color} size={size} />
        ),
        headerShown: false,
      }} />
      <Tabs.Screen name="home" options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="gamepad" color={color} size={size} />
        ),
        headerShown: false,
      }} />
    </Tabs>
  );
}