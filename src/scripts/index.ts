const TIME_LIMIT = 1;
document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.grid');
    const width = 8;
    // const maxScoreReached = 100;
    const squares: HTMLDivElement[] = [];
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    const candyColors = [
        'url(images/red-candy.png)',
        'url(images/yellow-candy.png)',
        'url(images/orange-candy.png)',
        'url(images/purple-candy.png)',
        'url(images/green-candy.png)',
        'url(images/blue-candy.png)',
    ];
    //create board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            //set it draggable
            square.draggable = true;
            square.id = i.toString();
            const randomColor = Math.floor(
                Math.floor(
                    Math.random() * candyColors.length
                )
            );
            square.style.backgroundImage =
                candyColors[randomColor];
            grid?.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    // drag candies
    let squareBeingDragged: string;
    let squareBeingReplaced: string | null;
    let squareIdBeingDragged: number;
    let squareIdBeingReplaced: number;
    squares.forEach((square: HTMLDivElement) => {
        square.addEventListener('dragstart', dragStart);
    });
    squares.forEach((square: HTMLDivElement) => {
        square.addEventListener('dragend', dragEnd);
    });
    squares.forEach((square: HTMLDivElement) => {
        square.addEventListener('dragenter', dragEnter);
    });
    squares.forEach((square: HTMLDivElement) => {
        square.addEventListener('dragover', dragOver);
    });
    squares.forEach((square: HTMLDivElement) => {
        square.addEventListener('dragleave', dragLeave);
    });
    squares.forEach((square: HTMLDivElement) => {
        square.addEventListener('drop', drop);
    });
    //drag functions

    function dragStart(this: HTMLElement) {
        squareBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }
    function dragEnd(this: HTMLElement) {
        //check what is valid move  ?
        const validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width,
        ];
        const isValidMove = validMoves.includes(
            squareIdBeingReplaced
        );
        if (squareBeingReplaced && isValidMove) {
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = squareBeingReplaced;
            squares[
                squareIdBeingReplaced
            ].style.backgroundImage = squareBeingDragged;
        } else if (squareBeingReplaced && !isValidMove) {
            squareBeingReplaced = null;
        } else {
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = squareBeingDragged;
        }
    }
    function dragEnter(this: HTMLElement, e: Event) {
        e.preventDefault();
    }
    function dragOver(this: HTMLElement, e: Event) {
        e.preventDefault();
    }
    function dragLeave(this: HTMLElement, e: Event) {
        e.preventDefault();
    }
    function drop(this: HTMLElement) {
        squareBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
    }
    //check the candy
    //row wise
    function matchingRowCandy() {
        let stack: Array<HTMLElement> = [];
        let decidedColor = squares[0].style.backgroundImage;
        stack.push(squares[0]);
        for (let i = 1; i <= width * width - 3; i++) {
            const matchColor =
                squares[i].style.backgroundImage;
            const rowEnd = (i + 1) % width === 0;
            if (decidedColor === matchColor) {
                stack.push(squares[i]);
            } else {
                if (stack.length >= 3) {
                    makeCandyNull(stack);
                }
                decidedColor =
                    squares[i].style.backgroundImage;
                stack = [];
                stack.push(squares[i]);
            }
            if (rowEnd && stack.length >= 3) {
                makeCandyNull(stack);
                stack = [];
            }
            if (rowEnd) {
                stack = [];
            }
        }
    }
    //check the candy
    //columnWise
    function matchingColumnCandy() {
        let stack: Array<HTMLElement> = [];
        for (let i = 0; i < width; i++) {
            let decidedColor =
                squares[i].style.backgroundImage;
            stack.push(squares[i]);
            for (
                let j = i + width;
                j < width * width;
                j = j + width
            ) {
                const matchColor =
                    squares[j].style.backgroundImage;
                if (decidedColor === matchColor) {
                    stack.push(squares[j]);
                } else {
                    if (stack.length >= 3) {
                        makeCandyNull(stack);
                    }
                    decidedColor =
                        squares[j].style.backgroundImage;
                    stack = [];
                    stack.push(squares[j]);
                }
            }
            if (stack.length >= 3) {
                makeCandyNull(stack);
            }
            stack = [];
        }
    }

    function makeCandyNull(squares: Array<HTMLElement>) {
        score = score + squares.length;
        while (squares.length > 0) {
            const square = squares.pop();
            if (square) {
                square.style.backgroundImage = '';
            }
        }
        if (scoreDisplay) {
            scoreDisplay.innerHTML = score.toString();
        }
    }

    //candy move down
    function moveDown() {
        for (let i = 0; i < width * width - width; i++) {
            if (
                squares[i + width].style.backgroundImage ===
                ''
            ) {
                squares[i + width].style.backgroundImage =
                    squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
            }
            const firstRow = i < width;
            if (
                firstRow &&
                squares[i].style.backgroundImage === ''
            ) {
                const randomColor = Math.floor(
                    Math.random() * candyColors.length
                );
                squares[i].style.backgroundImage =
                    candyColors[randomColor];
            }
        }
    }
    // check max score and exit
    // function checkMaxScoreReached() {
    //     if (score > maxScoreReached) {
    //         alert('game over, congrats');
    //         score = 0;
    //     }
    // }
    let timer: number;
    let startTime: number;
    let minutes: string;
    let seconds: string;
    let timeElapsedMinutes: number;
    function start() {
        const findStartTime: string =
            localStorage.getItem('startTime')?.toString() ||
            Date.now().toString();
        startTime = parseInt(findStartTime);
        localStorage.setItem(
            'startTime',
            startTime.toString()
        );
        timer = window.setInterval(() => {
            clockTick();
        }, 100);
    }

    function clockTick() {
        const currentTime: number = Date.now();
        const timeElapsed: Date = new Date(
            currentTime - startTime
        );
        // let hours: number = timeElapsed.getUTCHours();
        timeElapsedMinutes =
            TIME_LIMIT - timeElapsed.getUTCMinutes() - 1;
        const timeElapsedSeconds =
            60 - timeElapsed.getUTCSeconds();
        // const timeElapsedMs = timeElapsed.getUTCMilliseconds();
        minutes =
            timeElapsedMinutes > 9
                ? timeElapsedMinutes.toString()
                : '0' + timeElapsedMinutes.toString();
        seconds =
            timeElapsedSeconds > 9
                ? timeElapsedSeconds.toString()
                : '0' + timeElapsedSeconds.toString();
        // const ms: string =
        //     timeElapsedMs > 9
        //         ? timeElapsedMs.toString()
        //         : '0' + timeElapsedMs.toString();
        const display = document.getElementById('timer');

        if (display?.innerHTML) {
            display.innerHTML = minutes + ' : ' + seconds;
        }
    }
    function stop() {
        alert('Game Over. Your score is ' + score);
        const display = document.getElementById('timer');
        if (display?.innerHTML) {
            display.innerHTML = TIME_LIMIT + ' : 00';
        }
        if (scoreDisplay) {
            score = 0;
            scoreDisplay.innerHTML = score.toString();
        }
        clearInterval(timer);
        localStorage.removeItem('startTime');
        start();
    }
    start();
    const stopTimer = document.getElementById('stopTimer');
    if (stopTimer) {
        stopTimer.addEventListener('click', function () {
            if (
                confirm(
                    'Are you sure you want to cancel the game?'
                )
            ) {
                stop();
            }
        });
    }

    function newGameWhenTimeOut() {
        if (timeElapsedMinutes < 0) {
            timeElapsedMinutes = 0;
            stop();
        }
    }

    setInterval(() => {
        newGameWhenTimeOut();
        matchingRowCandy();
        matchingColumnCandy();
        // checkMaxScoreReached();
        moveDown();
    }, 100);
});
