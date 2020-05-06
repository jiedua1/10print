/*
  randomly generated music. cannot play sounds in node js but browser functionality
  and an adaptation coming soon!
*/

const w = Math.min(50, process.stdout.columns)
// Stores frequency of note and the row that the note is on, starting from the top
// We just have notes from the pentatonic scale for a more aesthetically pleasing sound
// C, D, E, G, A. I tried to use ⓒ, ⓓ, ⓔ, ⓖ, ⓐ, ⓔ but they didn't render well
const notes_table = {'C': [3, 523, '0'],
                    'D': [2, 587, 'o'], 
                    'E': [1, 659, 'o'],
                    'G': [6, 392, 'o'],
                    'A': [5, 440, 'o'],
                    'E3' : [8, 330, 'o']}

// Taken from https://flaviocopes.com/javascript-sleep/
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const reset_color = '\x1b[0m'

// Number of lines on a musical staff. Default: 9
const num_lines = 9

// notes with form ['C', [3, 523, 'o']] which are mapped to indices
// I should probably use objects now but I'm lazy lol 
var notes_list = Object.entries(notes_table)

// Indexed by column number which corresponds to time
var notes = {}

// Throwback to 10print :)
const chars = ['/', '\\']
const colors = ['\x1b[90m', '\x1b[91m', '\x1b[92m', '\x1b[93m',
                '\x1b[94m', '\x1b[95m', '\x1b[96m', '\x1b[97m',]
// stores a list of /, \ characters to make result more aesthetically pleasing!
var old_chars = []

var note_prop_min = 0.2
var note_prop_max = 0.4

// Stores current index of our musical tracker, goes up to w
var cur_pos = 0;

// Generates a bunch of music notes, encoded in format (position, note)
// Each note lasts an eighth note at 120 bpm, so 1/8th of a second

const bpm = 400
const timeout = 60/(2 * bpm) * 1000

/*
// Play da sounds
var audioCtx = new(AudioContext)()

// Function modified from
// https://stackoverflow.com/questions/39200994/how-to-play-a-specific-frequency-with-javascript
// Created by user Giacomo Pigani

function playNote(frequency, duration) {
  // create Oscillator node
  var oscillator = audioCtx.createOscillator();

  oscillator.type = 'square';
  oscillator.frequency.value = frequency; // value in hertz
  oscillator.connect(audioCtx.destination);
  oscillator.start(currentTime);

}
*/

function generateNotes() {
  note_prop = note_prop_min + Math.random() * (note_prop_max - note_prop_min)
  cur_pos = 0
  old_chars = []
  for (var i = 0; i < num_lines; i++) {
    old_chars[i] = []
  }
  notes = {}
  for (var c = 0; c < w; c++) {
    if (Math.random() < note_prop) {
      notes[c] = notes_list[Math.floor(Math.random() * notes_list.length)];
    } 
  }
}

// Checks when given a row and a note's info [3, 523, 'o'] whether 
// a stem should be drawn on the row
function valid_stem(row, note) {
  note_row = note[1][0]
  direction = Math.sign(note_row - 4.1)
  if (direction < 0) { // note pointing downwards
    return row == (note_row + 1) || row == (note_row + 2)
  } else {
    return row == (note_row - 1) || row == (note_row - 2)
  }
}

function draw () {
  setTimeout(draw, timeout)
  if (cur_pos >= w) {
    generateNotes()
  }
  let output = [] // 2d array, holds 9 lines of length up to columns
  for (var i = 0; i < num_lines; i++) {
    output[i] = []
  }

  for (let c = 0; c < w; c++) {
    for (var row = 0; row < num_lines; row ++) {
      if (c == cur_pos) {
        output[row].push('\x1b[44m')
      } else {
        output[row].push(reset_color)
      }
      if (c in notes && row == notes[c][1][0]) {
        output[row].push('\x1b[91m')
        output[row].push(notes[c][1][2])
        if (c == cur_pos) delete notes[c]
      } else if (c in notes && valid_stem(row, notes[c])) { // draw stem of note
        output[row].push('\x1b[94m')
        output[row].push('|')
      } else if (c < cur_pos) {
        output[row].push(old_chars[row][c])
      } else if (row % 2 == 0) {
        output[row].push('-')
      } else {
        output[row].push(' ')
      }
    }
  }
  console.clear()
  console.log('\n')
  for(var i = 0; i < num_lines; i++) {
    console.log(output[i].join(''))
  }
  console.log(reset_color)
  console.log('\n')

  // Add additional column of semirandom / and \ characters
  let fixed_color = null
  if (Math.random() < 0.75) {
    fixed_color = colors[Math.floor(Math.random() * colors.length)]
  } 
  //console.log(cur_pos)
  for (var i = 0; i < num_lines; i++) {
    if (fixed_color != null) {
      old_chars[i].push(fixed_color.concat(chars[Math.floor(Math.random() * chars.length)]))
    } else { // Randomly generate colors
      color = colors[Math.floor(Math.random() * colors.length)]
      old_chars[i].push(color.concat(chars[Math.floor(Math.random() * chars.length)]))
    }
  }
  cur_pos += 1
}

generateNotes()
draw()

