import { CHANNEL_SIZE, TRACK_SIZE } from "../memory/constants.js"

export class Track {
	/**
	 * @param {import("../memory/memory").MemoryMap} mem
	 * @param {number} index
	 */
	constructor(mem, index) {
		this.mem = mem
		this.index = index
		this.offset = this.index * TRACK_SIZE
	}

	get left() {
		return this.mem.tape.subarray(this.offset, this.offset + CHANNEL_SIZE)
	}

	get right() {
		return this.mem.tape.subarray(this.offset + CHANNEL_SIZE, this.offset + CHANNEL_SIZE + CHANNEL_SIZE)
	}

	/** @type {boolean} */
	get target() {
		return this.index == this.mem.target.at(0)
	}
}
