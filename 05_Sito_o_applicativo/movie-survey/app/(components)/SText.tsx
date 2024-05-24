import React, { useEffect } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import Colors from '../../constants/Colors';
import FontSize from '../../constants/FontSize';

const SText = (props: TextProps) => {
    const { style, ...otherProps } = props;
    const mergedStyle = [{ fontFamily: 'Poppins', color: Colors.text, fontSize: FontSize.normal }, style];

    return (
        <Text style={mergedStyle} {...otherProps} />
    );
};

export default SText;
