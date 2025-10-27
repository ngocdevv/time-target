import { StyleSheet, View } from 'react-native';

import { useRef } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomTab } from './src/components/bottom-tab';
import { CircularDraggableSlider, CircularDraggableSliderRefType } from './src/components/circle-time';
import { TimeRange } from './src/components/time-range';

// Handle timezone offset to ensure correct time display
// Note: This is a simple implementation. For production, consider using a proper timezone library
const TimezoneOffsetMs = -new Date().getTimezoneOffset() * 60000;

/**
 * Generate an array of time slots for the time range selector
 * Creates 20 time slots starting from 13:00 with 30-minute intervals
 */
const dates = new Array(20).fill(0).map((_, index) => {
  const hour = Math.floor(index / 2) + 13;
  const minutes = index % 2 === 0 ? 0 : 30;
  return new Date(2025, 0, 1, hour, minutes);
});



const LinesAmount = 200;

export default function App() {
  const animatedNumber = useSharedValue(0);
  const previousTick = useSharedValue(0);

  const circularSliderRef = useRef<CircularDraggableSliderRefType>(null);
  const date = useSharedValue(dates[0].getTime());

  const clockDate = useDerivedValue(() => {
    'worklet';
    return date.value + TimezoneOffsetMs;
  });

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <CircularDraggableSlider
              ref={circularSliderRef}
              bigLineIndexOffset={10}
              linesAmount={LinesAmount}
              maxLineHeight={20}
              lineColor="rgba(255,255,255,0.5)"
              bigLineColor="white"
              minLineHeight={8}
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
            <TimeRange
              dates={dates}
              onDateChange={updatedDate => {
                'worklet';
                date.value = updatedDate;
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
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: '#000',
    flex: 1,
  },
});
