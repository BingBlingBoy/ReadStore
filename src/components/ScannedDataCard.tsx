import { api } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ScanBarcode, X } from '../helper/Icon';
import { Button } from './button';
import Input from './input';

interface ScannedDataCardProps {
  data: string;
  onClose: () => void;
  onScanAgain: () => void;
}

interface Book {
  Author: string;
  ISBN: string;
  NoOfPages: number;
  PublishDate: string;
  Publisher: string;
  Review: string;
  Title: string;
}

const initialFormState = {
  title: "",
  author: "",
  isbn: "",
  noOfPages: 0,
  publisher: "",
  publisherDate: ""
};

export default function ScannedDataCard(
  {
  data,
  onClose,
  onScanAgain
  }
: ScannedDataCardProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const [modalVisible, setModalVisible] = useState(false)
  const [formData, setFormData] = useState(initialFormState)

  function updateForm(field: string, value: string) {
    setFormData((prev) => ({...prev, [field]: value}))
  }
  
  function handleFormSubmit() {
    console.log("HELLo")
  }
  
  async function handleOpenModal(isbn: string) {
    try {
      const res: Book = await api.getBook(isbn)
      console.log("Book:", res)

    } catch (err) {
      console.error(err)
    } finally {
        setModalVisible(true)
    }
  }

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
  
  return (
    <Animated.View
      className='
        absolute bottom-10 left-0 right-0
        bg-surface max-h-[70%] 
        shadow-black/30 rounded-t-3xl elevation-[10]
        m-1
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
          <Text className='text-xl font-semibold text-primaryText'>Scanned Successfully</Text>
        </View>
        <TouchableOpacity onPress={onClose} className='p-2'>
          <X className='text-secondaryText w-12 h-12'/>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex flex-col p-5 gap-8' showsVerticalScrollIndicator={false}>
        <View className='pb-5'>
          <Text className='text-secondaryText mb-3 font-semibold text-md'>Data:</Text>
          <View className='bg-surfaceLight rounded-xl p-5 border-border'>
            <Text className='text-xl color-primaryText leading-6' selectable>
              {data}
            </Text>
          </View>
        </View>
        
        <View className='flex flex-row justify-start items-center'>
          <Button variant='secondary' size='md' onPress={() => {
            handleOpenModal(data)
          }}>
            <Text className='text-primaryText'>Send</Text>
          </Button>
        </View>

      </ScrollView>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View className='flex items-center flex-col bg-surface w-full min-h-screen'>
          <View className='m-2 mb-10 p-4 flex flex-row justify-between items-center w-full'>
            <Text className='text-2xl font-bold text-primaryText'>TESTING THE MODAL</Text>
            <Button
              variant='free'
              size='sm'
              onPress={() => {
                setModalVisible(!modalVisible)
                setFormData(initialFormState)
              }}
            >
              <X className='text-secondaryText w-12 h-12'/>
            </Button>
          </View>
          <View className='w-full flex flex-col gap-y-4 px-4'>
            <Input
              viewStyle='gap-x-4'
              fieldText='Title'
              fieldStyle='text-2xl text-primaryText font-semibold'
              onChangeText={(text) => {updateForm('title', text)}}
              textInputStyle='rounded-md bg-primary'
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              fieldText='Author'
              fieldStyle='text-2xl text-primaryText font-semibold'
              onChangeText={(text) => {updateForm('author', text)}}
              textInputStyle='rounded-md bg-primary'
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              fieldText='ISBN'
              fieldStyle='text-2xl text-primaryText font-semibold'
              onChangeText={(text) => {updateForm('isbn', text)}}
              textInputStyle='rounded-md bg-primary'
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              fieldText='Number Of Pages'
              fieldStyle='text-2xl text-primaryText font-semibold'
              onChangeText={(text) => {updateForm('noOfPages', text)}}
              textInputStyle='rounded-md bg-primary'
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              fieldText='Publisher'
              fieldStyle='text-2xl text-primaryText font-semibold'
              onChangeText={(text) => {updateForm('publisher', text)}}
              textInputStyle='rounded-md bg-primary'
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              fieldText='Publisher Date'
              fieldStyle='text-2xl text-primaryText font-semibold'
              onChangeText={(text) => {updateForm('publisherDate', text)}}
              textInputStyle='rounded-md bg-primary'
            >
            </Input>
          </View>
          <Button
            variant='primary'
            size='lg'
            className='justify-center mb-10 mt-auto'
            onPress={handleFormSubmit}
          >
            <Text className='text-xl font-bold color-primaryText'>Send</Text>
          </Button>
        </View>
      </Modal>

      <Button 
        variant='primary'
        size='lg'
        onPress={onScanAgain}
        className='justify-center m-5'
      >
        <Text className='text-xl font-bold color-primaryText'>Scan Again</Text>
      </Button>

    </Animated.View>
  );
};
