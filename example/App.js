import React from 'react';
import { StyleSheet, View } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import SeeMore from 'react-native-see-more-inline';

const App = () => (
  <View style={styles.contentContainerStyle}>
    <SeeMore>asdf</SeeMore>
  </View>
);

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default App;
