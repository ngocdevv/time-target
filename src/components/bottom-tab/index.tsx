import { MaterialCommunityIcons } from "@expo/vector-icons"
import { usePathname, useRouter } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface TabItem {
    name: string
    label: string
    iconName: string
    route: string
}

export const BottomTab = () => {
    const router = useRouter()
    const pathname = usePathname()

    const tabs: TabItem[] = [
        {
            name: "home",
            label: "Home",
            iconName: "home",
            route: "/",
        },
        {
            name: "payments",
            label: "Payments",
            iconName: "credit-card",
            route: "/payments",
        },
        {
            name: "project",
            label: "+ Project",
            iconName: "plus",
            route: "/project",
        },
        {
            name: "messages",
            label: "Messages",
            iconName: "message-circle",
            route: "/messages",
        },
        {
            name: "team",
            label: "Team",
            iconName: "account-multiple",
            route: "/team",
        },
    ]

    const handleTabPress = (route: string) => {
        router.push(route)
    }

    const isActive = (route: string) => {
        return pathname === route
    }

    const {bottom} = useSafeAreaInsets()

    return (
        <View style={[styles.container, {paddingBottom: bottom}]}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={tab.name}
                    style={[
                        styles.tabItem,
                        index === 2 && styles.centerTab,
                    ]}
                    onPress={() => handleTabPress(tab.route)}
                    activeOpacity={0.7}
                >
                    {tab.name === "project" ? (
                        <View style={styles.projectButton}>
                            <Text style={styles.projectButtonText}>
                                {tab.label}
                            </Text>
                        </View>
                    ) : (
                        <View
                            style={[
                                styles.tabContent,
                                isActive(tab.route) &&
                                    styles.tabContentActive,
                            ]}
                        >
                            <MaterialCommunityIcons
                                name={tab.iconName as any}
                                size={20}
                                color={
                                    isActive(tab.route)
                                        ? "#FFFFFF"
                                        : "#9CA3AF"
                                }
                            />
                            <Text
                                style={[
                                    styles.tabLabel,
                                    isActive(tab.route) &&
                                        styles.tabLabelActive,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#0C0F0E",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#374151",
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    centerTab: {
        marginHorizontal: 8,
    },
    tabContent: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
    },
    tabContentActive: {
        opacity: 1,
    },
    tabLabel: {
        fontSize: 11,
        color: "#9CA3AF",
        marginTop: 4,
        fontWeight: "500",
    },
    tabLabelActive: {
        color: "#FFFFFF",
    },
    projectButton: {
        backgroundColor: "#424446",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    projectButtonText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "600",
    },
})