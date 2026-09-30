import { Check, CircleAlert, CircleX, InfoIcon } from "lucide-react-native";
import React, { memo, useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ToastProps {
    message?: string;
    type: 'success' | 'warning' | 'error' | 'info';
    onClose: () => void;
    duration: number;
    index: number;
}

export const Toast: React.FC<ToastProps> = memo(({ message, type, onClose, duration, index }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const notchHeight: number = useSafeAreaInsets().top;

    useEffect(() => {
        if (!message) return;
        Animated.timing(translateY, {
            toValue: 50,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        }).start();

        const timer = setTimeout(() => {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start(() => onClose());
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, message]);

    const getBarColor = (): string => {
        switch (type) {
            case "success": return "#009990";
            case "warning": return "#FFEB00";
            case "error": return "#F72C5B";
            case "info": return "#000957";
        }
    };

    const getBackgroundColor = (): string => {
        switch (type) {
            case "success": return "#5DB996";
            case "warning": return "#FFF2AF";
            case "error": return "#FF748B";
            case "info": return "#074799";
        }
    };

    const getMessageColor = (): string => {
        switch (type) {
            case "success": return "#FFFFFF";
            case "warning": return "#000000";
            case "error": return "#FFFFFF";
            case "info": return "#FFFFFF";
        }
    };

    const getIcon = (): React.ReactElement => {
        const iconColor = getMessageColor(); 
        const iconSize = 22;

        switch (type) {
            case "success": return <Check color={iconColor} size={iconSize} />;
            case "warning": return <CircleAlert color={iconColor} size={iconSize} />;
            case "error": return <CircleX color={iconColor} size={iconSize} />;
            case "info": return <InfoIcon color={iconColor} size={iconSize} />;
        }
    };

    return (
        <Animated.View style={[styles.container, {
            transform: [{
                translateY: translateY.interpolate({
                    inputRange: [0, 50],
                    outputRange: [-50, notchHeight + (55 * index)]
                })
            }]
        }]}
        >
            <View style={styles.contentRow}>
                <View style={[styles.bar, { backgroundColor: getBarColor() }]} />
                <View style={[styles.iconContainer, { backgroundColor: getBackgroundColor() }]}>
                    {getIcon()}
                </View>

                <View style={[styles.textContainer, { backgroundColor: getBackgroundColor() }]}>
                    <Text style={[styles.text, { color: getMessageColor() }]}>
                        {message}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("screen").width - 10, // slightly padded from screen edges
        height: 50,
        backgroundColor: "transparent",
        position: "absolute",
        left: 5,
        borderRadius: 5,
        overflow: 'hidden',
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    contentRow: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        borderRadius: 5,
    },
    bar: {
        width: "2%",
        height: "100%",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    iconContainer: {
        width: 50,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
        height: "100%",
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        justifyContent: "center",
        paddingRight: 10,
    },
    text: {
        marginLeft: 10,
        fontFamily: 'calibri',
        fontSize: 15,
        fontWeight: '400',
    }
});