declare module 'react-native-maps' {
  import { ViewProps } from 'react-native';
  interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }
  interface Coordinate {
    latitude: number;
    longitude: number;
  }
  interface MapViewProps extends ViewProps {
    initialRegion?: Region;
    region?: Region;
    showsUserLocation?: boolean;
    followsUserLocation?: boolean;
    provider?: any;
    style?: any;
    children?: React.ReactNode;
    onRegionChangeComplete?: (region: Region) => void;
  }
  interface MarkerProps {
    coordinate: Coordinate;
    title?: string;
    description?: string;
    pinColor?: string;
    children?: React.ReactNode;
  }
  interface PolylineProps {
    coordinates: Coordinate[];
    strokeWidth?: number;
    strokeColor?: string;
    lineDashPattern?: number[];
  }
  export const PROVIDER_DEFAULT: string;
  export class MapView extends React.Component<MapViewProps> {}
  export class Marker extends React.Component<MarkerProps> {}
  export class Polyline extends React.Component<PolylineProps> {}
  export default MapView;
}
