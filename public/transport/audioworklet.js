import {Transport} from "./memory.js"
import {map} from "../memory/memory.js"

/*
 * the transport is kept in a worker so that it can keep time uninterupted by
 * changes in the busy main thread
 */
class TapeTransport extends AudioWorkletProcessor {
	/** @param {{processorOptions: {buffer: SharedArrayBuffer, layerNumber:
	number}}} options */
	constructor(options) {
		super()
		let {buffer} = options.processorOptions
		if (!buffer) {
			let msg = "failed to instantiate TapeTransport, missing processorOption"
			console.error(msg, {
				buffer: typeof buffer
			})
			throw new Error(msg)
		}
		this.mem = map(buffer)
		this.transport = new Transport(this.mem)
	}

	/**
	 * @param {Float32Array[][]} inputs
	 * @param {Float32Array[][]} outputs
	 * @param {Record<string, Float32Array>} parameters
	 */
	process(inputs, outputs, parameters) {
		/*
		 * This takes 5 stereo inputs:
		 *   - track 1
		 *   - track 2
		 *   - track 3
		 *   - track 4
		 *   - mic/whatever
		 *
		 * Provides 5 stereo outputs:
		 *  - track 1
		 *  - track 2
		 *  - track 3
		 *  - track 4
		 *  - mic/whatever
		 *
		 * If the transport is armed, it writes the mix of track$target &
		 * mic/whatever to the target track's audio
		 */
		return true
	}
}

registerProcessor("tape-transport", TapeTransport)
