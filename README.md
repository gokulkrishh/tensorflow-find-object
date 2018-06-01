# [tensorflow-find-object](https://find.surge.sh)

A simple application to demonstrate tensorflowjs using mobilenet model.

Note: *This demo uses the pretrained MobileNet_25_224 model from Keras. It is not trained to recognize human faces. For best performance, show the images of objects like piano, coffee mugs, bottles, etc*

## [Demo](https://find.surge.sh)

![Demo GIF](https://github.com/gokulkrishh/tensorflow-find-object/blob/master/FindObject.gif)

## Installation

```bash
yarn or npm install
```

## Run

```bash
npm run start
```

## Build

```bash
npm run build
```

**This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)**

### Libraries I used

1.  [Tensorflow](https://js.tensorflow.org/) js library.
2.  Used a tensorflow model called [mobilenet](https://github.com/tensorflow/models/blob/master/research/slim/nets/mobilenet_v1.md) to predict.
3.  Used media stream API with canvas to capture and give it to mobilenet model.

### Problems I faced

* Got minification error in TensorJS from webpack uglify plugin.
* Safari browser in iOS device, the media stream API wont work unless you add `facingMode = "environment";` in constraints object passed to `getUserMedia` API + with [this hack].(https://github.com/webrtc/samples/issues/929#issuecomment-330816567).
* After adding to homescreen, media stream API is not working in safari browser in iOS devcie.

### MIT Licensed
