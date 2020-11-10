declare module 'react-native-see-more-inline' {
  import { ComponentClass, ReactElement } from 'react';

  export type SeeMoreProps = {
    numberOfLines: number;
    linkColor: string;

    linkPressedColor?: string;

    seeMoreTextStyle?: StyleProp<TextStyle>;
    seeLessTextStyle?: StyleProp<TextStyle>;

    seeMoreText?: string | ReactElement;
    seeLessText?: string | ReactElement;

    style?: StyleProp<ViewStyle>;
  };

  const SeeMore: ComponentClass<SeeMoreProps>;

  export default SeeMore;
}
