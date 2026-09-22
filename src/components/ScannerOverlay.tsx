import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface ScannerOverlayProps {
  scanning: boolean;
}

export default function ScannerOverlay({
  scanning
}: ScannerOverlayProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scanning) {
      // Loops and sequence goes up and down
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [scanning, animatedValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  return (
    <View className='absolute top-0 bottom-0 left-0 right-0'>
      <View className='flex-1 bg-scannerOverlay'/>
      <View className='flex-row h-[250px]'>
        <View className='flex-1' />
        <View className='w-[250px] h-[250px] relative'>
          <View className='
            absolute top-0 left-0
            w-8 h-8
            border-t-4 border-l-4 border-scannerCorner
          '
          />
          <View className='
            absolute top-0 right-0
            w-8 h-8
            border-t-4 border-r-4 border-scannerCorner
          '
          />
          {scanning && (
            <Animated.View
              className='
                absolute left-0 right-0
                h-2 bg-scannerFrame opacity-20
              '
              style={[
                {
                  transform: [{ translateY }],
                },
              ]}
            />
          )}
          <View className='
            absolute bottom-0 left-0
            w-8 h-8
            border-b-4 border-l-4 border-scannerCorner
          '
          />
          <View className='
            absolute bottom-0 right-0
            w-8 h-8
            border-b-4 border-r-4 border-scannerCorner
          '
          />
        </View>
        <View className='flex-1'/>
      </View>
      <View className='flex-1 bg-scannerOverlay' />
    </View>
  );
};