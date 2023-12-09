import {
	size as MEMORY_SIZE,
	map,
} from "./memory/memory.js"
import * as db from "./db/db.js"
import TapeTrack from "./track/element.js"
import TapeTransport from "./transport/element.js"
TapeTrack.define()
TapeTransport.define()
let transport = document.querySelector("tape-transport")
let tracks = document.querySelectorAll("tape-track")


let sharedarraybuffer = new SharedArrayBuffer(MEMORY_SIZE)
transport.init(sharedarraybuffer)
tracks.forEach((track, index) => {
	track.init(sharedarraybuffer)
})


if (history.scrollRestoration) {
	history.scrollRestoration = "manual"
}
await db.init(sharedarraybuffer)


let featureflags = new URLSearchParams(location.search.slice(1))
for (let [flag, value] of featureflags.entries()) {
	document.documentElement.setAttribute(flag, value)
}
