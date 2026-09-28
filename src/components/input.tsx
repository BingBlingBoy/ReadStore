import { clsx, type ClassValue } from 'clsx';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface FormInputProps
    extends TextInputProps{
            fieldStyle?: string;
            textInputStyle?: string;
            children?: React.ReactNode;
            fieldText: string;
            viewStyle?: string;
        }

export default function Input({fieldStyle, fieldText, textInputStyle, viewStyle, children, ...props}: FormInputProps) {
    return (
          <View className={cn('w-full flex flex-row items-center', viewStyle)}>
            <Text className={fieldStyle}>{fieldText}:</Text>
            <TextInput
              placeholder={fieldText}
              className={cn(textInputStyle, 'flex-1')}
              {...props}
            />
          </View>
    )
}

{/* <View className='w-full flex flex-row items-center px-8 gap-x-4'>
<Text className='text-primaryText text-2xl'>Title:</Text>
<TextInput
    placeholder='Title'
    className='text-primaryText bg-primary flex-1 rounded-md'
    onChangeText={(text) => {updateForm('title', text)}}
    // multiline={true}
    // numberOfLines={10}
    // textAlignVertical='top'
    // remember h-20
/>
</View> */}