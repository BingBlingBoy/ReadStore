import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScannedDataCard from '../components/ScannedDataCard';
import ScannerOverlay from '../components/ScannerOverlay';
import { CameraIcon, ScanBarcode } from '../helper/Icon';

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string>('');
  const insets = useSafeAreaInsets();
  
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to scan QR codes and barcodes.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ]
      );
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string; }) => {
    if (!scanned) {
      setScanned(true);
      setScanning(false);
      setScannedData(data);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScanning(true);
    setScannedData('');
  };

  const handleCloseCard = () => {
    setScannedData('');
    setScanned(false);
    setScanning(true);
  };
  
  if (permission === null) {
    return (
      <View className='flex items-center justify-center gap-6 bg-background flex-1'>
        <Text className='text-xl text-secondaryText'>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className='w-full flex items-center bg-background justify-center p-8 flex-1 gap-y-4'>
        <CameraIcon className='w-32 h-32 text-red-500'/>
        <Text className='text-3xl font-bold text-center text-title'>Camera Access Denied</Text>
        <Text className='text-xl text-secondaryText text-center'>
          Please enable camera permissions in your device settings to use the scanner.
        </Text>
        <TouchableOpacity className='flex flex-row items-center bg-primary px-6 py-4 rounded-md' onPress={handleRequestPermission}>
          <Text className='text-xl text-primaryText font-semibold'>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='bg-background flex-1'>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <CameraView
        onBarcodeScanned={(scanned || (Platform.OS === 'web' && !isCameraReady)) ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8', 'upc_a', 'upc_e']
        }}
        onCameraReady={() => setIsCameraReady(true)}
        style={StyleSheet.absoluteFill}
      />
      <ScannerOverlay scanning={scanning && !scanned} />

      {!scanned && (
        <View style={{ paddingTop: insets.top + 10 }} className='pb-5 px-5 bg-background'>
          <View className='flex flex-row items-center gap-4'>
            <View className='w-14 h-14 rounded-2xl flex justify-center items-center opacity-90 bg-surface'>
              <ScanBarcode className='w-16 h-16 text-primary'/>
            </View>
            <View>
              <Text className='text-2xl font-semibold text-primaryText'>QR & Barcode Scanner</Text>
              <Text className='text-sm mt-4 text-secondaryText'>
                {scanning ? 'Position code within frame' : 'Scan complete'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {scanned && scannedData && (
        <ScannedDataCard
          data={scannedData}
          onClose={handleCloseCard}
          onScanAgain={handleScanAgain}
        />
      )}
    </View>
  );
}
