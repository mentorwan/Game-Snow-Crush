document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const width = 8
    const squares = []
    let score = 0

    const snowColors = [
        'url(images/s01.png)',   //red
        'url(images/s02.png)',   //yellow
        'url(images/s03.png)',   //orange
        'url(images/s04.png)',   //purple
        'url(images/s05.png)',   //green
        'url(images/s06.png)'    //blue
    ]

    //Create Board
    function createBoard() {
      for (let i = 0; i < width*width; i++) {
        const square = document.createElement('div')
        square.setAttribute('draggable', true)
        square.setAttribute('id', i)
        let randomColor = Math.floor(Math.random() * snowColors.length)
        square.style.backgroundImage = snowColors[randomColor]
        grid.appendChild(square)
        squares.push(square)
      }
    }
    createBoard ()

//Drag the snows
let colorBeingDragged
let colorBeingReplaced
let squareIdBeingDragged
let squareIdBeingReplaced

squares.forEach(square => square.addEventListener('dragstart', dragStart))
squares.forEach(square => square.addEventListener('dragend', dragEnd))
squares.forEach(square => square.addEventListener('dragover', dragOver))
squares.forEach(square => square.addEventListener('dragenter', dragEnter))
squares.forEach(square => square.addEventListener('dragleave', dragLeave))
squares.forEach(square => square.addEventListener('drop', dragDrop))

function dragStart() {
  colorBeingDragged = this.style.backgroundImage
  squareIdBeingDragged = parseInt(this.id)
  console.log(colorBeingDragged)
  console.log(this.id, 'dragstart')
}

function dragOver(e) {
    e.preventDefault()
    console.log(this.id, 'dragover')
}

function dragEnter(e) {
    e.preventDefault()
    console.log(this.id, 'dragenter')
}

function dragLeave() {
    console.log(this.id, 'dragleave')
}

function dragDrop() {
    console.log(this.id, 'dragdrop')
    colorBeingReplaced = this.style.backgroundImage
    squareIdBeingReplaced = parseInt(this.id)
    this.style.backgroundImage = colorBeingDragged
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
}

function dragEnd() {
    console.log(this.id, 'dragend')
    // what is a valid move?
    let validMoves = [
        squareIdBeingDragged -1, 
        squareIdBeingDragged -width, 
        squareIdBeingDragged +1, 
        squareIdBeingDragged +width, 
    ]
    let validMove = validMoves.includes(squareIdBeingReplaced)

    if (squareIdBeingReplaced && validMove) {
        squareIdBeingReplaced = null
    } else if (squareIdBeingReplaced && !validMove) {
        squares [squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
        squares [squareIdBeingDragged].style.backgroundImage = colorBeingDragged
    } else  squares [squareIdBeingDragged].style.backgroundImage = colorBeingDragged
}

//drop snow once some have been cleared
function moveDown() {
    for (i = 0; i < 55; i++) {
        if (squares[i + width].style.backgroundImage === '') {
            squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
            squares[i].style.backgroundImage = ''
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)
            if (isFirstRow && squares[i].style.backgroudColor === '') {
                let randomColor = Math.floor(Math.random() * snowColors.length)
                squares[i].style.backgroundImage = snowColors[randomColor]
            }
        }
    }
}

//Checking for matches

//Check for row of Four
function checkRowForFour() {
    for (i = 0; i < 60; i++) {
      let rowofFour = [i, i+1, i+2, i+3]
      let decidedColor = squares[i].style.backgroundImage
      const isBlank = squares[i].style.backgroundImage === ''

      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
      if (notValid.includes(i))  continue

      if (rowofFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
         score += 4
         scoreDisplay.innerHTML = score
         rowofFour.forEach(index => {
            squares[index].style.backgroundImage = ''
         })
        }
    }
}
checkRowForFour()

//Check for Column of Four
function checkColumnForFour() {
    for (i = 0; i < 47; i++) {
      let columnofFour = [i, i+width, i+width*2, i+width*3]
      let decidedColor = squares[i].style.backgroundImage
      const isBlank = squares[i].style.backgroundImage === ''

      if (columnofFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
         score += 4
         scoreDisplay.innerHTML = score
         columnofFour.forEach(index => {
            squares[index].style.backgroundImage = ''
         })
        }
    }
}
checkColumnForFour()

//Check for row of Three
function checkRowForThree() {
    for (i = 0; i < 61; i++) {
      let rowofThree = [i, i+1, i+2]
      let decidedColor = squares[i].style.backgroundImage
      const isBlank = squares[i].style.backgroundImage === ''

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
      if (notValid.includes(i))  continue

      if (rowofThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
         score += 3
         scoreDisplay.innerHTML = score
         rowofThree.forEach(index => {
            squares[index].style.backgroundImage = ''
         })
        }
    }
}
checkRowForThree()


//Check for Column of Three
function checkColumnForThree() {
    for (i = 0; i < 47; i++) {
      let columnofThree = [i, i+width, i+width*2]
      let decidedColor = squares[i].style.backgroundImage
      const isBlank = squares[i].style.backgroundImage === ''

      if (columnofThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
         score += 3
         scoreDisplay.innerHTML = score
         columnofThree.forEach(index => {
            squares[index].style.backgroundImage = ''
         })
        }
    }
}
checkColumnForThree()

window.setInterval(function(){
   moveDown()
   checkRowForFour()
   checkColumnForFour()
   checkRowForThree()
   checkColumnForThree()
}, 100)




})