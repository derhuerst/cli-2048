'use strict'

const createBoard = require('@derhuerst/2048/src/Board')
const esc = require('ansi-escapes')
const ui = require('cli-styles')
const style = require('ansi-styles')
const wrap = require('prompt-skeleton')



// const fg = []
// fg[0] = 102
// fg[2] = 102
// fg[4] = 102
// fg[8] = 231
// fg[16] = 231
// fg[32] = 231
// fg[64] = 231
// fg[128] = 231
// fg[256] = 231
// fg[512] = 231
// fg[1024] = 231
// fg[2048] = 231

// const bg = []
// bg[0] = 224
// bg[2] = 224
// bg[4] = 224
// bg[8] = 216
// bg[16] = 216
// bg[32] = 210
// bg[64] = 209
// bg[128] = 222
// bg[256] = 222
// bg[512] = 222
// bg[1024] = 221
// bg[2048] = 221

const fg = []
fg[0] = '#776e65'
fg[2] = '#776e65'
fg[4] = '#776e65'
fg[8] = '#f9f6f2'
fg[16] = '#f9f6f2'
fg[32] = '#f9f6f2'
fg[64] = '#f9f6f2'
fg[128] = '#f9f6f2'
fg[256] = '#f9f6f2'
fg[512] = '#f9f6f2'
fg[1024] = '#f9f6f2'
fg[2048] = '#f9f6f2'

const bg = []
bg[0] = '#eee4da'
bg[2] = '#eee4da'
bg[4] = '#eee1c9'
bg[8] = '#f3b27a'
bg[16] = '#f69664'
bg[32] = '#f77c5f'
bg[64] = '#f75f3b'
bg[128] = '#edd073'
bg[256] = '#edcc62'
bg[512] = '#edc950'
bg[1024] = '#edc53f'
bg[2048] = '#edc22e'



const _2048 = {

	  abort: function () {
		this.done = this.aborted = true
		this.emit()
		this.render()
		this.out.write('\n')
		this.close()
	}

	, submit: function () {
		const c = this.board.getCells()
		for (let x = 0; x < c.length; x++) {
			for (let y = 0; y < c[0].length; y++) {
				if (c[x][y] > 0) return this.bell()
			}
		}

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
		const black = style.color.ansi256.black

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
					const fgc = style.color.ansi256.hex(fg[val])
					const bgc = style.bgColor.ansi256.hex(bg[val])
					const reset = style.color.close + style.bgColor.close

					board[x * 2][y] = [
						fgc, bgc, ' ',
						text[0] || ' ',
						text[1] || ' ',
						' ', reset
					].join('')

					board[x * 2 + 1][y] = [
						fgc, bgc, ' ',
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
