import 'react-native-get-random-values';
import './src/libs/dayjs';

import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppProvider, UserProvider } from '@realm/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WifiSlash } from 'phosphor-react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import theme from './src/theme';

import { SignIn } from './src/screens/SignIn';
import { Loading } from './src/components/Loading';
import { TopMessage } from './src/components/TopMessage';

import { REALM_APP_ID } from '@env';
import { Routes } from './src/routes';
import { RealmProvider, syncConfig } from './src/libs/realm';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  const netInfo = useNetInfo();

  if(!fontsLoaded) {
    return (
      <Loading />
    )
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaProvider
          style={{
            flex: 1,
            backgroundColor: theme.COLORS.GRAY_800
          }}
        >
          { !netInfo.isConnected && (
            <TopMessage
              icon={WifiSlash}
              title='Você está off-line'
            />
          )}
          <UserProvider fallback={SignIn}>
            <RealmProvider
              sync={syncConfig}
              fallback={Loading}
            >
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
