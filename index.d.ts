import TapeTrack from "./public/track/element"
import TapeTransport from "./public/transport/element"

declare global {
	interface HTMLElementTagNameMap {
		"tape-track": TapeTrack
		"tape-transport": TapeTransport
	}

	interface HTMLElement {
		connectedCallback(): void
	}
}
