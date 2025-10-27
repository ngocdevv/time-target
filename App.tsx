import { StyleSheet, View } from 'react-native';

import { useRef } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomTab } from './src/components/bottom-tab';
import { CircularDraggableSlider, CircularDraggableSliderRefType } from './src/components/circle-time';


const LinesAmount = 200;

export default function App() {
  const animatedNumber = useSharedValue(0);
  const previousTick = useSharedValue(0);

  const circularSliderRef = useRef<CircularDraggableSliderRefType>(null);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View
              style={{
                marginBottom: 256,
              }}>
              {/* <AnimatedCount
          count={animatedNumber}
          maxDigits={5}
          textDigitWidth={68}
          textDigitHeight={120}
          fontSize={100}
          color="#fff"
          gradientAccentColor="#000"
        /> */}
            </View>
            <CircularDraggableSlider
              ref={circularSliderRef}
              bigLineIndexOffset={10}
              linesAmount={LinesAmount}
              indicatorColor={'orange'}
              maxLineHeight={40}
              lineColor="rgba(255,255,255,0.5)"
              bigLineColor="white"
              minLineHeight={30}
              onCompletion={async () => {

              }}
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
          </View>
          <BottomTab />
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'center',
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
  },
});
