import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

const mascot = require('../../../assets/mascot.json');

interface MascotProps {
  size?: number;
}

export default function Mascot({ size = 240 }: MascotProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Explicitly kickstart the animation thread loop on mount
    const timer = setTimeout(() => {
      animationRef.current?.play();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LottieView
        ref={animationRef}
        source={mascot}
        autoPlay
        loop
        // Absolute fill ensures the canvas stretches over the parent red/transparent boundary box
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
});
