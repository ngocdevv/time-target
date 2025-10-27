import { FontAwesome } from '@expo/vector-icons';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';

/**
 * Props for the TimeRange component
 * @property {(durationHours: number) => void} onDurationChange - Callback triggered when the selected duration changes
 */
type TimeRangeProps = {
    onDurationChange?: (durationHours: number) => void;
};

const SCALE_FACTOR = 2.5;
const ITEM_HEIGHT = 36 * SCALE_FACTOR; // Height of each time item in pixels
const TimeRangeHeight = ITEM_HEIGHT; // Visible area shows a single time option
const ArrowWrapperHeight = 24 * SCALE_FACTOR;
const ArrowIconSize = 10 * SCALE_FACTOR;
const LabelFontSize = 28 * SCALE_FACTOR;
const ListWidth = 100 * SCALE_FACTOR;
const ContainerHeight = TimeRangeHeight + ArrowWrapperHeight * 2; // Extra space for arrow indicators
const DurationOptions = Array.from({ length: 10 }, (_, index) => index + 1);
const DurationSnapOffsets = DurationOptions.map((_, index) => index * ITEM_HEIGHT);
const DurationLabels = DurationOptions.map(hours => `${hours} hr`);

export const TimeRange: React.FC<TimeRangeProps> = ({
    onDurationChange,
}) => {
    /**
     * Renders individual time items in the list
     * @param {Object} param0 - Item data and index
     * @returns {JSX.Element} Rendered time item
     */
    const renderItem = useCallback(
        ({ item, index }: { item: string; index: number }) => (
            <View key={index} style={styles.timeItem}>
                <Text style={styles.timeText}>{item}</Text>
            </View>
        ),
        [],
    );

    /**
     * Handles scroll events and interpolates the selected time
     * Uses Reanimated worklet for smooth performance
     */
    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            const { contentOffset } = event;
            const interpolatedDuration = interpolate(
                contentOffset.y,
                DurationSnapOffsets,
                DurationOptions,
            );
            const clampedDuration = Math.min(
                DurationOptions[DurationOptions.length - 1],
                Math.max(DurationOptions[0], Math.round(interpolatedDuration)),
            );
            onDurationChange?.(clampedDuration);
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.arrowWrapper}>
                <FontAwesome name="chevron-up" size={ArrowIconSize} color="#ffffff" />
            </View>
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
        right: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
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
