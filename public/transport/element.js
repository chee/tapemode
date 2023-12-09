import { map } from "../memory/memory.js"
import { Transport } from "./memory.js"

export default class TapeTransport extends HTMLElement {
	static define() {
		customElements.define("tape-transport", TapeTransport)
	}

	/**
	 * @type {import("./memory").Transport}
	 */
	transport

	connectedCallback() {
		this.one = this.querySelector("#one")
		this.two = this.querySelector("#two")
		this.three = this.querySelector("#three")

		this.lift = this.querySelector("#lift")
		this.drop = this.querySelector("#drop")
		this.snip = this.querySelector("#snip")

		this.arm = this.querySelector("#arm")
		this.play = this.querySelector("#play")
		this.stop = this.querySelector("#stop")

		this.left = this.querySelector("#left")
		this.right = this.querySelector("#right")
		this.shift = this.querySelector("#shift")
	}

	/** @param {SharedArrayBuffer} sharedarraybuffer */
	init(sharedarraybuffer) {
		this.track = new Transport(map(sharedarraybuffer))
	}
}
