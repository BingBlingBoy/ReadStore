import { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ScanBarcode, X } from '../helper/Icon';

interface ScannedDataCardProps {
  data: string;
  type: string;
  onClose: () => void;
  onScanAgain: () => void;
}

export default function ScannedDataCard(
  {
  data,
  type,
  onClose,
  onScanAgain
  }
: ScannedDataCardProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parallel starts animations at the same time
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  // const isUrl = (text: string) => {
  //   try {
  //     const url = new URL(text);
  //     return url.protocol === 'http:' || url.protocol === 'https:';
  //   } catch {
  //     return false;
  //   }
  // };

  // const isEmail = (text: string) => {
  //   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  // };

  // const isPhone = (text: string) => {
  //   return /^[\d\s\-\+\(\)]+$/.test(text) && text.replace(/\D/g, '').length >= 10;
  // };

  return (
    <Animated.View
      className='
        absolute bottom-1 left-0 right-0
        bg-surface max-h-[70%] 
        shadow-black/30 rounded-t-3xl elevation-[10]
        m-4
      '
      style={[
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View className='flex flex-row items-center p-5 border-b-[1px] border-border'>
        <View 
          className='
            w-14 h-14 rounded-2xl
            flex items-center justify-center
            mr-4 bg-surfaceLight
          '
        >
          <ScanBarcode className='w-16 h-16 text-primary'/>
        </View>
        <View className='flex-1'>
          <Text className='text-secondaryText mb-1 text-md font-bold'>{type.toUpperCase()}</Text>
          <Text className='text-xl font-semibold text-primaryText'>Scanned Successfully</Text>
        </View>
        <TouchableOpacity onPress={onClose} className='p-2'>
          <X className='text-secondaryText w-12 h-12'/>
        </TouchableOpacity>
      </View>

      <ScrollView className='p-5' showsVerticalScrollIndicator={false}>
        <View className='pb-6'>
          <Text className='text-secondaryText mb-3 font-semibold text-md'>Data:</Text>
          <View className='bg-surfaceLight rounded-xl p-5 border-border'>
            <Text className='text-xl color-primaryText leading-6' selectable>
              {data}
            </Text>
          </View>
        </View>

        {/* <View style={styles.actionsContainer}>
          {isUrl(data) && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Open URL</Text>
            </TouchableOpacity>
          )}
          {isEmail(data) && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Send Email</Text>
            </TouchableOpacity>
          )}
          {isPhone(data) && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>

      <TouchableOpacity
        className='
          flex flex-row items-center justify-center
          bg-primary py-4 m-5 rounded-2xl gap-3
        '
        onPress={onScanAgain}
      >
        <Text className='text-xl font-bold color-primaryText'>Scan Again</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
