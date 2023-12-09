import { map } from "../memory/memory.js"
import { Track } from "./memory.js"

export default class TapeTrack extends HTMLElement {
	static define() {
		customElements.define("tape-track", TapeTrack)
	}

	/** @type {import("./memory").Track} */
	track
	constructor() {
		super()

		this.worker = new Worker("/track/worker.js", {type: "module"})
		this.canvas = document.createElement("canvas")
		this.append(this.canvas)
		this.canvas.width = this.clientWidth * 3
		this.canvas.height = this.clientHeight * 3
	}

	/** @param {SharedArrayBuffer} sharedarraybuffer */
	init(sharedarraybuffer) {
		this.track = new Track(map(sharedarraybuffer), +this.getAttribute("track"))
		let offscreen = this.canvas.transferControlToOffscreen()
		this.worker.postMessage(
			{
				type: "init",
				canvas: offscreen,
				track: +this.getAttribute("track"),
				sharedarraybuffer
			},
			[offscreen]
		)
	}

	connectedCallback() {
	}
}
