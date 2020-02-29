import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

const SeeMore = ({ children, ...props }) => <Text {...props}>{children}</Text>;

SeeMore.propTypes = {
  children: PropTypes.string.isRequired,
};

export default SeeMore;
