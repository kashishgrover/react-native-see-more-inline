import React from 'react';
import { Text, PanResponder } from 'react-native';
import reactNativeTextSize from 'react-native-text-size';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

class SeeMore extends React.Component {
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderGrant: () => this.handleLinkPressed(),
    onPanResponderTerminate: () => this.handleLinkTerminated(),
    onPanResponderRelease: () => this.handleLinkReleased(),
  });

  setDebouncedWidth;

  // Map of containerWidth to truncationIndex so that we don't calculate it each time
  containerWidthToTruncationIndexMap;

  constructor(props) {
    super(props);

    this.state = {
      isLinkPressed: false,
      isShowingMore: false,
      truncationIndex: undefined,
    };

    this.setDebouncedWidth = debounce((e) => {
      this.findTruncationIndex(e.nativeEvent.layout.width);
    }, 100);
  }

  onLayout = (e) => {
    // e.persist() keeps the original synthetic event intact
    e.persist();
    this.setDebouncedWidth(e);
  };

  findTruncationIndex = async (containerWidth) => {
    if (
      this.containerWidthToTruncationIndexMap
      && this.containerWidthToTruncationIndexMap[containerWidth]
    ) {
      this.setState({ truncationIndex: this.containerWidthToTruncationIndexMap[containerWidth] });
      return;
    }

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

    let index = 0;
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
        index = middle;
        break;
      } else if (partialWidth > truncatedWidth) {
        end = middle - 1;
      } else {
        start = middle + 1;
      }
    }

    const truncationIndex = Math.floor(index);

    // Map truncation index to width so that we don't calculate it again
    this.containerWidthToTruncationIndexMap = {
      ...this.containerWidthToTruncationIndexMap,
      [containerWidth]: truncationIndex,
    };
    this.setState({ truncationIndex });
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
    const isTruncable = truncationIndex < text.length;

    return (
      <Text
        onLayout={isShowingMore ? undefined : this.onLayout}
        numberOfLines={isShowingMore ? undefined : numberOfLines}
      >
        <Text {...this.props}>{isShowingMore ? text : text.slice(0, truncationIndex)}</Text>
        {isTruncable ? (
          <>
            {isShowingMore ? null : <Text {...this.props}>...</Text>}
            <Text
              {...this.props}
              {...this.panResponder.panHandlers}
              style={{ color: isLinkPressed ? linkPressedColor : linkColor }}
            >
              {isShowingMore ? ` ${seeLessText}` : ` ${seeMoreText}`}
            </Text>
          </>
        ) : null}
      </Text>
    );
  }
}

SeeMore.propTypes = {
  children: PropTypes.string.isRequired,
  numberOfLines: PropTypes.number.isRequired,
  linkColor: PropTypes.string,
  linkPressedColor: PropTypes.string,
  seeMoreText: PropTypes.string,
  seeLessText: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

SeeMore.defaultProps = {
  linkColor: '#2E75F0',
  linkPressedColor: '#163772',
  seeMoreText: 'see more',
  seeLessText: 'see less',
  style: {
    fontFamily: undefined,
    fontSize: 14,
    fontWeight: '300',
  },
};

export default SeeMore;
