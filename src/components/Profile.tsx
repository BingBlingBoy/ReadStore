import { useToast } from '@/context/ToastProvider';
import { Button, View } from 'react-native';

export default function ProfileScreen() {
  const { showToast } = useToast();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        title="Save Profile" 
        onPress={() => {
          // Trigger your global toast!
          showToast('Profile updated successfully!', 'success');
        }} 
      />
    </View>
  );
}