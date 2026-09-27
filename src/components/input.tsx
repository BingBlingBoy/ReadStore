import { cva, VariantProps } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { Text, TextInput, TextInputProps, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const formInputVariants = cva(
    'w-full flex flex-row items-center gap-x-4 px-8',
    {
        variants: {
            variant: {
                primary: 'text-primaryText',
                secondary: 'text-secondaryText',
                free: ''
            },
            size: {
                sm: "py-1.5 text-sm",
                md: "py-2.5 text-base",
                lg: "py-3 text-lg",
                xl: "py-4 text-2xl"
            },
        },
        defaultVariants: {
            variant: "primary"
        }
    }
)

export interface FormInputProps
    extends TextInputProps,
        VariantProps<typeof formInputVariants> {
            fieldStyle?: string;
            textInputStyle?: string;
            children?: React.ReactNode;
            fieldText: string;
        }

export default function Input({variant, size, fieldStyle, fieldText, textInputStyle, children, ...props}: FormInputProps) {
    return (
          <View className='w-full flex flex-row items-center gap-x-4 px-8'>
            <Text className={fieldStyle}>{fieldText}:</Text>
            <TextInput
              placeholder='Title'
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