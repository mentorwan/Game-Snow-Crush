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


    function setUpDragListeners() {
        squares.forEach(square => {
          square.addEventListener('dragstart', dragStart);
          square.addEventListener('dragend', dragEnd);
          square.addEventListener('dragover', dragOver);
          square.addEventListener('dragenter', dragEnter);
          square.addEventListener('dragleave', dragLeave);
          square.addEventListener('drop', dragDrop);
          square.addEventListener('touchmove', touchMove);
          square.addEventListener('mousedown', clickStart);
          square.addEventListener('mouseup', clickEnd);
        });
    }

    setUpDragListeners();
      
    //Drag the snows
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    let touchX, touchY;

    let dragging = false;

    function dragStart(e) {
        if (e.type === 'touchstart') {
            const touch = e.touches[0];
            touchX = touch.clientX;
            touchY = touch.clientY;
        } else {
            touchX = e.clientX;
            touchY = e.clientY;
        }

        dragging = true;
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    function touchMove(e) {
        e.preventDefault();
      
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        const diffX = currentX - touchX;
        const diffY = currentY - touchY;
      
        if (Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            // drag right
            if (squareIdBeingDragged % width < width - 1) {
              const nextSquare = squares[squareIdBeingDragged + 1];
              dragAndSwap(nextSquare);
            }
          } else {
            // drag left
            if (squareIdBeingDragged % width > 0) {
              const nextSquare = squares[squareIdBeingDragged - 1];
              dragAndSwap(nextSquare);
            }
          }
        } else {
          if (diffY > 0) {
            // drag down
            if (squareIdBeingDragged + width < width * width) {
              const nextSquare = squares[squareIdBeingDragged + width];
              dragAndSwap(nextSquare);
            }
          } else {
            // drag up
            if (squareIdBeingDragged - width >= 0) {
              const nextSquare = squares[squareIdBeingDragged - width];
              dragAndSwap(nextSquare);
            }
          }
        }
      
        touchX = currentX;
        touchY = currentY;
      }
      
      function dragOver(e) {
        e.preventDefault();
        // desktop drag
        // console.log(this.id, 'dragover');
      }
      
      

      


    function dragOver(e) {
        e.preventDefault();

        if (e.type === 'touchmove') {
            const touch = e.touches[0];
            const currentX = touch.clientX;
            const currentY = touch.clientY;
            const diffX = currentX - touchX;
            const diffY = currentY - touchY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    // drag right
                    if (squareIdBeingDragged % width < width - 1) {
                        const nextSquare = squares[squareIdBeingDragged + 1];
                        dragAndSwap(nextSquare);
                    }
                } else {
                    // drag left
                    if (squareIdBeingDragged % width > 0) {
                        const nextSquare = squares[squareIdBeingDragged - 1];
                        dragAndSwap(nextSquare);
                    }
                }
            } else {
                if (diffY > 0) {
                    // drag down
                    if (squareIdBeingDragged + width < width * width) {
                        const nextSquare = squares[squareIdBeingDragged + width];
                        dragAndSwap(nextSquare);
                    }
                } else {
                    // drag up
                    if (squareIdBeingDragged - width >= 0) {
                        const nextSquare = squares[squareIdBeingDragged - width];
                        dragAndSwap(nextSquare);
                    }
                }
            }

            touchX = currentX;
            touchY = currentY;
        } else {
            // desktop drag
            //console.log(this.id, 'dragover');
        }
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        // Login for hnadling drag leave
    }
    


    function dragAndSwap(nextSquare) {
        colorBeingReplaced = nextSquare.style.backgroundImage;
        squareIdBeingReplaced = parseInt(nextSquare.id);
      
        nextSquare.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragDrop() {
        console.log(this.id, 'dragdrop')
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        console.log(this.id, 'dragend')
        dragging = false;
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

    
    let clickedSquare = null;

    function areNeighbors(id1, id2) {
        const diff = Math.abs(id1 - id2);
        return diff === 1 || diff === width;
    }

    function clickStart() {
    
    console.log(this.id, 'mousedown')
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id);
    clickedSquare = this;
    }

    function clickEnd() {
        console.log(this.id, 'mouseup');
        if (!dragging && clickedSquare) {
          const squareIdBeingReplaced = parseInt(this.id);
          if (areNeighbors(squareIdBeingDragged, squareIdBeingReplaced)) {
            dragAndSwap(this);
          }
          clickedSquare = null;
        }
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

    // call dragEnd function on touchend event (needed for iOS)
    squares.forEach(square => {
        square.addEventListener('touchend', dragEnd);
    });


    //Checking for matches

    //Check for row of Four
    function checkRowForFour() {
        for (let i = 0; i < 60; i++) {
            let rowofFour = [i, i+1, i+2, i+3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
            if (notValid.includes(i))  continue;

            if (rowofFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                rowofFour.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
            }
        }
    }
    checkRowForFour()

    //Check for Column of Four
    function checkColumnForFour() {
        for (let i = 0; i < 47; i++) {
            let columnofFour = [i, i+width, i+width*2, i+width*3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (columnofFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                columnofFour.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
            }
        }
    }
    checkColumnForFour()

    //Check for row of Three
    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {
            let rowofThree = [i, i+1, i+2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if (notValid.includes(i))  continue;

            if (rowofThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowofThree.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
            }
        }
    }
    checkRowForThree()

    //Check for Column of Three
    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            let columnofThree = [i, i+width, i+width*2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (columnofThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                columnofThree.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
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

});
