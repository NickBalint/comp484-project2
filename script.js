// =============================================================================
// script.js — Giga Pet App + Chrome DevTools Practice Lab
//
// STRUCTURE:
//   1. Pet app core (Pet constructor, buttons, history, animations)
//   2. DevTools Console logging demos  (logInfoMessage … clearConsole)
//   3. Browser-logged error demos      (cause404Error, causeTypeError, causeViolation)
//   4. JavaScript debugging demo       (runBuggyCalculator, computeSum, applyCalculatorFix)
//
// HOW TO PRESENT:
//   - Open Chrome DevTools with Cmd+Option+J (Mac) / Ctrl+Shift+J (Windows)
//   - Keep the Console tab visible while clicking each button in the lab section
// =============================================================================

$(function () {
  // Object constructor for creating multiple pets with independent stats.
  function Pet(name, weight, happiness, cleanliness, imageSrc) {
    this.name = name;
    this.weight = weight;
    this.happiness = happiness;
    this.cleanliness = cleanliness;
    this.imageSrc = imageSrc;
  }

  var pets = [
    new Pet('Scout', 18, 10, 65, 'images/scout.svg'),
    new Pet('Mochi', 14, 12, 72, 'images/mochi.svg'),
    new Pet('Rocket', 22, 8, 54, 'images/rocket.svg')
  ];

  var currentPetIndex = 0;
  var pet_info = pets[currentPetIndex];
  var actionHistory = [];
  var maxHistoryItems = 5;

  buildPetSelector();

  checkAndUpdatePetInfoInHtml();

  $('.treat-button').on('click', clickedTreatButton);
  $('.play-button').on('click', clickedPlayButton);
  $('.exercise-button').on('click', clickedExerciseButton);
  $('.groom-button').on('click', clickedGroomButton);
  $('.pet-select').on('change', changedPetSelection);
  // --- DevTools Lab: wire up every button in the practice lab section ---
  $('.log-info-btn').on('click', logInfoMessage);        // console.info demo
  $('.log-warning-btn').on('click', logWarningMessage);  // console.warn + stack trace demo
  $('.log-error-btn').on('click', logErrorMessage);      // console.error demo
  $('.log-table-btn').on('click', logTableMessage);      // console.table demo
  $('.log-group-btn').on('click', logGroupMessage);      // console.group / groupEnd demo
  $('.log-custom-btn').on('click', logCustomMessage);    // %c CSS styling in console demo
  $('.clear-console-btn').on('click', clearConsole);     // console.clear demo
  $('.cause-404-btn').on('click', cause404Error);        // browser-logged network error demo
  $('.cause-typeerror-btn').on('click', causeTypeError); // browser-logged TypeError demo
  $('.cause-violation-btn').on('click', causeViolation); // browser-logged Violation demo
  $('.run-buggy-calc-btn').on('click', runBuggyCalculator); // reproduce the string-concat bug
  $('.apply-fix-btn').on('click', applyCalculatorFix);      // apply the parseInt fix
  $('.reset-fix-btn').on('click', resetCalculatorFix);      // reset back to buggy mode

  // Tracks whether the calculator bug has been fixed; starts false (buggy).
  var useFixedCalculator = false;

  function buildPetSelector() {
    var $petSelect = $('.pet-select');

    $.each(pets, function (index, pet) {
      $petSelect.append(
        $('<option></option>')
          .val(index)
          .text(pet.name)
      );
    });

    $petSelect.val(currentPetIndex);
  }

  function changedPetSelection() {
    currentPetIndex = Number($('.pet-select').val());
    pet_info = pets[currentPetIndex];
    checkAndUpdatePetInfoInHtml();
    showPetComment('Ready for action. What should we do now?');
    addHistory('Switched to ' + pet_info.name);
  }

  function clickedTreatButton() {
    pet_info.happiness += 2;
    pet_info.weight += 1;
    pet_info.cleanliness -= 1;
    checkAndUpdatePetInfoInHtml();
    addHistory('Treat given');
    showPetComment('Yum! Treat time is my favorite.');
    animatePet('12px');
  }

  function clickedPlayButton() {
    pet_info.happiness += 3;
    pet_info.weight -= 1;
    pet_info.cleanliness -= 2;
    checkAndUpdatePetInfoInHtml();
    addHistory('Played together');
    showPetComment('That game was awesome. Again!');
    animatePet('20px');
  }

  function clickedExerciseButton() {
    pet_info.happiness -= 1;
    pet_info.weight -= 2;
    pet_info.cleanliness -= 3;
    checkAndUpdatePetInfoInHtml();
    addHistory('Exercise session');
    showPetComment('Whew... cardio is hard work.');
    animatePet('6px');
  }

  // New action button behavior: grooming increases cleanliness and mood.
  function clickedGroomButton() {
    pet_info.cleanliness += 12;
    pet_info.happiness += 1;
    checkAndUpdatePetInfoInHtml();
    addHistory('Groomed fur');
    showPetComment('Fresh and fluffy! Thanks for grooming me.');
    animatePet('10px');
  }

  function checkAndUpdatePetInfoInHtml() {
    checkWeightAndHappinessBeforeUpdating();
    updatePetInfoInHtml();
  }

  function checkWeightAndHappinessBeforeUpdating() {
    if (pet_info.weight < 0) {
      pet_info.weight = 0;
    }
    if (pet_info.happiness < 0) {
      pet_info.happiness = 0;
    }
    if (pet_info.cleanliness < 0) {
      pet_info.cleanliness = 0;
    }
    if (pet_info.cleanliness > 100) {
      pet_info.cleanliness = 100;
    }
  }

  function updatePetInfoInHtml() {
    $('.name').text(pet_info.name);
    $('.weight').text(pet_info.weight);
    $('.happiness').text(pet_info.happiness);
    $('.cleanliness').text(pet_info.cleanliness);
    $('.pet-image').attr('src', pet_info.imageSrc);
    $('.pet-image').attr('alt', pet_info.name + ' the gigapet');

    $('.dashboard').toggleClass('warning', pet_info.happiness <= 2 || pet_info.weight <= 2);
  }

  function showPetComment(message) {
    var $comment = $('.pet-comment');

    // jQuery method #1 not in starter code: stop()
    // stop(true, true) clears queued animations and jumps to end of any active one,
    // which keeps rapid button clicks from creating delayed, stacked comment effects.
    $comment.stop(true, true);

    // jQuery method #2 not in starter code: slideDown()
    // The comment area slides open smoothly when new feedback arrives.
    $comment
      .hide()
      .text(pet_info.name + ': ' + message)
      .slideDown(220)
      .delay(800)
      .fadeOut(260);
  }

  function animatePet(hopHeight) {
    $('.pet-image')
      .stop(true, true)
      .animate({ marginTop: '-' + hopHeight }, 140)
      .animate({ marginTop: '0px' }, 180);
  }

  function addHistory(actionLabel) {
    var timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    actionHistory.unshift(timestamp + ' - ' + pet_info.name + ': ' + actionLabel);

    if (actionHistory.length > maxHistoryItems) {
      actionHistory.pop();
    }

    renderHistory();
  }

  function renderHistory() {
    var $historyList = $('.history-list');
    $historyList.empty();

    if (actionHistory.length === 0) {
      $historyList.append('<li>No actions yet. Start playing!</li>');
      return;
    }

    $.each(actionHistory, function (_, historyLine) {
      $historyList.append($('<li></li>').text(historyLine));
    });
  }

  // ---------------------------------------------------------------------------
  // SECTION 2 — Console Logging Demos
  // Ref: https://developer.chrome.com/docs/devtools/console/log/
  // ---------------------------------------------------------------------------

  // LOG INFO — console.info() shows a blue (i) icon in DevTools.
  // Use %s for string substitution and %d for number substitution.
  function logInfoMessage() {
    console.info('Pet Info: %s is active with happiness=%d', pet_info.name, pet_info.happiness);
  }

  // LOG WARNING — console.warn() shows a yellow triangle icon.
  // console.trace() prints the full call stack so you can see what triggered the warning.
  function logWarningMessage() {
    console.warn('Pet Warning: %s cleanliness is at %d%%', pet_info.name, pet_info.cleanliness);
    console.trace('Warning trace for grooming reminder');
  }

  // LOG ERROR — console.error() shows a red X icon and includes a stack trace.
  // Filter these out in DevTools by unchecking "Errors" in the Log Levels drop-down.
  function logErrorMessage() {
    console.error('Pet Error: %s is out of treats. Refill inventory.', pet_info.name);
  }

  // LOG TABLE — console.table() renders an array of objects as a sortable grid.
  // Great for quickly comparing multiple items (all three pets are shown here).
  function logTableMessage() {
    console.table(pets.map(function (pet) {
      return {
        name: pet.name,
        weight: pet.weight,
        happiness: pet.happiness,
        cleanliness: pet.cleanliness
      };
    }));
  }

  // LOG GROUP — console.group() collapses related messages under one expandable label.
  // console.groupEnd() closes the group. Click the arrow in DevTools to expand/collapse.
  function logGroupMessage() {
    console.group('Pet Health Snapshot');
    console.log('Name: %s', pet_info.name);
    console.log('Weight: %d', pet_info.weight);
    console.log('Happiness: %d', pet_info.happiness);
    console.log('Cleanliness: %d', pet_info.cleanliness);
    console.groupEnd();
  }

  // LOG CUSTOM — %c in the format string applies a CSS rule to the text that follows.
  // Each %c corresponds to one CSS string argument after the message.
  function logCustomMessage() {
    console.log(
      '%cPet Custom%c ' + pet_info.name + ' wants to play!',
      'padding:2px 6px;border:1px solid #c0392b;background:#ffe5e0;color:#6d1b12;font-weight:bold;border-radius:4px;',
      'padding:2px 6px;border:1px solid #1f5d8b;background:#deefff;color:#0a3551;border-radius:4px;'
    );
  }

  // CLEAR CONSOLE — console.clear() wipes the Console output so you can start fresh.
  // One new info message is logged immediately after so the Console is never empty.
  function clearConsole() {
    console.clear();
    console.info('Console cleared. Run logging buttons again for filter practice.');
  }

  // ---------------------------------------------------------------------------
  // SECTION 3 — View Messages Logged by the Browser
  // Ref: https://developer.chrome.com/docs/devtools/console/log/#browser
  // ---------------------------------------------------------------------------

  // CAUSE 404 — fetch() a file that does not exist.
  // The browser logs a red network error in the Console and in the Network panel.
  // Date.now() makes the filename unique so the browser never serves a cached response.
  function cause404Error() {
    fetch('images/does-not-exist-' + Date.now() + '.png')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Network response status: ' + response.status);
        }
      })
      .catch(function (error) {
        console.error('404 demo request failed:', error.message);
      });
  }

  // CAUSE TYPE ERROR — querySelector() returns null for a selector that matches nothing.
  // Assigning .textContent on null throws an uncaught TypeError, which the browser
  // automatically logs as a red error in the Console with a full stack trace.
  function causeTypeError() {
    var missingNode = document.querySelector('.definitely-missing-node'); // returns null
    missingNode.textContent = 'This line intentionally fails.'; // TypeError: Cannot set properties of null
  }

  // CAUSE VIOLATION — a synchronous busy-loop blocks the browser's main thread for 3 seconds.
  // The browser logs a [Violation] 'click' handler message to the Console.
  // IMPORTANT: you must enable "Verbose" in the Log Levels drop-down to see Violation messages.
  // The page will freeze briefly — that is expected and part of the demo.
  function causeViolation() {
    var start = performance.now();
    while (performance.now() - start < 3000) {
      Math.sqrt(Math.random() * 1000000);
    }
    console.log('Violation demo complete. If Verbose is enabled, watch for a [Violation] message.');
  }

  // ---------------------------------------------------------------------------
  // SECTION 4 — JavaScript Debugging Demo
  // Ref: https://developer.chrome.com/docs/devtools/javascript/
  //
  // HOW TO DEMO BREAKPOINTS:
  //   1. Open Sources panel (Cmd+Option+I → Sources tab)
  //   2. Open script.js in the file tree
  //   3. Click the line number next to  var sum = computeSum(...)  to set a breakpoint
  //   4. Click "Run Buggy Add" — DevTools pauses execution on that line
  //   5. Hover over addend1 / addend2 to inspect their values in-line
  //   6. Check the Scope pane on the right to see all local variables
  //   7. Add a Watch expression: typeof sum  (reveals it is a string, not a number)
  //   8. Open the Console drawer (Esc), type: parseInt(addend1) + parseInt(addend2)
  //   9. Click "Apply Fix" button — computeSum now returns a real number
  // ---------------------------------------------------------------------------

  // REPRODUCE THE BUG — reads raw string values from the input boxes and calls computeSum.
  // console.log here shows typeOfSum so you can observe 'string' vs 'number' in the Console.
  function runBuggyCalculator() {
    var addend1 = $('#addend-1').val(); // .val() always returns a string
    var addend2 = $('#addend-2').val(); // .val() always returns a string
    var sum = computeSum(addend1, addend2);
    $('.calc-output').text(addend1 + ' + ' + addend2 + ' = ' + sum + (useFixedCalculator ? ' (fixed mode)' : ' (buggy mode)'));

    // SET A BREAKPOINT on the line below to pause and inspect addend1, addend2, and sum.
    console.log('Calculator run:', { addend1: addend1, addend2: addend2, sum: sum, typeOfSum: typeof sum });
  }

  // computeSum — the bug lives here.
  //   BUGGY path:  "5" + "1" === "51"  (JavaScript string concatenation)
  //   FIXED path:  parseInt("5") + parseInt("1") === 6  (numeric addition)
  //
  // SCOPE PANE: when paused on the return statement, the Scope pane will show
  //   addend1 = "5" (string), addend2 = "1" (string)
  // WATCH EXPRESSION: add  typeof sum  to confirm it is "string" in buggy mode.
  function computeSum(addend1, addend2) {
    if (useFixedCalculator) {
      // FIX: parseInt() converts the string input to a base-10 integer before adding.
      return parseInt(addend1, 10) + parseInt(addend2, 10);
    }

    // BUG: the + operator concatenates two strings instead of adding numbers.
    return addend1 + addend2;
  }

  // APPLY FIX — flips the flag so computeSum takes the parseInt branch.
  // After clicking, the output should show 6 instead of 51.
  function applyCalculatorFix() {
    useFixedCalculator = true;
    console.info('Fix applied: computeSum now parses numeric input.');
    runBuggyCalculator();
  }

  // RESET BUG — restores the buggy mode so the demo can be repeated.
  function resetCalculatorFix() {
    useFixedCalculator = false;
    console.warn('Bug mode restored for debugging practice.');
    runBuggyCalculator();
  }

  renderHistory();
  runBuggyCalculator();
});
  