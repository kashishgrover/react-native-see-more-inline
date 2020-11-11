declare module 'react-native-see-more-inline' {
  import { ComponentClass, ReactElement } from 'react';
  import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export type SeeMoreProps = {
    /**
     * Number of lines to limit the text to
     */
    numberOfLines: number;
    /**
     * Color of the see more/see less link
     */
    linkColor?: string;
    /**
     * Color of the see more/see less link when it is being pressed
     */
    linkPressedColor?: string;
    /**
     * Extra styles for the see more/see less link if any
     */
    linkStyle?: StyleProp<TextStyle>;
    /**
     * String value to override "see more" text
     */
    seeMoreText?: string;
    /**
     * String value to override "see less" text
     */
    seeLessText?: string;
    /**
     * Style of the base text
     */
    style?: StyleProp<TextStyle>;
  };

  const SeeMore: ComponentClass<SeeMoreProps>;

  export default SeeMore;
}
