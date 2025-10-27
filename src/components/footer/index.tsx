import { StyleSheet, Text, TouchableOpacity, View } from "react-native"



export const Footer = () => {
    return (
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
    )
}


const styles = StyleSheet.create({
    buttonsWrapper: {
        paddingHorizontal: 20,
        paddingBottom: 8,
        gap: 10,
    },
    confirmButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
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
        borderWidth: 2,
        borderColor: '#333333',
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
})