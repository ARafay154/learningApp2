import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Label } from '../../components'; // Ensure you have the correct path to your Label component
import { COLOR, TEXT_STYLE, hp } from '../../enums/StyleGuide';

const ProgressCircle = ({ percentage, heading }) => {
    const radius = hp(10);
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    // Increase the SVG size slightly to fully fit the circle
    const adjustedSize = radius * 2 + strokeWidth + 2; // Adding a small extra margin

    // Determine the stroke color based on the percentage
    let strokeColor;
    let title2
    if (percentage <= 40) {
        strokeColor = COLOR.red;
        title2 = "Poor";
    } else if (percentage <= 60) {
        strokeColor = COLOR.yellow;
        title2 = "Average";
    } else if (percentage <= 75) {
        strokeColor = COLOR.orange
        title2 = "Good";
    } else {
        strokeColor = COLOR.green;
        title2 = "Excellent";
    }

    return (
        <View style={styles.container}>
            <Svg width={adjustedSize} height={adjustedSize}>
                {/* Background circle */}
                <Circle
                    cx={adjustedSize / 2} // Center the circle in the SVG
                    cy={adjustedSize / 2}
                    r={radius}
                    stroke={COLOR.light_grey}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <Circle
                    cx={adjustedSize / 2} // Center the circle in the SVG
                    cy={adjustedSize / 2}
                    r={radius}
                    stroke={strokeColor} // Use the dynamically determined color
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    fill="none"
                    rotation={-90}
                    origin={`${adjustedSize / 2}, ${adjustedSize / 2}`}
                />
            </Svg>
            <View style={styles.textContainer}>
                <Label style={[styles.percentage, { color: strokeColor }]}>{title2}</Label>
                <Label style={[styles.percentage, { color: strokeColor }]}>{percentage.toFixed(0)} %</Label>
            </View>
        </View>
    );
};

export default memo(ProgressCircle);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center'
    },
    heading: {
        ...TEXT_STYLE.bigTextBold,
        color: COLOR.purple,
    },
    percentage: {
        ...TEXT_STYLE.bigTextBold,
        color: COLOR.purple,
    },
});