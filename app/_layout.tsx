import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import WelcomeScreen from './Pages/Welcome/WelcomeScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
       <WelcomeScreen></WelcomeScreen>
  );
}
