import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";



export const Header = () => {
    const { top } = useSafeAreaInsets()
    return <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: top,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#374151",
    }}>
        <Text style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: 'SF-Pro-Rounded-Bold',
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 18,
            textAlign: "center"
        }}>Landing page 1</Text>
        <View style={{
            alignItems: "center",
            flexDirection: "row",
            columnGap: 6
        }}>
            <Image source={require("../../../assets/images/avatar.jpg")} style={{
                width: 32,
                height: 32,
                borderRadius: 20,
            }} />
            <FontAwesome name="chevron-down" size={14} color="#424446" />

        </View>
        <View style={{
            width: 32,
            height: 32,
            borderRadius: 12,
            backgroundColor: "#42444670",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <FontAwesome name="bell" size={14} color="#63666aff" />
        </View>

    </View>;
};
