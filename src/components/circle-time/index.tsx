import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { useMemo } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';

import { LineTime } from './line-time';


export type DraggableSliderProps = {
  bigLineIndexOffset?: number;
  selectedDuration: SharedValue<number>;
};

const { height: WindowHeight } = Dimensions.get('window');
const radius = 200;
const HOUR_LABELS_AMOUNT = 10;
const maxLineHeight = 20;
const minLineHeight = 8;
const linesAmount = 200;
const lineWidth = 1.5;

export const CircleTime: React.FC<DraggableSliderProps> = ({
  bigLineIndexOffset = 10,
  selectedDuration,
}) => {
  const progress = useSharedValue(0);
  const diameter = 2 * Math.PI * radius;
  const distanceBetweenTwoTicks = diameter / linesAmount;
  const listWidth = diameter;

  const progressRadiants = useDerivedValue(() => {
    return interpolate(
      -progress.value,
      [0, listWidth],
      [0, 2 * Math.PI],
    );
  }, [listWidth]);

  const mediumLineHeight = useMemo(
    () => (maxLineHeight + minLineHeight) / 2,
    [maxLineHeight, minLineHeight],
  );
  const lineIndices = useMemo(
    () => Array.from({ length: linesAmount }, (_, index) => index),
    [linesAmount],
  );
  const hourLabels = useMemo(() => {
    return Array.from({ length: HOUR_LABELS_AMOUNT }, (_, hourIndex) => {
      const label = `${hourIndex + 1} hr`;
      const tickIndex = (hourIndex + 1) * bigLineIndexOffset;
      return { label, tickIndex };
    });
  }, [bigLineIndexOffset]);

  useAnimatedReaction(
    () => selectedDuration.value,
    duration => {
      'worklet';
      const clampedDuration = Math.max(0, duration);
      const targetIndex = Math.min(
        linesAmount - 1,
        clampedDuration * bigLineIndexOffset,
      );
      const targetProgress = -distanceBetweenTwoTicks * targetIndex;
      if (Math.abs(progress.value - targetProgress) < 0.01) {
        return;
      }

      cancelAnimation(progress);
      progress.value = targetProgress;
    },
    [bigLineIndexOffset, distanceBetweenTwoTicks, linesAmount],
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
          {lineIndices.map(index => {
            const isBigLine = index % bigLineIndexOffset === 0;
            const midpointOffset = bigLineIndexOffset / 2;
            const isMediumLine =
              !isBigLine && index % bigLineIndexOffset === midpointOffset;
            let height: number;
            let color: string;

            if (isBigLine) {
              height = maxLineHeight;
              color = '#c6c6c6';
            } else if (isMediumLine) {
              height = mediumLineHeight;
              color = '#c6c6c6';
            } else {
              height = minLineHeight;
              color = '#c6c6c6';
            }

            return (
              <LineTime
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

          {hourLabels.map(({ label, tickIndex }) => {
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
        </Animated.View>
        <LinearGradient
          colors={['#000000', '#000000', '#000000', '#000000f9', '#000000b2', 'transparent']}
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
            borderRadius: 1000,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <LinearGradient
            colors={['transparent', '#000000', '#000000', '#000000', 'transparent']}
            start={{
              x: 0,
              y: 0
            }}
            end={{
              x: 0,
              y: 1.1
            }}
            style={{
              height: LABEL_HEIGHT,
              width: LABEL_WIDTH,
              borderRadius: 1000,
              zIndex: 1,
              left: 4,
              top: -3
            }}
          />
        </LinearGradient>
      </View>
    </View>
  );
};

type HourLabelProps = {
  label: string;
  progressRadiants: SharedValue<number>;
  linesAmount: number;
  tickIndex: number;
  radius: number;
};

const LABEL_WIDTH = 60;
const LABEL_HEIGHT = 30;
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
    // backgroundColor: 'red',
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
