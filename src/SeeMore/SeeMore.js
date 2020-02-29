import React from 'react';
import {
  Text, PanResponder, Dimensions, View, StyleSheet,
} from 'react-native';
import reactNativeTextSize from 'react-native-text-size';
import PropTypes from 'prop-types';

class SeeMore extends React.Component {
  readMorePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderGrant: () => this.handleLinkPressed(),
    onPanResponderTerminate: () => this.handleLinkTerminated(),
    onPanResponderRelease: () => this.handleLinkReleased(),
  });

  constructor(props) {
    super(props);

    this.state = {
      isLinkPressed: false,
      isShowingMore: false,
      totalTextWidth: 0,
      textWidthLimit: 0,
    };
  }

  componentDidMount() {
    this.calculateTotalTextWidth();
    this.calculateTextWidthLimit();
    Dimensions.addEventListener('change', this.calculateTextWidthLimit);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.calculateTextWidthLimit);
  }

  calculateTotalTextWidth = async () => {
    const {
      children, fontSize, fontFamily, fontWeight,
    } = this.props;
    const size = await reactNativeTextSize.measure({
      text: children,
      fontSize,
      fontFamily,
      fontWeight,
    });
    this.setState({ totalTextWidth: size.width });
  };

  calculateTextWidthLimit = () => {
    const { numberOfLines, offset } = this.props;
    this.setState({ textWidthLimit: numberOfLines * (Dimensions.get('window').width - offset) });
  };

  handleLinkPressed() {
    this.setState({
      isLinkPressed: true,
    });
  }

  handleLinkTerminated() {
    this.setState({
      isLinkPressed: false,
    });
  }

  handleLinkReleased() {
    const { isShowingMore } = this.state;
    this.setState({
      isLinkPressed: false,
      isShowingMore: !isShowingMore,
    });
  }

  render() {
    const {
      isLinkPressed, isShowingMore, totalTextWidth, textWidthLimit,
    } = this.state;
    const { children, numberOfLines } = this.props;

    if (!textWidthLimit || !totalTextWidth) {
      return null;
    }

    if (totalTextWidth > textWidthLimit) {
      return (
        <View>
          <Text numberOfLines={isShowingMore ? undefined : numberOfLines}>
            <Text {...this.props}>{children}</Text>
            {isShowingMore ? (
              <Text
                {...this.props}
                {...this.readMorePanResponder.panHandlers}
                style={{ color: isLinkPressed ? 'blue' : 'green' }}
              >
                {'   see less'}
              </Text>
            ) : null}
          </Text>
          {!isShowingMore ? (
            <Text style={styles.seeMoreText}>
              <Text {...this.props}>...</Text>
              <Text
                {...this.props}
                {...this.readMorePanResponder.panHandlers}
                style={{ color: isLinkPressed ? 'blue' : 'green' }}
              >
                {'   see more'}
              </Text>
            </Text>
          ) : null}
        </View>
      );
    }

    return <Text {...this.props}>{children}</Text>;
  }
}

const styles = StyleSheet.create({
  seeMoreText: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

SeeMore.propTypes = {
  children: PropTypes.string.isRequired,
  numberOfLines: PropTypes.number.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontWeight: PropTypes.oneOf([
    'normal',
    'bold',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ]).isRequired,
  fontFamily: PropTypes.string,
  offset: PropTypes.number.isRequired,
};

SeeMore.defaultProps = {
  fontFamily: undefined,
};

export default SeeMore;
