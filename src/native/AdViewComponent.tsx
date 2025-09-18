import { requireNativeComponent } from 'react-native';
import type { AdViewProps } from '../types/Types';

export const AdViewComponent = requireNativeComponent<AdViewProps>('AdView');