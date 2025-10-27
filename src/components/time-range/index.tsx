import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';


type TimeRangeProps = {
    selectedDuration: SharedValue<number>;
};

const SCALE_FACTOR = 2.5;
const ITEM_HEIGHT = 36 * SCALE_FACTOR;
const TimeRangeHeight = ITEM_HEIGHT;
const ArrowWrapperHeight = 24 * SCALE_FACTOR;
const ArrowIconSize = 10 * SCALE_FACTOR;
const LabelFontSize = 28 * SCALE_FACTOR;
const ListWidth = 100 * SCALE_FACTOR - 66;
const ContainerHeight = TimeRangeHeight + ArrowWrapperHeight * 2;
const DurationOptions = Array.from({ length: 10 }, (_, index) => index + 1);
const DurationSnapOffsets = DurationOptions.map((_, index) => index * ITEM_HEIGHT);
const DurationLabels = DurationOptions.map(hours => `${hours} hr`);

export const TimeRange: React.FC<TimeRangeProps> = ({
    selectedDuration,
}) => {
    const renderItem = useCallback(
        ({ item, index }: { item: string; index: number }) => (
            <View key={index} style={styles.timeItem}>
                <Text style={styles.timeText}>{item}</Text>
            </View>
        ),
        [],
    );

    const getItemLayout = useCallback(
        (_: unknown, index: number) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        }),
        [],
    );

    const initialScrollIndex = Math.max(
        0,
        DurationOptions.indexOf(Math.round(selectedDuration.value)),
    );

    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            'worklet';
            const { contentOffset } = event;
            const interpolatedDuration = interpolate(
                contentOffset.y,
                DurationSnapOffsets,
                DurationOptions,
            )
            const clampedDuration = Math.min(
                DurationOptions[DurationOptions.length - 1],
                Math.max(DurationOptions[0], interpolatedDuration),
            );
            if (Math.abs(selectedDuration.value - clampedDuration) > 0.01) {
                selectedDuration.value = clampedDuration;
            }
        },
    });

    return (
        <View style={styles.container}>
            <Pressable style={styles.arrowWrapper} onPress={() => {}} >
                <FontAwesome name="chevron-up" size={ArrowIconSize} color="#ffffff" />
            </Pressable>
            <View>
                <Animated.FlatList
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    snapToAlignment="center"
                    getItemLayout={getItemLayout}
                    initialScrollIndex={initialScrollIndex}
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
                        left: 0,
                        right: 0,
                        height: 16,
                    }}
                />
                <LinearGradient
                    colors={['transparent', '#000000']}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 16,
                    }}
                />

            </View>
            <Pressable style={styles.arrowWrapper}>
                <FontAwesome name="chevron-down" size={ArrowIconSize} color="#ffffff" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: ContainerHeight,
        position: "absolute",
        width: ListWidth,
        right: 0
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
