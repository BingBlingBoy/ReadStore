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
            case 'success': return '#10b981';
            case 'warning': return '#f59e0b';
            case 'error': return '#f43f5e';
            case 'info': return '#6366f1';
        }
    };

    const getBackgroundColor = (): string => {
        switch (type) {
            case 'success': return '#064e3b';
            case 'warning': return '#451a03';
            case 'error': return '#4c0519';
            case 'info': return '#1e293b';
        }
    };

    const getMessageColor = (): string => {
        switch (type) {
            case 'success': return '#6ee7b7';
            case 'warning': return '#fcd34d';
            case 'error': return '#fda4af';
            case 'info': return '#f1f5f9';
        }
    };

    const getIcon = (): React.ReactElement => {
        const iconColor = getMessageColor(); 
        const iconSize = 22;

        switch (type) {
            case 'success': return <Check color={iconColor} size={iconSize} />;
            case 'warning': return <CircleAlert color={iconColor} size={iconSize} />;
            case 'error': return <CircleX color={iconColor} size={iconSize} />;
            case 'info': return <InfoIcon color={iconColor} size={iconSize} />;
        }
    };

    return (
        <Animated.View
            style={[styles.container, {
                transform: [{
                    translateY: translateY.interpolate({
                        inputRange: [0, 50],
                        outputRange: [-50, notchHeight + (55 * index)]
                    })
                }]
            }]}
            className='
                h-14 bg-transparent absolute z-50 left-1
                rounded-md overflow-hidden elevation-md
                shadow-black/20
            '
        >
            <View className="w-full h-full flex flex-row rounded-md">
                <View style={{backgroundColor: getBarColor()}} className={`w-[2%] h-full rounded-t rounded-b`}/>
                <View style={{backgroundColor: getBackgroundColor()}} className={`w-12 h-full flex justify-center items-center`}>
                    {getIcon()}
                </View>
                    
                <View style={{backgroundColor: getBackgroundColor()}} className={`flex-1 h-full rounded-t rounded-b flex justify-center pr-10`}>
                    <Text style={{color: getMessageColor()}} className={`ml-2 text-lg font-normal`}>
                        {message}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width - 10,
        height: 50,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 5,
        borderRadius: 5,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    contentRow: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        borderRadius: 5,
    },
    bar: {
        width: '2%',
        height: '100%',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    iconContainer: {
        width: 50,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        height: '100%',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        justifyContent: 'center',
        paddingRight: 10,
    },
    text: {
        marginLeft: 10,
        fontFamily: 'calibri',
        fontSize: 15,
        fontWeight: '400',
    }
});