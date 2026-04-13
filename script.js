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

  renderHistory();
});
  