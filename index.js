import React from 'react';
import { View, Animated } from 'react-native';

export default class SliderComponent extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			movingLocation: new Animated.Value(this.props.progress || 50),
			size: new Animated.Value(props.size),
			viewHeight: 50,
			viewWidth: 50
		}

		this._latestmovingLocation = this.props.progress || 50

		this._movingLocationOffset = 0

		let animatedConfig = {}
		if (this.props.horizontal) {
			if (this.props.onValueChange) {
				animatedConfig = {
					listener: ({ nativeEvent: { locationX, locationY } }) => {
						locationX + this._movingLocationOffset > this.state.viewWidth ? this.props.onValueChange(100) : locationX + this._movingLocationOffset < 0 ? this.props.onValueChange(0) : this.props.onValueChange((locationX + this._movingLocationOffset) * 100 / this.state.viewWidth)
					}
				}
			}
			this._onResponderMove = Animated.event([{ nativeEvent: { locationX: this.state.movingLocation } }], animatedConfig)
		} else {
			if (this.props.onValueChange) {
				animatedConfig = {
					listener: ({ nativeEvent: { locationX, locationY } }) => {
						locationY + this._movingLocationOffset > this.state.viewHeight ? this.props.onValueChange(0) : locationY + this._movingLocationOffset < 0 ? this.props.onValueChange(100) : this.props.onValueChange((this.state.viewHeight - locationY - this._movingLocationOffset) * 100 / this.state.viewHeight)
					}
				}
			}
			this._onResponderMove = Animated.event([{ nativeEvent: { locationY: this.state.movingLocation } }], animatedConfig)
		}
	}

	_onMoveShouldSetResponder = () => {
		return true
	}

	_onStartShouldSetResponder = () => {
		return true
	}

	_onResponderGrant = ({ nativeEvent: { locationX, locationY } }) => {
		if (this.props.horizontal) {
			this._movingLocationOffset = this._latestmovingLocation - locationX
		} else {
			this._movingLocationOffset = this._latestmovingLocation - locationY
		}
		this.state.movingLocation.setOffset(this._movingLocationOffset)
		Animated.spring(this.state.size, {
			toValue: this.props.magnification
		}).start()
	}
	_onResponderReject = () => {
		console.log('_onResponderReject')
	}

	_onResponderRelease = ({ nativeEvent: { locationX, locationY } }) => {
		if (this.props.horizontal) {
			if (this.props.onSlidingComplete) {
				locationX + this._movingLocationOffset > this.state.viewWidth ? this.props.onSlidingComplete(100) : locationX + this._movingLocationOffset < 0 ? this.props.onSlidingComplete(0) : this.props.onSlidingComplete((locationX + this._movingLocationOffset) * 100 / this.state.viewWidth)
			}
			if (locationX + this._movingLocationOffset > this.state.viewWidth) {
				this._latestmovingLocation = this.state.viewWidth
			} else if (locationX + this._movingLocationOffset < 0) {
				this._latestmovingLocation = 0
			} else {
				this._latestmovingLocation = locationX + this._movingLocationOffset
			}
		} else {
			if (this.props.onSlidingComplete) {
				locationY + this._movingLocationOffset > this.state.viewHeight ? this.props.onSlidingComplete(0) : locationY + this._movingLocationOffset < 0 ? this.props.onSlidingComplete(100) : this.props.onSlidingComplete((this.state.viewHeight - locationY - this._movingLocationOffset) * 100 / this.state.viewHeight)
			}
			if (locationY + this._movingLocationOffset > this.state.viewHeight) {
				this._latestmovingLocation = this.state.viewHeight
			} else if (locationY + this._movingLocationOffset < 0) {
				this._latestmovingLocation = 0
			} else {
				this._latestmovingLocation = locationY + this._movingLocationOffset
			}
		}
		Animated.spring(this.state.size, {
			toValue: this.props.size
		}).start()
	}

	_onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
		this.setState({ viewHeight: height, viewWidth: width })
	}

	render() {
		if (this.props.horizontal) {
			this._ProgressBarLength = this.state.movingLocation.interpolate({
				inputRange: [-1000, 0, this.state.viewWidth, 1000],
				outputRange: [0, 0.1, this.state.viewWidth - 0.1, this.state.viewWidth]
			})
		} else {
			this._ProgressBarLength = this.state.movingLocation.interpolate({
				inputRange: [-1000, 0, this.state.viewHeight, 1000],
				outputRange: [0, 0.1, this.state.viewHeight - 0.1, this.state.viewHeight]
			})
		}
		const containerViewStyle =
		{
			flex: 1,
			height: this.props.magnification,
			width: undefined,
			justifyContent: 'center',
		}
		const animatedContainerViewStyle = this.props.horizontal ?
			{
				height: this.state.size,
				width: undefined,
				backgroundColor: this.props.style.backgroundColor || '#F5F5F5',
				overflow: 'hidden',
				borderRadius: 10,
				borderColor: this.props.style.backgroundColor || '#F5F5F5',
				borderWidth: 1
			} :
			{
				width: this.state.size,
				overflow: 'hidden',
				borderRadius: 10,
				borderColor: this.props.style.backgroundColor || '#F5F5F5',
				borderWidth: 1,
				backgroundColor: this.props.color || '#8F4398',
				flex: 1,
			}

		const animatedViewStyle = this.props.horizontal ?
			{
				position: 'relative',
				height: this.state.size,
				width: this._ProgressBarLength,
				backgroundColor: this.props.color || '#8F4398'
			} :
			{
				position: 'relative',
				height: this._ProgressBarLength,
				width: this.state.size,
				backgroundColor: this.props.style.backgroundColor || '#F5F5F5',
			}

		return (
			<View onLayout={this._onLayout} style={containerViewStyle} >
				<Animated.View onResponderRelease={this._onResponderRelease} onStartShouldSetResponder={this._onStartShouldSetResponder} onMoveShouldSetResponder={this._onMoveShouldSetResponder} onResponderGrant={this._onResponderGrant} onResponderReject={this._onResponderReject} onResponderMove={this._onResponderMove} style={animatedContainerViewStyle} >
					<Animated.View style={animatedViewStyle} />
				</Animated.View>
			</View>
		)
	}
}