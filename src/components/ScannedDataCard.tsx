import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface ScannedDataCardProps {
  data: string;
  type: string;
  onClose: () => void;
  onScanAgain: () => void;
}

export const ScannedDataCard: React.FC<ScannedDataCardProps> = ({
  data,
  type,
  onClose,
  onScanAgain,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  const getTypeIcon = (codeType: string) => {
    if (codeType.includes('qr')) return 'qr-code-scanner';
    return 'qr-code-2';
  };

  const getTypeColor = (codeType: string) => {
    if (codeType.includes('qr')) return Colors.secondary;
    return Colors.primary;
  };

  const isUrl = (text: string) => {
    try {
      const url = new URL(text);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isEmail = (text: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  };

  const isPhone = (text: string) => {
    return /^[\d\s\-\+\(\)]+$/.test(text) && text.replace(/\D/g, '').length >= 10;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.typeText}>{type.toUpperCase()}</Text>
          <Text style={styles.scannedText}>Scanned Successfully</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>Data:</Text>
          <View style={styles.dataBox}>
            <Text style={styles.dataText} selectable>
              {data}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
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
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAgain}>
        <Text style={styles.scanAgainText}>Scan Again</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  scannedText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  dataContainer: {
    marginBottom: 24,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  dataBox: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dataText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    margin: 20,
    borderRadius: 16,
    gap: 12,
  },
  scanAgainText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
});

