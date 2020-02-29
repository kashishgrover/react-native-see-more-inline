import React from 'react';
import {
  StyleSheet, View, SafeAreaView, Text,
} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import SeeMore from 'react-native-see-more-inline';

const LOREM_IPSUM_LARGE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pellentesque aliquam leo nec venenatis. Vivamus rutrum aliquet ultrices. In vel turpis quis velit consectetur consequat. Nulla sit amet elit arcu. Duis at mauris lorem. Vivamus id neque ut lacus pharetra elementum a consectetur ex. Curabitur scelerisque sit amet metus ut aliquet. Fusce id odio vitae elit cursus interdum ut at dolor. In finibus, nunc et tempor sodales, erat orci sodales arcu, vel sodales dui tortor id felis. Proin luctus placerat tortor, in mollis eros ultricies ac. Aliquam cursus dolor nec vehicula convallis. Vestibulum sit amet felis laoreet, dignissim dolor in, tristique leo. Vestibulum fermentum maximus libero.';

const LOREM_IPSUM_MEDIUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pellentesque aliquam leo nec venenatis. Vivamus rutrum aliquet ultrices. In vel turpis quis velit consectetur consequat.';

const LOREM_IPSUM_SMALL = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pellentesque aliquam leo nec venenatis.';

const Header = () => <View style={styles.header} />;

const App = () => (
  <SafeAreaView style={styles.root}>
    <Header />
    <View style={styles.container}>
      <>
        <Text style={styles.title}>Lorem Ipsum Large</Text>
        <SeeMore fontWeight="normal" fontSize={12} offset={32} numberOfLines={4}>
          {LOREM_IPSUM_LARGE}
        </SeeMore>
      </>
      <>
        <Text style={styles.title}>Lorem Ipsum Medium</Text>
        <SeeMore fontWeight="normal" fontSize={12} offset={32} numberOfLines={2}>
          {LOREM_IPSUM_MEDIUM}
        </SeeMore>
      </>
      <>
        <Text style={styles.title}>Lorem Ipsum Small</Text>
        <SeeMore fontWeight="normal" fontSize={12} offset={32} numberOfLines={2}>
          {LOREM_IPSUM_SMALL}
        </SeeMore>
      </>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    height: 48,
    borderWidth: 1,
  },
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
});

export default App;
