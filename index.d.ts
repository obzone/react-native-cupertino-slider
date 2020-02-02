// Type definitions for react-native-loading-spinner-overlay 0.5
// Project: https://github.com/joinspontaneous/react-native-loading-spinner-overlay
// Definitions by: fhelwanger <https://github.com/fhelwanger>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

import * as React from "react";
import * as ReactNative from "react-native";

export interface CupertinoProgressProps {
  onSlidingComplete?: (value: number) => void 
  onValueChange?: (value: number) => void 
  progress?: number
  size?: number
  magnification?: number
  color?: string 
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>
}

export default class CupertinoProgress extends React.PureComponent<CupertinoProgressProps> {}
