let theoreticalSampleRate = 48000

export const TRACKS_PER_MACHINE = 4
export const CHANNELS_PER_TRACK = 2
// 5 minutes
export const CHANNEL_SIZE = theoreticalSampleRate * 60 * 5
export const TRACK_SIZE = CHANNEL_SIZE * CHANNELS_PER_TRACK
export const TRACK_BYTE_SIZE = TRACK_SIZE * 4
export const CHANNELS_PER_MACHINE = TRACKS_PER_MACHINE * CHANNELS_PER_TRACK
export const QUANTUM = 128

/** @typedef {typeof Loop[keyof typeof Loop]} Loop */
export const Loop = /** @type const */ ({
	start: 0,
	end: 1,
	x: 2,
	xMultiplier: 3
})
