import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { forwardRef } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { LineTime } from './line-time';


export type DraggableSliderProps = {
  linesAmount: number;
  maxLineHeight: number;
  minLineHeight: number;
  bigLineIndexOffset?: number;
  lineWidth?: number;
  indicatorColor?: string;
  lineColor?: string;
  bigLineColor?: string;
  mediumLineColor?: string;
  selectedDuration?: SharedValue<number>;
};

const { height: WindowHeight } = Dimensions.get('window');
const radius = 200;
const HOUR_LABELS_AMOUNT = 10;

export type CircularDraggableSliderRefType = {
  resetTimer: () => void;
  runTimer: (to: number) => void;
  stopTimer: () => void;
};

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
      lineColor = '#c6c6c6',
      bigLineColor = '#c6c6c6',
      mediumLineColor = '#c6c6c6',
      selectedDuration,
    },
    ref,
  ) => {
    const progress = useSharedValue(0);
    const isTimerEnabled = useSharedValue(false);
    const diameter = 2 * Math.PI * radius;
    const distanceBetweenTwoTicks = diameter / linesAmount;
    const listWidth = diameter;

    const offset = 0;
    const progressRadiants = useDerivedValue(() => {
      return interpolate(
        -progress.value,
        [0, listWidth],
        [offset, 2 * Math.PI + offset],
      );
    }, [listWidth]);

    const overlayStyle = useAnimatedStyle(() => {
      const angleStep = (2 * Math.PI) / linesAmount;
      const hourIndexRatio = progressRadiants.value / (angleStep * bigLineIndexOffset);
      const boundedHourIndex = Math.max(
        1,
        Math.min(HOUR_LABELS_AMOUNT, Math.round(hourIndexRatio)),
      );
      const requestedTickIndex = boundedHourIndex * bigLineIndexOffset;
      if (requestedTickIndex > linesAmount) {
        return { opacity: 0 };
      }

      const targetTickIndex = Math.min(linesAmount - 1, requestedTickIndex);
      const labelRadius = radius + LABEL_RADIUS_OFFSET;
      const angle = angleStep * targetTickIndex - progressRadiants.value;
      const x = Math.cos(angle) * labelRadius;
      const y = Math.sin(angle) * labelRadius;

      return {
        opacity: 1,
        transform: [
          { translateX: x - LABEL_WIDTH / 2 },
          { translateY: y - LABEL_HEIGHT / 2 },
        ],
      };
    }, [bigLineIndexOffset, linesAmount, radius]);

    useAnimatedReaction(
      () => selectedDuration?.value ?? null,
      duration => {
        if (duration === null) {
          return;
        }

        const clampedDuration = Math.max(0, duration);
        const targetIndex = Math.min(
          linesAmount - 1,
          clampedDuration * bigLineIndexOffset,
        );
        const targetProgress = -distanceBetweenTwoTicks * targetIndex;

        cancelAnimation(progress);
        progress.value = withTiming(targetProgress, { duration: 250 });
      },
      [bigLineIndexOffset, distanceBetweenTwoTicks, selectedDuration],
    );

    return (
      <View style={styles.container}>
        <View
          pointerEvents="none"
          style={[
            {
              height: radius * 2,
              width: radius * 2,
              right: 60,
              transform: [
                {
                  translateY: WindowHeight / 2 - radius - 36,
                },
              ],
            },
          ]}>

          <Animated.View pointerEvents="none">

            {new Array(linesAmount).fill(0).map((_, index) => {
              const isBigLine = index % bigLineIndexOffset === 0;
              const midpointOffset = bigLineIndexOffset / 2;
              const isMediumLine = !isBigLine && index % bigLineIndexOffset === midpointOffset;
              const mediumLineHeight = (maxLineHeight + minLineHeight) / 2;
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
            {new Array(HOUR_LABELS_AMOUNT).fill(0).map((_, hourIndex) => {
              const label = `${hourIndex + 1} hr`;
              const tickIndex = (hourIndex + 1) * bigLineIndexOffset;
              if (tickIndex > linesAmount) {
                return null;
              }

              return (
                <HourLabel
                  key={label}
                  label={label}
                  radius={radius}
                  linesAmount={linesAmount}
                  progressRadiants={progressRadiants}
                  tickIndex={tickIndex}
                />
              );
            })}
            <Animated.View
              pointerEvents="none"
              style={[styles.hourLabelOverlay, overlayStyle]}
            >
              <LinearGradient
                start={{
                  x: 0,
                  y: 0
                }}
                end={{
                  x: 0,
                  y: 1
                }}
                colors={['transparent','#00000080', '#000000', '#000000', '#000000' , '#00000080', 'transparent']}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
            </Animated.View>
          </Animated.View>
          <LinearGradient
            colors={['#000000', '#000000', '#000000', '#00000070', 'transparent']}
            start={{
              x: 0,
              y: 0
            }}
            end={{
              x: 1.1,
              y: 0
            }}
            style={{
              position: 'absolute',
              height: radius * 2 + 94,
              width: radius * 2 + 94,
              left: -220,
              top: -(WindowHeight / 2 - radius + 8),
              // backgroundColor: 'red',
              borderRadius: 1000
            }}
          />
        </View>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              height: WindowHeight / 2,
            },
            styles.timer,
          ]}
        />
      </View>
    );
  },
);

type HourLabelProps = {
  label: string;
  progressRadiants: SharedValue<number>;
  linesAmount: number;
  tickIndex: number;
  radius: number;
};

const LABEL_WIDTH = 60;
const LABEL_HEIGHT = 28;
const LABEL_RADIUS_OFFSET = 40;

const HourLabel: React.FC<HourLabelProps> = ({
  label,
  progressRadiants,
  linesAmount,
  tickIndex,
  radius,
}) => {
  const rStyle = useAnimatedStyle(() => {
    const angle =
      ((2 * Math.PI) / linesAmount) * tickIndex - progressRadiants.value;
    const labelRadius = radius + LABEL_RADIUS_OFFSET;
    const x = Math.cos(angle) * labelRadius;
    const y = Math.sin(angle) * labelRadius;

    return {
      transform: [
        { translateX: x - LABEL_WIDTH / 2 },
        { translateY: y - LABEL_HEIGHT / 2 },
      ],
    };
  }, [linesAmount, radius, tickIndex]);

  return (
    <Animated.View pointerEvents="none" style={[styles.hourLabel, rStyle]}>
      <Text style={styles.hourLabelText}>{label}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  timer: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  hourLabel: {
    position: 'absolute',
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    left: 10
  },
  hourLabelOverlay: {
    position: 'absolute',
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    backgroundColor: '#000',
    borderRadius: LABEL_HEIGHT / 2,
    zIndex: 1,
    left: 10,
  },
  hourLabelText: {
    color: '#d8d8d8',
    fontFamily: 'SF-Pro-Rounded-Bold',
    fontSize: 20,
  },
});
