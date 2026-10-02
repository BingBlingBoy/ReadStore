import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface CustomModalProps {
    visible: boolean;
    onRequestClose: () => void;
    children: React.ReactNode;
}

export default function CustomModal({ visible, onRequestClose, children, ...props }: CustomModalProps) {
    if (!visible) return null;

    return (
        <View 
            style={StyleSheet.absoluteFill} 
            className="absolute inset-0 z-30 w-full h-full flex-1" 
            {...props}
        >
            <Pressable 
                onPress={onRequestClose} 
                className="absolute inset-0 bg-black/60" 
            />
            {children}
        </View>
    );
}