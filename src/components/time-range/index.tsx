import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';


type TimeRangeProps = {
    onDurationChange?: (durationHours: number) => void;
};

const SCALE_FACTOR = 2.5;
const ITEM_HEIGHT = 36 * SCALE_FACTOR;
const TimeRangeHeight = ITEM_HEIGHT;
const ArrowWrapperHeight = 24 * SCALE_FACTOR;
const ArrowIconSize = 10 * SCALE_FACTOR;
const LabelFontSize = 28 * SCALE_FACTOR;
const ListWidth = 100 * SCALE_FACTOR;
const ContainerHeight = TimeRangeHeight + ArrowWrapperHeight * 2;
const DurationOptions = Array.from({ length: 10 }, (_, index) => index + 1);
const DurationSnapOffsets = DurationOptions.map((_, index) => index * ITEM_HEIGHT);
const DurationLabels = DurationOptions.map(hours => `${hours} hr`);

export const TimeRange: React.FC<TimeRangeProps> = ({
    onDurationChange,
}) => {
    const renderItem = useCallback(
        ({ item, index }: { item: string; index: number }) => (
            <View key={index} style={styles.timeItem}>
                <Text style={styles.timeText}>{item}</Text>
            </View>
        ),
        [],
    );


    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            const { contentOffset } = event;
            // Interpolate to get smooth continuous values during scroll
            const interpolatedDuration = interpolate(
                contentOffset.y,
                DurationSnapOffsets,
                DurationOptions,
            );
            // Clamp to valid range but keep fractional values for smooth animation
            const clampedDuration = Math.min(
                DurationOptions[DurationOptions.length - 1],
                Math.max(DurationOptions[0], interpolatedDuration),
            );
            onDurationChange?.(clampedDuration);
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.arrowWrapper}>
                <FontAwesome name="chevron-up" size={ArrowIconSize} color="#ffffff" />
            </View>
            <View>
                <Animated.FlatList
                    onScroll={onScroll}
                    decelerationRate="fast"
                    snapToAlignment="center"
                    snapToOffsets={DurationSnapOffsets}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    data={DurationLabels}
                    renderItem={renderItem}
                    disableIntervalMomentum
                />
                <LinearGradient
                    colors={['#000000', 'transparent']}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 40,
                        right: 0,
                        height: 16,
                    }}
                />
                <LinearGradient
                    colors={['transparent', '#000000']}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 40,
                        right: 0,
                        height: 16,
                    }}
                />

            </View>
            <View style={styles.arrowWrapper}>
                <FontAwesome name="chevron-down" size={ArrowIconSize} color="#ffffff" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: ContainerHeight,
        position: "absolute",
        width: ListWidth - 30,
        right: 0,
        justifyContent: 'space-between',
    },
    arrowWrapper: {
        alignItems: 'center',
        height: ArrowWrapperHeight,
        justifyContent: 'center',
    },
    list: {
        width: ListWidth,
        flexGrow: 0,
        height: TimeRangeHeight,
    },
    scrollViewContent: {
        paddingVertical: TimeRangeHeight / 2 - ITEM_HEIGHT / 2,
    },
    timeItem: {
        alignItems: 'center',
        height: ITEM_HEIGHT,
        justifyContent: 'center',
    },
    timeText: {
        color: '#d8d8d8',
        fontSize: LabelFontSize,
        fontFamily: 'SF-Pro-Rounded-Bold',
    },
});
