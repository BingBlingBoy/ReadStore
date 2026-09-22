import { Camera as CameraIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(CameraIcon, {
    className: {
        target: 'style',
        nativeStyleToProp: {
            color: true,
            width: true,
            height: true,
        },
    },
})

export { CameraIcon };
