#!/usr/bin/env node
'use strict'

const mri = require('mri')

const pkg = require('./package.json')
const game = require('.')

const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'version']
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    2048
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`cli-2048 v${pkg.version}\n`)
	process.exit(0)
}

game()
.on('abort', () => process.exit(1))
