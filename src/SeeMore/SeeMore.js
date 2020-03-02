import React from 'react';
import {
  Text, PanResponder, Dimensions, View,
} from 'react-native';
import reactNativeTextSize from 'react-native-text-size';
import PropTypes from 'prop-types';

class SeeMore extends React.Component {
  panResponder = PanResponder.create({
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
      truncationIndex: undefined,
      containerWidth: undefined,
    };
  }

  async componentDidMount() {
    Dimensions.addEventListener('change', this.setContainerWidth);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.setContainerWidth);
  }

  setContainerWidth = async () => {
    const { containerWidth } = this.state;
    this.viewRef.measure((ox, oy, width) => {
      if (width !== containerWidth) {
        this.setState({ containerWidth: width }, () => this.findTruncationIndex());
      }
    });
  };

  findTruncationIndex = async () => {
    const { containerWidth } = this.state;
    const {
      children: text,
      style: { fontSize, fontFamily, fontWeight },
      seeMoreText,
      numberOfLines,
    } = this.props;

    const { width: textWidth } = await reactNativeTextSize.measure({
      text,
      fontSize,
      fontFamily,
      fontWeight,
    });

    const textWidthLimit = containerWidth * numberOfLines;

    if (textWidth < textWidthLimit) {
      this.setState({ truncationIndex: undefined });
      return;
    }

    const { width: seeMoreTextWidth } = await reactNativeTextSize.measure({
      text: ` ...${seeMoreText}`,
      fontSize,
      fontFamily,
      fontWeight,
    });

    const truncatedWidth = textWidthLimit - 2 * seeMoreTextWidth;

    let truncationIndex = 0;
    let start = 0;
    let end = text.length - 1;

    while (start <= end) {
      const middle = start + (end - start) / 2;
      // eslint-disable-next-line no-await-in-loop
      const { width: partialWidth } = await reactNativeTextSize.measure({
        text: text.slice(0, middle),
        fontSize,
        fontFamily,
        fontWeight,
      });
      if (Math.abs(truncatedWidth - partialWidth) <= 10) {
        truncationIndex = middle;
        break;
      } else if (partialWidth > truncatedWidth) {
        end = middle - 1;
      } else {
        start = middle + 1;
      }
    }

    this.setState({ truncationIndex: Math.floor(truncationIndex) });
  };

  handleDimensionChange = async () => {
    this.findTruncationIndex();
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
    const { isLinkPressed, isShowingMore, truncationIndex } = this.state;
    const {
      children: text,
      numberOfLines,
      linkColor,
      linkPressedColor,
      seeMoreText,
      seeLessText,
    } = this.props;

    if (truncationIndex) {
      return (
        <>
          <View
            ref={(ref) => {
              this.viewRef = ref;
            }}
            onLayout={this.setContainerWidth}
          />
          <Text {...this.props} numberOfLines={isShowingMore ? undefined : numberOfLines}>
            <Text {...this.props}>{isShowingMore ? text : text.slice(0, truncationIndex)}</Text>
            {isShowingMore ? null : <Text {...this.props}>...</Text>}
            <Text
              {...this.props}
              {...this.panResponder.panHandlers}
              style={{ color: isLinkPressed ? linkPressedColor : linkColor }}
            >
              {isShowingMore ? ` ${seeLessText}` : ` ${seeMoreText}`}
            </Text>
          </Text>
        </>
      );
    }

    return (
      <>
        <View
          ref={(ref) => {
            this.viewRef = ref;
          }}
          onLayout={this.setContainerWidth}
        />
        <Text {...this.props}>{text}</Text>
      </>
    );
  }
}

SeeMore.propTypes = {
  children: PropTypes.string.isRequired,
  numberOfLines: PropTypes.number.isRequired,
  linkColor: PropTypes.string,
  linkPressedColor: PropTypes.string,
  linkBackgroundColor: PropTypes.string,
  seeMoreText: PropTypes.string,
  seeLessText: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

SeeMore.defaultProps = {
  linkColor: '#2E75F0',
  linkPressedColor: '#163772',
  seeMoreText: 'see more',
  seeLessText: 'see less',
  linkBackgroundColor: '#ffffff',
  style: {
    fontFamily: undefined,
    fontSize: 14,
    fontWeight: '300',
  },
};

export default SeeMore;
