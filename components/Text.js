import React from 'react';
import { Text } from 'react-native';

const Text = (props) => {
    return <Text style={[styles.text, props.style]}>{props.children}</Text>;
};

Text.defaultProps = {
    style: styles.defaultText,
};

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
    },
    defaultText: {
        color: 'red',
    },
});

export default Text;
