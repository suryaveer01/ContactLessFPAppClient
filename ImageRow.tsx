import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface ImageRowProps {
  images: string[];
}

const ImageRow: React.FC<ImageRowProps> = ({ images }) => {
  return (
    <View style={styles.container}>
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
  },
});

export default ImageRow;
