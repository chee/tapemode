import {DB_VERSION} from "../db/share.js"
import {
	CHANNELS_PER_TRACK,
	TRACK_SIZE,
	TRACKS_PER_MACHINE
} from "./constants.js"
import migrations from "./migrations.js"
export * from "./constants.js"

/**
 * @typedef {Uint8Array | Int8Array | Int32Array | Uint32Array | Float32Array} BentoTypedArray
 */

/**
 * @typedef {Object} ArrayInfo
 * @prop {new (size: number) => BentoTypedArray} type
 * @prop {number} size
 * @prop {number[]} [default]
 * @prop {number} [defaultFill]
 */

/**
 * @typedef {Record<string, ArrayInfo>} MemoryArrayDefinition
 */
/**
 * @satisfies {MemoryArrayDefinition}
 */
export let arrays = {
	tape: {
		type: Float32Array,
		size: TRACK_SIZE * TRACKS_PER_MACHINE,
	},
	// can i use the system clipboard for this?
	clipboard: {
		type: Float32Array,
		size: TRACK_SIZE * TRACKS_PER_MACHINE,
	},
	undo: {
		type: Float32Array,
		size: TRACK_SIZE * TRACKS_PER_MACHINE,
	},
	// this is a float because at lower play speeds we will be between samples
	point: {
		type: Float32Array,
		size: 1
	},
	speed: {
		type: Float32Array,
		size: 0,
	},
	loop: {
		type: Uint32Array,
		size: 4
	},
	dbversion: {
		type: Uint32Array,
		size: 1,
		default: [0]
	},
	rate: {
		type: Uint32Array,
		size: 1,
	},
	target: {
		type: Uint8Array,
		size: 1,
	},
	bpm: {
		type: Uint8Array,
		size: 1,
		default: [96]
	},
	armed: {
		type: Uint8Array,
		size: 1
	},
	playing: {
		type: Uint8Array,
		size: 1,
	}
}

export let size = Object.values(arrays).reduce(
	(total, array) => total + array.type.BYTES_PER_ELEMENT * array.size,
	0
)

/**
 * @template {MemoryArrayDefinition} Arrays
 * @typedef {{[Name in keyof Arrays]: InstanceType<Arrays[Name]["type"]>}} MemoryMapOf
 */

/**
 * @typedef {MemoryMapOf<typeof arrays>} MemoryMap
 */

/**
 * @param {SharedArrayBuffer | ArrayBuffer} buffer
 * @returns {MemoryMap}
 */
export function map(buffer) {
	let memory = /** @type {MemoryMap}*/ ({})
	let offset = 0

	for (let [name, arrayInfo] of Object.entries(arrays)) {
		let description = `maping ${name} as ${arrayInfo.type.name} of ${
			arrayInfo.size * arrayInfo.type.BYTES_PER_ELEMENT
		} at ${offset}`
		try {
			// console.debug(description)
			memory[name] = new arrayInfo.type(buffer, offset, arrayInfo.size)
		} catch (error) {
			console.error(error)
			throw new Error(description)
		}
		offset += arrayInfo.size * arrayInfo.type.BYTES_PER_ELEMENT
		if (
			"defaultFill" in arrayInfo &&
			memory[name].every(/** @param {number} n */ n => !n)
		) {
			memory[name].fill(arrayInfo.defaultFill)
		}
	}
	return memory
}

/*
 * load and save are very similar procedures and it is extremely tempting to make
 * them the same function, but they are not the same.
 */

/**
 * @param {MemoryMap} memory
 * @param {MemoryMap} safe
 */
export function load(memory, safe, fields = new Set(Object.keys(safe))) {
	let savedDbVersion = safe.dbversion.at(0) || 0
	for (let migrate of migrations.slice(savedDbVersion, DB_VERSION)) {
		safe = migrate(safe)
	}
	for (let [name, arrayInfo] of Object.entries(arrays)) {
		if (name == "playing") continue
		if (fields.has(name)) {
			try {
				if (!(name in memory)) {
					console.warn(`can't copy ${name} from a safe which does not have it`)
					continue
				}
				if (!(name in safe)) {
					console.warn(`can't copy ${name} to a safe which does not have it`)
					continue
				}
				let content = /** @type {typeof arrayInfo.type.prototype} */ (
					safe[name]
				)
				content = content.subarray(0, memory[name].length)
				if (
					"default" in arrayInfo &&
					content.every(/** @param {number} n */ n => !n)
				) {
					content.set(arrayInfo.default)
				} else if (
					"defaultFill" in arrayInfo &&
					content.every(/** @param {number} n */ n => !n)
				) {
					content.fill(arrayInfo.defaultFill)
				}

				memory[name].set(content)
			} catch (error) {
				console.error(`error loading ${name} from safe`, error)
			}
		} else {
			console.debug(`skipping ${name} because it is not in the fields array`)
		}
	}
}

/**
 * @param {MemoryMap} memory
 * @param {MemoryMap} safe
 */
export function save(memory, safe, fields = new Set(Object.keys(memory))) {
	for (let [name] of Object.entries(arrays)) {
		// console.debug(name)
		if (fields.has(name)) {
			if (name == "playing") continue
			if (name == "dbversion") {
				safe.dbversion.set([DB_VERSION])
			}
			try {
				if (!(name in memory)) {
					console.warn(`can't save ${name} to a safe which does not have it`)
					continue
				}
				if (!(name in safe)) {
					console.warn(`can't save ${name} to a safe which does not have it`)
					continue
				}
				safe[name].set(memory[name])
			} catch (error) {
				console.error(`error loading ${name} from safe`, error)
			}
		} else {
			console.debug(`skipping ${name} because it is not in the fields array`)
		}
	}
}

/**
 * Returns a fresh array buffer that can be loaded
 * @returns {MemoryMap}
 */
export function fresh() {
	let arraybuffer = new ArrayBuffer(size)
	let memory = /** @type {MemoryMap}*/ ({})
	let offset = 0
	for (let [name, arrayInfo] of Object.entries(arrays)) {
		let typedarray = (memory[name] =
			/** @type {typeof arrayInfo.type.prototype} */ (
				new arrayInfo.type(arraybuffer, offset, arrayInfo.size)
			))
		if ("default" in arrayInfo) {
			typedarray.set(arrayInfo.default)
		} else if ("defaultFill" in arrayInfo) {
			typedarray.set(Array(arrayInfo.size).fill(arrayInfo.defaultFill))
		}
		offset += arrayInfo.size * arrayInfo.type.BYTES_PER_ELEMENT
	}
	memory.dbversion.set([DB_VERSION])
	return memory
}
