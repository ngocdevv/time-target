import { useFonts } from "expo-font";
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInUp, useSharedValue } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomTab } from './src/components/bottom-tab';
import { CircleTime } from './src/components/circle-time';
import { Footer } from "./src/components/footer";
import { Header } from "./src/components/header";
import { Queued } from "./src/components/queued";
import { TimeRange } from './src/components/time-range';

export default function App() {
  const selectedDuration = useSharedValue(5);
  return (
    <SafeAreaProvider>
      <FontsProvider>
        <GestureHandlerRootView style={styles.fill}>
          <View style={[styles.fill]}>
            <Header />
            <Queued />
            <Animated.View entering={FadeInUp.duration(600)} style={styles.container}>
              <CircleTime selectedDuration={selectedDuration}/>
              <TimeRange selectedDuration={selectedDuration} />
            </Animated.View>
            <Footer />
            <BottomTab />
          </View>
        </GestureHandlerRootView>
      </FontsProvider>
    </SafeAreaProvider>
  );
};


const FontsProvider = ({ children }: { children: React.ReactNode }) => {

  const [fontsLoaded] = useFonts({
    'SF-Pro-Rounded-Bold': require('./assets/fonts/SF-Pro-Rounded-Bold.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#000',
  },
  button: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
  },
  buttonsContainer: {
    bottom: 48,
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    right: 32,
  },
  container: {
    flexDirection: "row",
    alignItems: 'center',
    flex: 1,
  },

});
