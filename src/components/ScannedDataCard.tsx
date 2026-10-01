import { useToast } from '@/context/ToastProvider';
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
  NumberOfPages: number;
  PublishDate: string;
  Publisher: string;
  Review: string;
  Title: string;
}

const initialFormState = {
  title: "",
  author: "",
  isbn: "",
  numberofpages: 0,
  publisher: "",
  publishdate: "",
  review: ""
};

interface FormResponse {
  Success: boolean;
}

export default function ScannedDataCard(
  {
  data,
  onClose,
  onScanAgain
  }
: ScannedDataCardProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [modal, setModal] = useState(false)
  
  const {showToast} = useToast()

  function updateForm(field: string, value: string) {
    setFormData((prev) => ({...prev, [field.toLowerCase()]: value}))
    if (errors[field]) {
      setErrors((prev) => {
        const copy = {...prev};
        delete copy[field];
        return copy;
      })
    }
  }
  
  function validateForm(): Record<string, string> {
    const newErrors: Record<string, string> = {};
    
    for (const [k, v] of Object.entries(formData)) {
      if (k === 'Review') {
        continue;
      }

      if (!v || (typeof v === 'string' && !v.trim())) {
        newErrors[k] = `${k} is blank`;
        showToast(`${k} is blank`, 'error')
      }
    }
    
    if (formData.numberofpages < 0) {
      newErrors['numberofpages'] = 'Number of pages is less than 0'
      showToast('Number of pages is less than 0', 'error')
    }

    if (parseInt(formData.isbn) > 17) {
      newErrors['isbn'] = 'isbn cannot be more than 17'
      showToast('ISBN cannot be more than 17', 'error')
    }
    
    return newErrors
  }
  
  async function handleFormSubmit() {
    const book: Book = {
      Title: formData.title as Book["Title"],
      Author: formData.author as Book["Author"],
      ISBN: formData.isbn as Book["ISBN"],
      NumberOfPages: formData.numberofpages as Book["NumberOfPages"],
      Publisher: formData.publisher as Book["Publisher"],
      PublishDate: formData.publishdate as Book["PublishDate"],
      Review: formData.review as Book["Review"]
    }
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      const res: FormResponse = await api.saveBook(book, formData.isbn)
      if (res.Success) {
        showToast("Success", "success")
      }
    } catch (err) {
      showToast("Internal server error", "error")
      setModal(true)
    } finally {
      setModal(true)
    }
  }
  
  async function handleOpenModal(isbn?: string) {
    if (!isbn) {
      setModal(true)
    } else {
      try {
        const res: Book = await api.getOpenBook(isbn)
        if (!res) {
          throw new Error('Book not found')
        }
        for (const [key, val] of Object.entries(res)) {
          updateForm(key, val)
        }
        setModal(true)
      } catch (err) {
        showToast('Could not GET book information. Insert manually', 'error')
        setModal(false)
      }
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

  const titleError = !!errors.title;
  const authorError = !!errors.author;
  const isbnError = !!errors.isbn;
  const numberOfPagesError = !!errors.numberofpages
  const publisherError = !!errors.publisher
  const publisherDateError = !!errors.publisherDate

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
        
        <View className='flex flex-row justify-start items-center gap-x-4'>
          <Button variant='secondary' size='md' onPress={() => {
            handleOpenModal(data)
          }}>
            <Text className='text-primaryText'>Send</Text>
          </Button>
          <Button variant='secondary' size='md' onPress={() => {
            handleOpenModal()
          }}>
            <Text className='text-primaryText'>Manual Entry</Text>
          </Button>
        </View>

      </ScrollView>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false)
        }}
        className='z-10'
      >
        <View className='flex items-center flex-col bg-surface w-full min-h-screen'>
          <View className='m-2 mb-10 p-4 flex flex-row justify-between items-center w-full'>
            <Text className='text-2xl font-bold text-primaryText'>Current Book</Text>
            <Button
              variant='free'
              size='sm'
              onPress={() => {
                setModal(false)
                setFormData(initialFormState)
                setErrors({})
              }}
            >
              <X className='text-secondaryText w-12 h-12'/>
            </Button>
          </View>
          <View className='w-full flex flex-col gap-y-4 px-4'>
            <Input
              viewStyle='gap-x-4'
              fieldText='Title'
              value={formData.title}
              fieldStyle={`text-2xl ${titleError ? 'text-red-400' : 'text-primaryText'} font-semibold`}
              textInputStyle={`rounded-md ${titleError ? 'bg-red-400' : 'bg-primary'}`}
              onChangeText={(text) => {updateForm('title', text)}}
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              value={formData.author}
              fieldText='Author'
              fieldStyle={`text-2xl ${authorError ? 'text-red-400' : 'text-primaryText'} font-semibold`}
              textInputStyle={`rounded-md ${authorError ? 'bg-red-400' : 'bg-primary'}`}
              onChangeText={(text) => {updateForm('author', text)}}
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              value={formData.isbn}
              fieldText='ISBN'
              fieldStyle={`text-2xl ${isbnError ? 'text-red-400' : 'text-primaryText'} font-semibold`}
              textInputStyle={`rounded-md ${isbnError ? 'bg-red-400' : 'bg-primary'}`}
              onChangeText={(text) => {updateForm('isbn', text)}}
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              value={String(formData.numberofpages)}
              fieldText='Number Of Pages'
              fieldStyle={`text-2xl ${numberOfPagesError ? 'text-red-400' : 'text-primaryText'} font-semibold`}
              textInputStyle={`rounded-md ${numberOfPagesError ? 'bg-red-400' : 'bg-primary'}`}
              onChangeText={(text) => {updateForm('noOfPages', text)}}
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              value={formData.publisher}
              fieldText='Publisher'
              fieldStyle={`text-2xl ${publisherError ? 'text-red-400' : 'text-primaryText'} font-semibold`}
              textInputStyle={`rounded-md ${publisherError ? 'bg-red-400' : 'bg-primary'}`}
              onChangeText={(text) => {updateForm('publisher', text)}}
            >
            </Input>
            <Input
              viewStyle='gap-x-4'
              value={formData.publishdate}
              fieldText='Publisher Date'
              fieldStyle={`text-2xl ${publisherDateError ? 'text-red-400' : 'text-primaryText'} font-semibold`}
              textInputStyle={`rounded-md ${publisherDateError ? 'bg-red-400' : 'bg-primary'}`}
              onChangeText={(text) => {updateForm('publisherDate', text)}}
            >
            </Input>
            
            <View className='flex flex-col gap-y-4'>
              <Text className='text-2xl text-primaryText font-semibold'>Review:</Text>
              <Input
                onChangeText={(text) => {updateForm('review', text)}}
                textInputStyle='rounded-md bg-primary h-40'
                multiline={true}
                numberOfLines={10}
                textAlignVertical='top'
              >
              </Input>
            </View>
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
