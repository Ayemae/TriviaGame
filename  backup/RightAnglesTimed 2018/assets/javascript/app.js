$(document).ready(function () {

    // Globals
    var rotation = [0, 90, 180, 270];
    var info = $("#info");
    var solved = 0;
    var unsolved = 0;
    var phase = 0;
    var isSolved = false;
    var mkContBtn = $("<button id='continue'>Continue</button>");
    var mkRestartBtn = $("<button id='restart'>Play Again</button>");
    var gameSpaceFiller = "<div class='goal-container'><div id='goal-grid'></div></div><div class='puzzle-container'><div id='puzzle-grid'></div></div>"

    var time = 32;
    var clock = undefined;

    //puzzles
    var puzzle1 = [270, 0, 90, 180];
    var puzzle2 = [0, 270, 0, 180, 90, 180, 0, 270, 0];
    var puzzle3 = [270, 270, 0, 90, 180, 90, 0, 270, 90];
    var puzzle4 = [0, 270, 0, 270, 90, 180, 90, 180, 270, 90, 180, 0, 180, 0, 270, 90];
    var puzzle5 = [0, 180, 90, 180, 180, 0, 180, 270, 270, 90, 0, 180, 180, 0, 270, 0];
    var puzzle6 = [180, 270, 0, 90, 180, 270, 180, 90, 0, 270, 90, 180, 270, 0, 90, 0, 270, 180, 90, 0, 180, 270, 0, 90, 180];
    var puzzle7 = [];
    var puzzle8 = [];
    var puzzle9 = [];
    var puzzle10 = [];
    var allPuzzles = [0, puzzle1, puzzle2, puzzle3, puzzle4, puzzle5, puzzle6, puzzle7, puzzle8, puzzle9, puzzle10]
    var puzzleRoll = [];


    // Functions

    function stopTimer() {
        clearInterval(clock);
        clock = undefined;
        time = 0;
    }

    function countDown() {
        time--;
        $("#timer").html(time + " seconds");
        if ((time === 0) || (isSolved === true)) {
            stopTimer();
            startScreen();
            $("#timer").html(time + " seconds");
            if ((time === 0) && (isSolved === false)) {
                unsolved++;
            }
        }
    }

    function runTimer() {
        clock = setInterval(countDown, 1000)
    }

    function startScreen() {
        $("#game-space").empty();
        if (phase === (allPuzzles.length - 1)) {
            info.html("<p>That's all the puzzles!</p>" +
                "<p>Let's see how you did:</p>")
            info.append(`<div class='solved'>Solved: ${solved} </div><div class='unsolved'>Unsolved: ${unsolved}</div>`);
            info.append(mkRestartBtn);
            // restart button
            $("#restart").on("click", function () {
                restartGame();
            });
        }
        else {
            if (phase === 0) {
                info.html("<p>Make the puzzle match " +
                    "the image on the left before time runs out!</p>");
            }
            else {
                if (isSolved === false) {
                    info.html("<p>Too bad. " +
                        "Continue anyway?</p>");
                }
                else {
                    info.html("<p>Great job! " +
                        "Move on to the next puzzle?</p>");
                }
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
        isSolved = false;
        info.empty();
        puzzleRoll = [];
        if (phase > 6) {
            getRandom25(allPuzzles[phase]);
        }
        $("#game-space").html(gameSpaceFiller);
        puzzle(allPuzzles[phase], puzzleRoll, phase);
    };


    function puzzle(answerArr, puzArr, p) {
        // Set game up
        time = (answerArr.length * 2);
        console.log(answerArr.length);
        runTimer();
        $("#timer").html(time + " seconds");
        //Create solved puzzle image
        for (var i = 0; i < answerArr.length; i++) {
            $("#goal-grid").addClass("puzzle-" + p).append(
                $("<div id='static-block' class='block-color puz-" + p + "-color'></div>").css('transform', 'rotate(' + answerArr[i] + 'deg)')
            )
        }
        //Create randomized puzzle
        for (var i = 0; i < answerArr.length; i++) {
            var r = Math.floor(Math.random() * rotation.length);
            puzArr[i] = rotation[r];
            $("#puzzle-grid").addClass("puzzle-" + p).append(
                $("<div id='block' class='block-color puz-" + p + "-color'></div>").attr("value", i).css('transform', 'rotate(' + puzArr[i] + 'deg)')
            )
        }
        // No self-solving puzzles!
        checkForSolved(allPuzzles[phase], puzzleRoll); {
            if (isSolved === true) {
                puzArr[0] = puzArr[1] = puzArr[2] = puzArr[3] = 0;
                isSolved = false;
            }
        }
        // When you click a tile...
        $(document.body).on("click", "#block", function () {
            if (isSolved === false) {
                var val = $(this).attr("value");
                var r = rotation.indexOf(puzArr[val]);
                if (r === 3) {
                    $(this).css('transform', 'rotate(' + rotation[0] + 'deg)');
                    puzArr[val] = rotation[0];
                } else {
                    $(this).css('transform', 'rotate(' + rotation[r + 1] + 'deg)');
                    puzArr[val] = rotation[r + 1];
                }
                checkForSolved(allPuzzles[phase], puzzleRoll);
                console.log(puzzleRoll.join(", "));
            } // end if solved
        }); // end on-click
        return isSolved;
    };

    function checkForSolved(answr, puz) {
        for (var j = answr.length; j--;) {
            if (answr[j] !== puz[j]) {
                return;
            }
        }
        isSolved = true;
        solved++;
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
        solved = 0;
        unsolved = 0;
        puzzleRoll = [];
        info.empty();
        startScreen();
    }


    // Run game

    startScreen();


}); // end doc.ready