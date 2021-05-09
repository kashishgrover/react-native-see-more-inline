import React, { Component, ReactElement } from 'react';
import { Text, PanResponder, TextStyle, LayoutChangeEvent } from 'react-native';
import { getTruncationIndex } from './SeeMoreUtil';

interface Props {
  children: string;
  numberOfLines: number;
  linkColor: string;
  linkPressedColor: string;
  seeMoreText: string;
  seeLessText: string;
  linkStyle: TextStyle;
  style: TextStyle;
}

interface State {
  isLinkPressed: boolean;
  isShowingMore: boolean;
  truncationIndex: number;
}

class SeeMore extends Component<Props, State> {
  static defaultProps = {
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
  containerWidthToTruncationIndexMap: { [containerWidth: number]: number } | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      isLinkPressed: false,
      isShowingMore: false,
      truncationIndex: 0,
    };

    this.containerWidthToTruncationIndexMap = undefined;
  }

  handleLinkPressed(): void {
    this.setState({
      isLinkPressed: true,
    });
  }

  handleLinkTerminated(): void {
    this.setState({
      isLinkPressed: false,
    });
  }

  handleLinkReleased(): void {
    const { isShowingMore } = this.state;
    this.setState({
      isLinkPressed: false,
      isShowingMore: !isShowingMore,
    });
  }

  findAndUpdateTruncationIndex = async (containerWidth: number): Promise<void> => {
    const truncationIndex = await this.findTruncationIndex(containerWidth);
    this.setState({ truncationIndex });
  };

  onLayout = (e: LayoutChangeEvent): void => {
    // e.persist() keeps the original synthetic event intact
    e.persist();
    this.findAndUpdateTruncationIndex(e.nativeEvent.layout.width);
  };

  isExpanded = (): boolean => {
    const { isShowingMore } = this.state;
    return isShowingMore;
  };

  findTruncationIndex = async (containerWidth: number): Promise<number> => {
    if (
      this.containerWidthToTruncationIndexMap &&
      this.containerWidthToTruncationIndexMap[containerWidth]
    ) {
      return this.containerWidthToTruncationIndexMap[containerWidth];
    }

    const {
      children: text,
      style,
      numberOfLines,
      seeMoreText,
    } = this.props;

    const truncationIndex = await getTruncationIndex(
      text,
      numberOfLines,
      style,
      containerWidth,
      seeMoreText,
    );

    this.containerWidthToTruncationIndexMap = {
      ...this.containerWidthToTruncationIndexMap,
      [containerWidth]: truncationIndex,
    };

    return truncationIndex;
  };

  collapse(): Promise<void> {
    return new Promise((resolve) => {
      this.setState({ isShowingMore: false }, () => resolve());
    });
  }

  renderSeeMoreSeeLessLink(): ReactElement | null {
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

  render(): ReactElement {
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

export default SeeMore;
