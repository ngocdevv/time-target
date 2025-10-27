import { useFonts } from "expo-font";
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomTab } from './src/components/bottom-tab';
import { CircularDraggableSlider, CircularDraggableSliderRefType } from './src/components/circle-time';
import { Header } from "./src/components/header";
import { Queued } from "./src/components/queued";
import { TimeRange } from './src/components/time-range';

const LinesAmount = 200;

export default function App() {
  const animatedNumber = useSharedValue(0);
  const previousTick = useSharedValue(0);

  const circularSliderRef = useRef<CircularDraggableSliderRefType>(null);
  const selectedDuration = useSharedValue(1);
  return (
    <SafeAreaProvider>
      <FontsProvider>
        <GestureHandlerRootView style={styles.fill}>
          <View style={[styles.fill]}>
            <Header />
            <Queued />
            <View style={styles.container}>
              <CircularDraggableSlider
                ref={circularSliderRef}
                bigLineIndexOffset={10}
                linesAmount={LinesAmount}
                maxLineHeight={20}
                minLineHeight={8}
                onProgressChange={sliderProgress => {
                  'worklet';
                  if (sliderProgress < 0) {
                    return;
                  }

                  // Only trigger haptics when crossing a line (when tick value changes)
                  if (sliderProgress !== previousTick.value) {
                    previousTick.value = sliderProgress;
                  }

                  // Bind the progress value to the animated number
                  animatedNumber.value = sliderProgress;
                }}
              />
              <TimeRange
                onDurationChange={durationHours => {
                  'worklet';
                  selectedDuration.value = durationHours;
                }}
              />
            </View>
            <View>
              
            </View>
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
    backgroundColor: '#000',
    flex: 1,
  },
});
