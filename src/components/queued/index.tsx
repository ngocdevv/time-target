import { Text, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"



export const Queued = () => {
    return (
        <>
            <Animated.View entering={FadeInUp.duration(300)} style={{
                backgroundColor: "#00655C",
                height: 60,
                borderRadius: 24,
                marginHorizontal: 16,
                marginTop: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <View>
                    <Text style={{
                        color: "#fff",
                        fontSize: 14,
                        fontFamily: 'SF-Pro-Rounded-Bold',
                    }}>
                        Landing page 1
                    </Text>
                    <Text style={{
                        color: "#fff",
                        fontSize: 12,
                        marginTop: 4
                    }}>
                        For Chris
                    </Text>
                </View>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: 40,
                    paddingVertical: 4,
                    paddingHorizontal: 12,
                    columnGap: 4
                }}>
                    <View style={{
                        width: 7,
                        height: 7,
                        borderRadius: 7,
                        backgroundColor: "#FFDA50",
                    }} />
                    <Text style={{
                        color: "#000",
                        fontSize: 14,
                        marginLeft: 4,
                        fontWeight: "500"
                    }}>Queued</Text>
                </View>
            </Animated.View>
            <Animated.Text entering={FadeInUp.duration(500)} style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: 'SF-Pro-Rounded-Bold',
                marginHorizontal: 16,
                marginTop: 12,
                textAlign: "center"
            }}>
                Adjust project time target
            </Animated.Text>
        </>
    )
}