$(document).ready(function () {

    // Globals
    var rotation = [0, 90, 180, 270];
    var info = $("#info");
    var phase = 0;
    var isSolved = false;
    var mkContBtn = $("<button id='continue'>Continue</button>");
    var mkRestartBtn = $("<button id='restart'>Play Again</button>");
    var gameSpaceFiller = "<div class='goal-container'><div id='goal-grid'></div></div><div class='puzzle-container'><div id='puzzle-grid'></div></div>"

    var time = 0;
    var clock = undefined;
    var timeByTiles;

    //puzzles
    const puzzle1 = [270, 0, 90, 180];
    const puzzle2 = [90, 270, 0, 270, 90, 180, 180, 0, 270];
    const puzzle3 = [0, 270, 0, 180, 90, 180, 0, 270, 0];
    const puzzle4 = [270, 270, 0, 90, 180, 90, 0, 270, 90];
    const puzzle5 = [0, 270, 0, 270, 90, 180, 90, 180, 270, 90, 180, 0, 180, 0, 270, 90];
    const puzzle6 = [0, 180, 90, 180, 180, 0, 180, 270, 270, 90, 0, 180, 180, 0, 270, 0];
    const puzzle7 = [180, 90, 180, 90, 180, 270, 0, 270, 0, 270, 90, 180, 90, 180, 90, 0, 270, 0, 270, 0, 180, 90, 180, 90, 180];
    var puzzle8 = [];
    var puzzle9 = [];
    var puzzle10 = [];
    var allPuzzles = [0, puzzle1, puzzle2, puzzle3, puzzle4, puzzle5, puzzle6, puzzle7, puzzle8, puzzle9, puzzle10]
    let puzzleRoll = [];


    // Functions

    function stopTimer() {
        clearInterval(clock);
        clock = undefined;
    }

    function countUp() {
        time++;
        $("#timer").html(time + " seconds");
    }

    function runTimer() {
        clock = setInterval(countUp, 1000)
    }


    function startScreen() {
        $("#game-space").empty();
        if (phase === (allPuzzles.length - 1)) {
            console.log("Time?: " + timeByTiles * 2);
            if (time < (timeByTiles * 2)) {
                info.html("***");
            }
            else if (time > (timeByTiles * 3)) {
                info.html("*");
            }
            else {
                info.html("**");
            }
            info.append("<p>That's all of the puzzles!</p>")
            info.append(mkRestartBtn);
            // start puzzle when you click continue
            $("#restart").on("click", function () {
                restartGame();
            });
        }
        else {
            if (phase === 0) {
                info.html(`<p>Make the puzzle match
                    the image on the left before time runs out!</p>`);
            }
            else {
                console.log("Time?: " + timeByTiles * 2);
                if (time < (timeByTiles * 2)) {
                    info.html("***");
                }
                else if (time > (timeByTiles * 3)) {
                    info.html("*");
                }
                else {
                    info.html("**");
                }
                info.append("<p>Great job! " +
                    "Move on to the next puzzle?</p>");
            }
            info.append(mkContBtn);
            // start puzzle when you click continue
            $("#continue").on("click", function () {
                startPuzzle();
            });
            phase++;
        }
    }; // end startScreen


    function startPuzzle() {
        time = 0;
        isSolved = false;
        info.empty();
        puzzleRoll = [];
        if (phase > 6) {
            getRandom25(allPuzzles[phase]);
        }
        $("#game-space").html(gameSpaceFiller);
        puzzle(allPuzzles[phase], puzzleRoll, phase);
    };


    puzzle = (answerArr, puzArr, p) => {
        console.log("puzzle start");
        // Set game up
        isSolved = false;
        timeByTiles = answerArr.length;
        runTimer();
        $("#timer").html(time + " seconds");
        //Create solved puzzle image
        for (var i = 0; i < answerArr.length; i++) {
            $("#goal-grid").addClass(`puzzle-${answerArr.length}x`).append(
                $("<div id='static-block' class='block-color puz-" + p + "-color'></div>").css('transform', 'rotate(' + answerArr[i] + 'deg)')
            )
        }
        //Create randomized puzzle
        for (var i = 0; i < answerArr.length; i++) {
            var r = Math.floor(Math.random() * rotation.length);
            puzArr[i] = rotation[r];
            $("#puzzle-grid").addClass(`puzzle-${answerArr.length}x`).append(
                $("<div id='block' class='block-color puz-" + p + "-color'></div>").attr("value", i).css('transform', 'rotate(' + puzArr[i] + 'deg)')
            )
        }
        // No self-solving puzzles!
        checkForSolved(answerArr, puzzleRoll); {
            if (isSolved === true) {
                puzArr[0] = 0;
                puzArr[1] = 0;
                puzArr[2] = 0;
                puzArr[3] = 0;
                isSolved = false;
            }
        }
        // When you click a tile...
        $(document.body).on("click", "#block", function () {
            var val = $(this).attr("value");
            var r = rotation.indexOf(puzzleRoll[val]);
            if (r === 3) {
                $(this).css('transform', 'rotate(' + rotation[0] + 'deg)');
                puzzleRoll[val] = rotation[0];
            } else {
                $(this).css('transform', 'rotate(' + rotation[r + 1] + 'deg)');
                puzzleRoll[val] = rotation[r + 1];
            }
            console.log(
            "\n puzzleRoll: " + puzzleRoll +
            "\n ....puzArr: " + puzArr
            );

            checkForSolved(answerArr, puzzleRoll);
            /* BUG: 
            Using 'puzzleRoll' in 'checkForSolved' results in a bug where you can use the answer
            of any previous puzzle that uses the same amount of tiles to pass the phase.
            Using 'puzArr' will fix this, however, 'puzArr' will let the player pass the phase
            if they rotate a title more than 180 degrees.
            TODO: figure out a way around this.
            */

            // console.log(
            //     `\n Puzzle Answer: ` + answerArr.join(", ") +
            //     `\n Puzzle Status: ` + puzArr.join(", "));

            if (isSolved === true) {
                console.log("The puzzle was solved!");
                stopTimer();
                // ANIMATION FOR WIN HERE
                startScreen();
            }
        }); // end on-click
    };

    function checkForSolved(answr, puz) {
        console.log(
            "\n puzzleRoll: " + puzzleRoll +
            "\n .......puz: " + puz
            );
        for (var j = answr.length; j--;) {
            if (answr[j] !== puz[j]) {
                return;
            }
        }
        isSolved = true;
        return isSolved;
    }

    function getRandom25(sevenUp) {
        for (var i = 0; i < 25; i++) {
            var r = Math.floor(Math.random() * rotation.length);
            sevenUp[i] = rotation[r];
        }
        return sevenUp;
    };


    function restartGame() {
        isSolved = false;
        phase = 0;
        puzzleRoll = [];
        info.empty();
        startScreen();
    }


    // Run game

    startScreen();


}); // end doc.ready