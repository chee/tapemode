/**
 * @typedef {import("../memory/memory.js").MemoryMap} MemoryMap
 * @typedef {(map: MemoryMap) => MemoryMap} Migration
 */

/**
 * @type {Migration[]}
 */
export default [
	// 0 to 1
	map => map,
]
