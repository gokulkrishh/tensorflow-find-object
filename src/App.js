import React, { Component } from "react";
import "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

import "./App.css";

class App extends Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			results: [],
			resultStyles: {},
			resultCloseBtnStyles: {}
		};
		this.cameraAPISuppored = false;
		this.model = null;
	}

	componentDidMount() {
		if (!!navigator.mediaDevices && navigator.mediaDevices !== undefined) {
			this.cameraAPISuppored = true;
			this.initCamera();
		}
	}

	initCamera = () => {
		if (this.cameraAPISuppored) {
			navigator.mediaDevices
				.enumerateDevices()
				.then(devices => {
					let constraints = null;
					var device = devices.filter(device => {
						if (device.kind === "videoinput") return device;
					});

					const isThisiOSDevice = ["iPad", "iPhone", "iPod"].indexOf(navigator.platform) >= 0;

					if (device.length > 1) {
						constraints = {
							video: {
								mandatory: {
									sourceId: device[1].deviceId ? device[1].deviceId : null
								}
							},
							audio: false
						};

						if (isThisiOSDevice) {
							constraints.video.facingMode = "environment";
						}

						this.startCaptureUsingCamera(constraints);
					} else if (device.length) {
						constraints = {
							video: {
								mandatory: {
									sourceId: device[0].deviceId ? device[0].deviceId : null
								}
							},
							audio: false
						};

						if (isThisiOSDevice) {
							constraints.video.facingMode = "environment";
						}
						this.startCaptureUsingCamera(constraints);
					} else {
						this.startCaptureUsingCamera({ video: true });
					}
				})
				.catch(function(error) {
					console.error("Error occurred while accessing the camera", error);
				});
		}
	};

	startCaptureUsingCamera = constraints => {
		if (this.cameraAPISuppored) {
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(streamData => {
					this.videoElement.srcObject = streamData;
					this.videoElement.setAttribute("playsinline", true);
					this.videoElement.setAttribute("controls", true);
					setTimeout(() => {
						this.videoElement.removeAttribute("controls");
					});
				})
				.catch(error => {
					console.error("Error occurred while capturing", error);
				});
		}
	};

	captureAndPredict = async () => {
		this.setState({ loading: true });
		if (!this.model) this.model = await mobilenet.load();
		var ctx = this.canvasElement.getContext("2d");
		await ctx.drawImage(this.videoElement, 0, 0, 200, 200);
		const predictions = await this.model.classify(this.canvasElement);
		this.showResults(predictions);
	};

	showResults(predictions) {
		this.setState({
			results: predictions,
			resultStyles: {
				transform: "translateY(0)"
			},
			resultCloseBtnStyles: {
				visibility: "visible"
			},
			loading: false
		});
	}

	hideResults = () => {
		var ctx = this.canvasElement.getContext("2d");
		ctx.clearRect(0, 0, 200, 200);
		this.setState({
			results: [],
			resultStyles: {
				transform: "translateY(255px)"
			},
			resultCloseBtnStyles: {
				visibility: "hidden"
			}
		});
	};

	showSpinner = () => {
		this.setState({ loading: true });
	};

	render() {
		const { loading, results, resultCloseBtnStyles, resultStyles } = this.state;
		return (
			<div className="App">
				<div id="camera" />
				<video
					autoPlay
					ref={refs => {
						this.videoElement = refs;
					}}
				/>

				<div
					className="result-container"
					ref={refs => {
						this.resultContainer = refs;
					}}
					style={resultStyles}
				>
					<svg
						version="1.1"
						className="hide-btn"
						x="0px"
						y="0px"
						width="24px"
						height="24px"
						viewBox="0 0 24 24"
						enableBackground="new 0 0 24 24"
						style={resultCloseBtnStyles}
						onClick={this.hideResults}
					>
						<g id="Bounding_Boxes">
							<path opacity="0.87" fill="none" d="M24,24H0L0,0l24,0V24z" />
						</g>
						<g id="Outline_1_">
							<path d="M16.59,8.59L12,13.17L7.41,8.59L6,10l6,6l6-6L16.59,8.59z" />
						</g>
					</svg>

					{!loading && results.length === 0 ? (
						<button onClick={this.captureAndPredict}>
							<svg className="capture-icon" version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enableBackground="new 0 0 24 24">
								<g id="Bounding_Boxes">
									<g id="ui_x5F_spec_x5F_header_copy_3" />
									<path fill="none" d="M0,0h24v24H0V0z" />
								</g>
								<g id="Outline_1_">
									<g id="ui_x5F_spec_x5F_header_copy_4" />
									<path
										d="M14.25,2.26l-0.08-0.04l-0.01,0.02C13.46,2.09,12.74,2,12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10
		C22,7.25,18.69,3.28,14.25,2.26z M19.41,9h-5.68h-2.31l2.71-4.7C16.53,4.96,18.48,6.72,19.41,9z M13.1,4.08L10.27,9l-1.15,2
		L6.4,6.3C7.84,4.88,9.82,4,12,4C12.37,4,12.74,4.03,13.1,4.08z M5.7,7.09L8.54,12l0,0l1.15,2H4.26C4.1,13.36,4,12.69,4,12
		C4,10.15,4.64,8.45,5.7,7.09z M4.59,15h5.68h2.3l-2.71,4.7C7.46,19.03,5.52,17.28,4.59,15z M10.9,19.91L14.89,13l2.72,4.7
		C16.16,19.12,14.18,20,12,20C11.62,20,11.26,19.96,10.9,19.91z M18.3,16.91l-4-6.91h5.43C19.9,10.64,20,11.31,20,12
		C20,13.85,19.36,15.55,18.3,16.91z"
									/>
								</g>
							</svg>
						</button>
					) : null}
					<div>
						{!loading && results.length > 0 ? <h3>Predictions</h3> : null}
						<div id="result">
							<canvas
								width="200"
								height="200"
								ref={refs => {
									this.canvasElement = refs;
								}}
							/>
							{results.map((result, index) => (
								<p key={index}>
									{result.className} - <i>{(result.probability * 100).toFixed(2)}%</i>
								</p>
							))}
						</div>
					</div>
				</div>
				{loading ? (
					<div className="spinner">
						<div className="double-bounce1" />
						<div className="double-bounce2" />
					</div>
				) : null}
			</div>
		);
	}
}

export default App;
