'use strict'

const createBoard = require('@derhuerst/2048/src/Board')
const esc = require('ansi-escapes')
const ui = require('cli-styles')
const wrap = require('prompt-skeleton')



const bg = []
bg[0] = `\x1b[48;5;231m`
bg[2] = `\x1b[48;5;229m`
bg[4] = `\x1b[48;5;226m`
bg[8] = `\x1b[48;5;220m`
bg[16] = `\x1b[48;5;223m`
bg[32] = `\x1b[48;5;214m`
bg[64] = `\x1b[48;5;217m`
bg[128] = `\x1b[48;5;208m`
bg[256] = `\x1b[48;5;211m`
bg[512] = `\x1b[48;5;205m`
bg[1024] = `\x1b[48;5;202m`
bg[2048] = `\x1b[48;5;196m`



const _2048 = {

	, hasWon: function () {
		const c = this.board.getCells()
		for (let x = 0; x < c.length; x++) {
			for (let y = 0; y < c[0].length; y++) {
				if (c[x][y] === 2048) return true
			}
		}
		return false
	}

	, submit: function () {
		if (!this.hasWon()) return this.bell()

		this.done = true
		this.aborted = false
		this.emit()
		this.render()
		this.out.write('\n')
		this.close()
	}



	, up: function () {
		this.board.up()
		this.render()
	}
	, down: function () {
		this.board.down()
		this.render()
	}
	, left: function () {
		this.board.left()
		this.render()
	}
	, right: function () {
		this.board.right()
		this.render()
	}



	, clear: ui.clear('')

	, render: function (first) {
		const raw = this.board.getCells()

		const board = []
		const black = `\x1b[38;5;16m`
		const reset = '\x1b[0m'

		for (let y = 0; y < raw.length; y++) {
			for (let x = 0; x < raw[y].length; x++) {
				const val = raw[y][x]
				const text = val + ''

				if (!board[x * 2]) board[x * 2] = []
				if (!board[x * 2 + 1]) board[x * 2 + 1] = []

				if (val === 0) {
					board[x * 2][y] = '    '
					board[x * 2 + 1][y] = '    '
				} else {
					const bgc = bg[val]

					board[x * 2][y] = [
						black, bgc, ' ',
						text[0] || ' ',
						text[1] || ' ',
						' ', reset
					].join('')

					board[x * 2 + 1][y] = [
						black, bgc, ' ',
						text[2] || ' ',
						text[3] || ' ',
						' ', reset
					].join('')
				}
			}
		}

		const out = board.map((row, i) => {
			return row.join('  ') + (i % 2 ? '\n' : '')
		}).join('\n')

		this.out.write(this.clear + out)
		this.clear = ui.clear(out)
	}
}



const create2048 = () => {
	const board = createBoard()

	const game = Object.assign(Object.create(_2048), {
		value: null, done: false, aborted: false,
		board
	})

	return wrap(game)
}



module.exports = Object.assign(create2048, {_2048})
