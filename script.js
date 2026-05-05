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
  $('.log-info-btn').on('click', logInfoMessage);
  $('.log-warning-btn').on('click', logWarningMessage);
  $('.log-error-btn').on('click', logErrorMessage);
  $('.log-table-btn').on('click', logTableMessage);
  $('.log-group-btn').on('click', logGroupMessage);
  $('.log-custom-btn').on('click', logCustomMessage);
  $('.clear-console-btn').on('click', clearConsole);
  $('.cause-404-btn').on('click', cause404Error);
  $('.cause-typeerror-btn').on('click', causeTypeError);
  $('.cause-violation-btn').on('click', causeViolation);
  $('.run-buggy-calc-btn').on('click', runBuggyCalculator);
  $('.apply-fix-btn').on('click', applyCalculatorFix);
  $('.reset-fix-btn').on('click', resetCalculatorFix);

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

  function logInfoMessage() {
    console.info('Pet Info: %s is active with happiness=%d', pet_info.name, pet_info.happiness);
  }

  function logWarningMessage() {
    console.warn('Pet Warning: %s cleanliness is at %d%%', pet_info.name, pet_info.cleanliness);
    console.trace('Warning trace for grooming reminder');
  }

  function logErrorMessage() {
    console.error('Pet Error: %s is out of treats. Refill inventory.', pet_info.name);
  }

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

  function logGroupMessage() {
    console.group('Pet Health Snapshot');
    console.log('Name: %s', pet_info.name);
    console.log('Weight: %d', pet_info.weight);
    console.log('Happiness: %d', pet_info.happiness);
    console.log('Cleanliness: %d', pet_info.cleanliness);
    console.groupEnd();
  }

  function logCustomMessage() {
    console.log(
      '%cPet Custom%c ' + pet_info.name + ' wants to play!',
      'padding:2px 6px;border:1px solid #c0392b;background:#ffe5e0;color:#6d1b12;font-weight:bold;border-radius:4px;',
      'padding:2px 6px;border:1px solid #1f5d8b;background:#deefff;color:#0a3551;border-radius:4px;'
    );
  }

  function clearConsole() {
    console.clear();
    console.info('Console cleared. Run logging buttons again for filter practice.');
  }

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

  function causeTypeError() {
    // Intentionally trigger an uncaught type error for DevTools practice.
    var missingNode = document.querySelector('.definitely-missing-node');
    missingNode.textContent = 'This line intentionally fails.';
  }

  function causeViolation() {
    var start = performance.now();
    while (performance.now() - start < 3000) {
      // Busy loop for violation demo in the Console (enable Verbose level).
      Math.sqrt(Math.random() * 1000000);
    }
    console.log('Violation demo complete. If Verbose is enabled, watch for a [Violation] message.');
  }

  function runBuggyCalculator() {
    var addend1 = $('#addend-1').val();
    var addend2 = $('#addend-2').val();
    var sum = computeSum(addend1, addend2);
    $('.calc-output').text(addend1 + ' + ' + addend2 + ' = ' + sum + (useFixedCalculator ? ' (fixed mode)' : ' (buggy mode)'));

    console.log('Calculator run:', { addend1: addend1, addend2: addend2, sum: sum, typeOfSum: typeof sum });
  }

  function computeSum(addend1, addend2) {
    if (useFixedCalculator) {
      return parseInt(addend1, 10) + parseInt(addend2, 10);
    }

    // Intentional bug: string concatenation instead of numeric addition.
    return addend1 + addend2;
  }

  function applyCalculatorFix() {
    useFixedCalculator = true;
    console.info('Fix applied: computeSum now parses numeric input.');
    runBuggyCalculator();
  }

  function resetCalculatorFix() {
    useFixedCalculator = false;
    console.warn('Bug mode restored for debugging practice.');
    runBuggyCalculator();
  }

  renderHistory();
  runBuggyCalculator();
});
  