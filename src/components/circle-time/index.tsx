import { Dimensions, StyleSheet, View } from 'react-native';

import { forwardRef, useImperativeHandle } from 'react';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

import { useTimer } from '../useTimer';
import { LineTime } from './line-time';


export type DraggableSliderProps = {
  // Total number of lines in the slider
  linesAmount: number;
  // Maximum height of a line
  maxLineHeight: number;
  // Minimum height of a line
  minLineHeight: number;
  // Optional: Offset for determining big lines, defaults to 10
  // That means that every 10th line will be a big line
  bigLineIndexOffset?: number;
  // Optional: The width of each line, defaults to 1.5
  lineWidth?: number;
  // Optional: Callback function called when the progress changes
  onProgressChange?: (progress: number) => void;
  // Optional: Shared value representing the color of the indicator line
  indicatorColor?: string;
  // Optional: The color of the lines (default is #c6c6c6)
  lineColor?: string;
  // Optional: The color of the big lines (default is #c6c6c6)
  bigLineColor?: string;
  // Optional: The color of the medium lines (default is #c6c6c6)
  mediumLineColor?: string;
  onCompletion?: () => void;
};

const { height: WindowHeight } = Dimensions.get('window');
const radius = 250;

export type CircularDraggableSliderRefType = {
  resetTimer: () => void;
  runTimer: (to: number) => void;
  stopTimer: () => void;
};

// This one was really challening :)
// The idea is to use a custom pan gesture handler to handle the drag event and update the progress value accordingly.
// Once the user drags, the progress gets converted to radians and then to seconds.

// To map the translation to an angle I've used the interpolate function.
// Here's the idea.
// Let's imagine that you don't see a circle but a straight line | | | | | | | | | | |
// What's the distance between two ticks? It's the straight line length divided by the amount of ticks.
// But actually the straight line length is our diameter of the circle, so it's 2 * PI * radius.
// const distanceBetweenTwoTicks = diameter / linesAmount; -> 2 * PI * radius / linesAmount

// Once we have this knowledge we can remap the progress value to radians.
// ->
// inputRange: [0, listWidth]
// outputRange: [0, 2 * Math.PI]
// I have added an offset in the actual code to rotate the circle by 90 degrees at the very beginning

export const CircularDraggableSlider = forwardRef<
  CircularDraggableSliderRefType,
  DraggableSliderProps
>(
  (
    {
      linesAmount,
      maxLineHeight,
      minLineHeight,
      bigLineIndexOffset = 10,
      lineWidth = 1.5,
      onProgressChange,
      lineColor = '#c6c6c6',
      bigLineColor = '#c6c6c6',
      mediumLineColor = '#c6c6c6',
      onCompletion,
    },
    ref,
  ) => {
    const progress = useSharedValue(0);
    const previousProgress = useSharedValue(0);

    const distanceBetweenTwoTicksRad = (2 * Math.PI) / linesAmount;
    const diameter = 2 * Math.PI * radius;
    const distanceBetweenTwoTicks = diameter / linesAmount;
    const listWidth = diameter;

    const { runTimer, stopTimer, resetTimer, isTimerEnabled } = useTimer({
      progress,
      incrementOffset: distanceBetweenTwoTicks,
      onCompletion: () => {
        isTimerEnabled.value = false;
        onCompletion?.();
      },
    });

    useImperativeHandle(ref, () => {
      return {
        resetTimer,
        runTimer,
        stopTimer,
      };
    }, [resetTimer, runTimer, stopTimer]);

    const panGesture = Gesture.Pan()
      .onBegin(() => {
        if (isTimerEnabled.value) {
          return;
        }
        cancelAnimation(progress);
        previousProgress.value = progress.value;
      })
      .onUpdate(event => {
        if (isTimerEnabled.value) {
          return;
        }
        progress.value = event.translationY + previousProgress.value;
      })
      .onFinalize(event => {
        if (isTimerEnabled.value) {
          return;
        }
        if (progress.value > 0) {
          cancelAnimation(progress);
          progress.value = withTiming(0, { duration: 500 });
          return;
        }
        progress.value = withDecay({
          velocity: event.velocityY,
        });
      });

    // Offset set to 0 for 90-degree rotation (indicator at right side)
    const offset = 0;
    const progressRadiants = useDerivedValue(() => {
      return interpolate(
        -progress.value,
        [0, listWidth],
        [offset, 2 * Math.PI + offset],
      );
    }, [listWidth]);

    useAnimatedReaction(
      () => progressRadiants.value,
      radiants => {
        const amountOfSeconds = Math.round(
          (radiants - offset) / distanceBetweenTwoTicksRad,
        );
        if (onProgressChange) {
          onProgressChange(amountOfSeconds);
        }
      },
    );

    return (
      <View style={styles.container}>
        <View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              height: radius * 2,
              width: radius * 2,
              transform: [
                {
                  translateY: WindowHeight / 2 - radius / 2,
                },
              ],
            },
          ]}>
          <Animated.View pointerEvents="none">
            {new Array(linesAmount).fill(0).map((_, index) => {
              // Determine line type based on position
              const isBigLine = index % bigLineIndexOffset === 0;

              // Calculate the midpoint between consecutive big lines
              const midpointOffset = bigLineIndexOffset / 2;
              const isMediumLine = !isBigLine && index % bigLineIndexOffset === midpointOffset;

              // Calculate medium line height as the average of max and min
              const mediumLineHeight = (maxLineHeight + minLineHeight) / 2;

              // Determine height based on line type
              let height: number;
              let color: string;

              if (isBigLine) {
                height = maxLineHeight;
                color = bigLineColor;
              } else if (isMediumLine) {
                height = mediumLineHeight;
                color = mediumLineColor;
              } else {
                height = minLineHeight;
                color = lineColor;
              }

              return (
                <LineTime
                  disabled={isTimerEnabled}
                  key={index}
                  height={height}
                  radius={radius}
                  progressRadiants={progressRadiants}
                  index={index}
                  lineWidth={lineWidth}
                  color={color}
                  linesAmount={linesAmount}
                />
              );
            })}
          </Animated.View>
        </View>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                height: WindowHeight / 2,
              },
              styles.timer,
            ]}
          />
        </GestureDetector>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    transform: [
      {
        rotate: '90deg',
      },
    ],
  },
  timer: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
});