import { Stack } from 'expo-router';
import { useTheme } from '../../hooks';

export default function ReviewLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
