import React from 'react';
import {
  render, cleanup, fireEvent, wait,
} from '@testing-library/react-native';
import SeeMore from '../SeeMore';
import SeeMoreUtil from '../SeeMore/SeeMoreUtil';

afterEach(cleanup);

describe('SeeMore', () => {
  it('renders small text correctly', () => {
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const { baseElement } = render(<SeeMore numberOfLines={2}>{text}</SeeMore>);

    expect(baseElement).toMatchSnapshot();
  });

  it('renders big text correctly', async () => {
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';
    const truncationIndex = 222;

    jest
      .spyOn(SeeMoreUtil, 'getTruncationIndex')
      .mockImplementation(() => new Promise((a) => a(truncationIndex)));

    const baseElement = render(
      <SeeMore numberOfLines={2}>{text}</SeeMore>,
    );

    fireEvent.layout(baseElement.getByTestId('SeeMore'), {
      nativeEvent: {
        layout: {
          width: 200,
        },
      },
      persist: Function,
    });

    await wait(() => {
      expect(baseElement.getByText(/see more/)).toBeTruthy();
      expect(baseElement.getByText(text.slice(0, truncationIndex))).toBeTruthy();
      expect(baseElement).toMatchSnapshot();
    });
  });
});
