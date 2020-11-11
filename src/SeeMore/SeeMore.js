import React from 'react';
import { Text, PanResponder } from 'react-native';
import PropTypes from 'prop-types';
import SeeMoreUtil from './SeeMoreUtil';

class SeeMore extends React.Component {
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderGrant: () => this.handleLinkPressed(),
    onPanResponderTerminate: () => this.handleLinkTerminated(),
    onPanResponderRelease: () => this.handleLinkReleased(),
  });

  /**
   * Map of containerWidth and truncationIndex so that we don't calculate it each time
   */
  containerWidthToTruncationIndexMap;

  constructor(props) {
    super(props);

    this.state = {
      isLinkPressed: false,
      isShowingMore: false,
      truncationIndex: undefined,
    };
  }

  isExpanded = () => {
    const { isShowingMore } = this.state;
    return isShowingMore;
  };

  onLayout = (e) => {
    // e.persist() keeps the original synthetic event intact
    e.persist();
    this.findAndUpdateTruncationIndex(e.nativeEvent.layout.width);
  };

  findAndUpdateTruncationIndex = async (containerWidth) => {
    const truncationIndex = await this.findTruncationIndex(containerWidth);
    this.setState({ truncationIndex });
  };

  findTruncationIndex = async (containerWidth) => {
    if (
      this.containerWidthToTruncationIndexMap &&
      this.containerWidthToTruncationIndexMap[containerWidth]
    ) {
      return this.containerWidthToTruncationIndexMap[containerWidth];
    }

    const {
      children: text,
      style: { fontSize, fontFamily, fontWeight },
      numberOfLines,
      seeMoreText,
    } = this.props;

    const truncationIndex = await SeeMoreUtil.getTruncationIndex(
      text,
      numberOfLines,
      fontSize,
      fontFamily,
      fontWeight,
      containerWidth,
      seeMoreText,
    );

    this.containerWidthToTruncationIndexMap = {
      ...this.containerWidthToTruncationIndexMap,
      [containerWidth]: truncationIndex,
    };

    return truncationIndex;
  };

  collapse() {
    return new Promise((resolve) => {
      this.setState({ isShowingMore: false }, () => resolve());
    });
  }

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

  renderSeeMoreSeeLessLink() {
    const { isLinkPressed, isShowingMore, truncationIndex } = this.state;
    const {
      children: text,
      linkColor,
      linkPressedColor,
      linkStyle,
      seeMoreText,
      seeLessText,
    } = this.props;
    const isTruncable = truncationIndex < text.length;

    if (!isTruncable) {
      return null;
    }

    return (
      <Text {...this.props} {...this.panResponder.panHandlers}>
        {isShowingMore ? null : <Text {...this.props}>...</Text>}
        <Text style={[linkStyle, { color: isLinkPressed ? linkPressedColor : linkColor }]}>
          {isShowingMore ? ` ${seeLessText}` : ` ${seeMoreText}`}
        </Text>
      </Text>
    );
  }

  render() {
    const { isShowingMore, truncationIndex } = this.state;
    const { children: text, numberOfLines } = this.props;

    return (
      <Text
        testID="SeeMore"
        onLayout={isShowingMore ? undefined : this.onLayout}
        numberOfLines={isShowingMore ? undefined : numberOfLines}
        {...this.panResponder.panHandlers}
      >
        <Text {...this.props}>{isShowingMore ? text : text.slice(0, truncationIndex)}</Text>
        {this.renderSeeMoreSeeLessLink()}
      </Text>
    );
  }
}

SeeMore.propTypes = {
  children: PropTypes.string.isRequired,
  numberOfLines: PropTypes.number.isRequired,
  linkColor: PropTypes.string,
  linkPressedColor: PropTypes.string,
  linkStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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
  linkStyle: undefined,
};

export default SeeMore;
