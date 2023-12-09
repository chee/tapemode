import {Track} from "./memory.js"
import {map} from "../memory/memory.js"
import { Transport } from "../transport/memory.js"

/**
 * @type {OffscreenCanvasRenderingContext2D} context
 */
let context

/**
 * @type {Track}
 */
let track

/**
 * @type {Transport}
 */
let transport

/**
 * Clear the canvas and reset the tools
 * @param {OffscreenCanvasRenderingContext2D} context
 */
function clear(context) {
	if (!context) return
	let canvas = context.canvas
	let {width, height} = canvas
	context.restore()

	context.fillStyle = "white"
	context.strokeStyle = "black"
	context.clearRect(0, 0, width, height)
	context.lineWidth = 3
}

/**
 * draw a full-height rectangle between `start` and `end`
 * @param {number} start
 * @param {number} end
 * @param {string} fill fillStyle
 */
function fillRegion(start, end, fill) {
	context.fillStyle = fill
	context.fillRect(start, 0, end - start, context.canvas.height)
}

/**
 * @param {OffscreenCanvasRenderingContext2D} context
 * @param {number} soundLength
 */
function getXMultiplier(context, soundLength) {
	return context.canvas.width / soundLength
}

/**
 * @param {OffscreenCanvasRenderingContext2D} context
 */
function getZeroPoint(context) {
	return context.canvas.height / 2
}

/**
 * @param {OffscreenCanvasRenderingContext2D} context
 */
function getYMultiplier(context) {
	let verticalDistance = 2
	return context.canvas.height * (1 / verticalDistance)
}

/**
 * @typedef {Object} DrawSampleLineArguments
 * @prop {Float32Array} array
 * @prop {number} x
 * @prop {number} xm
 * @prop {number} height
 * @prop {number} markers
 * @param {DrawSampleLineArguments} args
 */
function drawSampleLine({array, x, xm, height}) {
	context.beginPath()
	context.strokeStyle = "white"
	context.lineWidth = 3
	// trying to make it inversely correlated with the size input so smaller
	// samples have more accuracy
	// cleverer than this would be to move in chunks of 10 and draw their average
	let skip = 32
	for (let index in array) {
		let idx = Number(index)
		let f32 = array.at(idx)
		// Safari's canvas is so slow when drawing big paths. So i'll drop some
		// accuracy.
		// TODO check how slow this is on low-powered devices !!
		// TODO keep accuracy high when the sample is small
		// TODO keep accurancy high when not on safari!!!
		if (idx % skip) {
			continue
		}
		x += xm * skip

		context.lineTo(
			x,
			height - (f32 * getYMultiplier(context) + getZeroPoint(context))
		)
	}

	context.stroke()
	return x
}


function update(frame = 0) {
	fillRegion(0, context.canvas.width, "black")
	let point = transport.point
	// todo use sampleRate
	let start = (point|0) - 240000
	let end = (point|0) + 240000
	let xm = getXMultiplier(context, 480000)

	for (let x = 0, i = start; i < end; i++, x += xm) {
		if (i >= 0) {
			let s = track.left[i]
			if (s != 0) {
				context.beginPath()
				context.strokeStyle = "red"
				context.lineTo(
					x,
					0
				)
			}
		}
	}
	requestAnimationFrame(update)
}

onmessage = async event => {
	let message = event.data

	if (message.type == "init") {
		let {canvas, track: tn, sharedarraybuffer} = message
		context = canvas.getContext("2d")
		context.save()
		context.fillStyle = "black"
		clear(context)
		track = new Track(map(sharedarraybuffer), tn)
		transport = new Transport(map(sharedarraybuffer))
		update()
	}
}
