export class Transport {
	/**
	 * @param {import("../memory/memory").MemoryMap} mem
	 */
	constructor(mem) {
		this.mem = mem
	}

	/** @type {boolean} */
	get playing() {
		return !!this.mem.playing.at(0)
	}
	set playing(playing) {
		this.mem.playing.set([+playing])
	}

	/** @type {boolean} */
	get armed() {
		return !!this.mem.armed.at(0)
	}
	set armed(armed) {
		this.mem.armed.set([+armed])
	}

	/** @type {number} */
	get rate() {
		return this.mem.rate.at(0)
	}
	set rate(rate) {
		this.mem.rate.set([+rate])
	}

	/** @type {number} */
	get bpm() {
		return this.mem.bpm.at(0)
	}
	set bpm(bpm) {
		this.mem.bpm.set([+bpm])
	}

	/** @type {number} */
	get point() {
		return this.mem.point.at(0)
	}
	set point(point) {
		this.mem.point.set([+point])
	}

	/** @type {number} */
	get carrot() {
		return this.mem.carrot.at(0)
	}
	set carrot(carrot) {
		this.mem.carrot.set([+carrot])
	}

	/** @type {number} */
	get target() {
		return this.mem.target.at(0)
	}
	set target(target) {
		this.mem.target.set([+target])
	}
}

export class Loop {
	/**
	 * @param {import("../memory/memory").MemoryMap} mem
	 */
	constructor(mem) {
		this.mem = mem
	}

	/** @type {number} */
	get start() {
		return this.mem.loop.at(0)
	}
	set start(start) {
		this.mem.loop.set([start])
	}

	/** @type {number} */
	get end() {
		return this.mem.loop.at(1)
	}
	set end(end) {
		this.mem.loop.set([end])
	}

	/** @type {boolean} */
	get active() {
		return !!this.mem.loop.at(2)
	}
	set active(active) {
		this.mem.armed.set([+active])
	}
}
