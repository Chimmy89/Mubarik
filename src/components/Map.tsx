// Native map: re-export react-native-maps. Web uses Map.web.tsx instead
// (react-native-maps has no web implementation).
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

export { MapView, Marker, PROVIDER_DEFAULT };
export default MapView;
