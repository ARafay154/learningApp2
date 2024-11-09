import React, { memo, useState } from 'react';
import { Image, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { COLOR } from '../../../enums/StyleGuide';


const Photo = ({ src, style, contain, url }) => {
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(false);    // Manage error state

  return (
    <View style={[styles.imageContainer, style]}>
      {loading && !error && (
        <ActivityIndicator 
          size="small" 
          color={COLOR.purple} 
          style={styles.loadingIndicator} 
        />
      )}
      {error ? (
        <Text style={styles.errorText}>Image failed to load</Text>
      ) : (
        <Image
          source={src ? src : { uri: url }}
          style={[styles.image, style]}
          resizeMode={contain ? 'contain' : 'cover'}
          onLoadStart={() => setLoading(true)}  // Show loading when starting
          onLoadEnd={() => setLoading(false)}   // Hide loading when finished
          onError={() => {
            setLoading(false); // Hide loading indicator
            setError(true);    // Set error state
          }}
        />
      )}
    </View>
  );
};

export default memo(Photo);

export const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    zIndex: 1, // Make sure the spinner is on top of the image
  },
  errorText: {
    color: 'red', // Style for the error message
  },
  });
