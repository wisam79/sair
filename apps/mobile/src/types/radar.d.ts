declare module 'react-native-radar' {
  export interface RadarLocation {
    latitude: number;
    longitude: number;
    accuracy: number;
  }
  export interface RadarResult {
    location?: RadarLocation;
  }
  const Radar: {
    initialize(publishableKey: string): void;
    setUserId(userId: string): void;
    setMetadata(metadata: Record<string, string>): void;
    startTrackingContinuous(): void;
    stopTracking(): void;
    onLocationUpdated(callback: ((result: RadarResult) => void) | null): void;
  };
  export default Radar;
}
