import { useFonts } from "expo-font";
import { useRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
                selectedDuration={selectedDuration}
              />
              <TimeRange
                onDurationChange={durationHours => {
                  'worklet';
                  selectedDuration.value = durationHours;
                }}
              />
            </View>
            <View style={styles.buttonsWrapper}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => console.log('Confirm pressed')}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => console.log('Back pressed')}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
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
  buttonsWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
  },
  confirmButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // iOS shadow
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  confirmButtonText: {
    color: '#504e4eff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
