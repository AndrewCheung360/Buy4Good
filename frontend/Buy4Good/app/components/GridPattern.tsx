import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

interface GridPatternProps {
  gridSize?: number;
  borderColor?: string;
  borderWidth?: number;
}

export default function GridPattern({
  gridSize = 40,
  borderColor = "rgba(213, 230, 105, 0.1)",
  borderWidth = 0.5,
}: GridPatternProps) {
  const rows = Math.ceil((screenHeight * 0.6) / gridSize);
  const cols = Math.ceil(screenWidth / gridSize);

  // Generate fixed sparkles that look random
  const generateSparkles = () => {
    const sparkles = [
      { id: 1, x: 50, y: 80, size: 2 },
      { id: 2, x: 120, y: 150, size: 1.5 },
      { id: 3, x: 200, y: 60, size: 3 },
      { id: 4, x: 280, y: 200, size: 1 },
      { id: 5, x: 350, y: 100, size: 2.5 },
      { id: 6, x: 80, y: 250, size: 1.8 },
      { id: 7, x: 250, y: 180, size: 2.2 },
      { id: 8, x: 320, y: 70, size: 1.3 },
      { id: 9, x: 150, y: 120, size: 2.8 },
      { id: 10, x: 300, y: 160, size: 1.7 },
      { id: 11, x: 100, y: 90, size: 2.1 },
      { id: 12, x: 220, y: 140, size: 1.4 },
      { id: 13, x: 180, y: 220, size: 2.3 },
      { id: 14, x: 280, y: 80, size: 1.9 },
      { id: 15, x: 120, y: 190, size: 2.6 },
      // Additional sparkles positioned lower
      { id: 16, x: 90, y: 280, size: 1.6 },
      { id: 17, x: 240, y: 320, size: 2.4 },
      { id: 18, x: 160, y: 350, size: 1.2 },
      { id: 19, x: 320, y: 290, size: 2.7 },
      { id: 20, x: 70, y: 310, size: 1.9 },
      { id: 21, x: 290, y: 340, size: 1.4 },
      { id: 22, x: 130, y: 300, size: 2.1 },
      { id: 23, x: 270, y: 270, size: 1.8 },
      { id: 24, x: 110, y: 330, size: 2.3 },
      { id: 25, x: 340, y: 310, size: 1.5 },
      // More sparkles for enhanced effect
      { id: 26, x: 40, y: 120, size: 1.3 },
      { id: 27, x: 180, y: 80, size: 2.0 },
      { id: 28, x: 260, y: 140, size: 1.6 },
      { id: 29, x: 140, y: 200, size: 2.4 },
      { id: 30, x: 320, y: 120, size: 1.8 },
      { id: 31, x: 60, y: 180, size: 2.2 },
      { id: 32, x: 220, y: 100, size: 1.4 },
      { id: 33, x: 300, y: 200, size: 2.6 },
      { id: 34, x: 80, y: 140, size: 1.7 },
      { id: 35, x: 240, y: 80, size: 2.1 },
      { id: 36, x: 160, y: 160, size: 1.5 },
      { id: 37, x: 280, y: 120, size: 2.3 },
      { id: 38, x: 100, y: 200, size: 1.9 },
      { id: 39, x: 200, y: 140, size: 2.0 },
      { id: 40, x: 320, y: 180, size: 1.6 },
      { id: 41, x: 120, y: 100, size: 2.4 },
      { id: 42, x: 260, y: 160, size: 1.8 },
      { id: 43, x: 180, y: 120, size: 2.2 },
      { id: 44, x: 300, y: 140, size: 1.4 },
      { id: 45, x: 140, y: 180, size: 2.5 },
      { id: 46, x: 220, y: 200, size: 1.7 },
      { id: 47, x: 280, y: 160, size: 2.1 },
      { id: 48, x: 160, y: 100, size: 1.6 },
      { id: 49, x: 240, y: 120, size: 2.3 },
      { id: 50, x: 200, y: 160, size: 1.9 },
    ];
    return sparkles;
  };

  const sparkles = generateSparkles();

  return (
    <View style={styles.gridContainer}>
      {/* Grid pattern */}
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const y = row * gridSize;
          const opacity = Math.max(0.1, 1 - y / (screenHeight * 0.6)); // Fade grid lines towards bottom
          return (
            <View
              key={`grid-${row}-${col}`}
              style={[
                styles.gridSquare,
                {
                  top: y,
                  left: col * gridSize,
                  borderColor,
                  borderWidth,
                  opacity,
                },
              ]}
            />
          );
        })
      )}

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <View
          key={`sparkle-${sparkle.id}`}
          style={[
            styles.sparkle,
            {
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridSquare: {
    position: "absolute",
    width: 40,
    height: 40,
  },
  sparkle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 50,
  },
});
