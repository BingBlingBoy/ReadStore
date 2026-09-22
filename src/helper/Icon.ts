import { Camera as CameraIcon, ScanBarcode, X } from 'lucide-react-native';
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

cssInterop(ScanBarcode, {
    className: {
        target: 'style',
        nativeStyleToProp: {
            color: true,
            width: true,
            height: true
        }
    }
})

cssInterop(X, {
    className: {
        target: 'style',
        nativeStyleToProp: {
            color: true,
            width: true,
            height: true
        }
    }
})

export { CameraIcon, ScanBarcode, X };

