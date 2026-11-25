// Trigger 81-85
// off 150 

class Pet {
  // Runs once when you write `new Pet(...)`.
  // Note: this assigns the fields directly, so the setters' checks are skipped here.
  constructor(name, weight, happiness) {
    this._name = name;
    this._weight = weight;
    this._happiness = happiness;
  }

  // Getters and setters expose only the properties I want.
  // A getter runs when you READ the property: `pet.name` calls get name().
  get name() {
    return this._name;
  }

  get weight() {
    return this._weight;
  }

  get happiness() {
    return this._happiness;
  }

  // A setter runs when you ASSIGN to the property: `pet.name = 'Rex'` calls set name('Rex').
  // Name has no rules, so any value is accepted.
  set name(newName) {
    this._name = newName;
  }

  // Weight can't go negative. A negative value is silently ignored and the old
  // weight is kept, so `pet.weight -= 1` at 0 just stays at 0.
  set weight(newWeight) {
    if (newWeight >= 0) {
      this._weight = newWeight;
    }
  }

  // Same rule as weight: negative happiness is ignored.
  set happiness(newHappiness) {
    if (newHappiness >= 0) {
      this._happiness = newHappiness;
    }
  }
}

$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.

    // --- APP STATE ---
    // activePetName decides which pet the dashboard shows and the buttons affect.
    // It's `var` (not const) because clicking a sidebar card reassigns it.
    var activePetName = "Biscuit";

    // All pets, in the same order as the sidebar cards in index.html:
    // pets[0] = first card, pets[1] = second card, pets[2] = third card.
    // `const` stops `pets` being replaced, but the array's contents can still change.
    const pets = [];
    pets.push(new Pet('Biscuit', 20, 5));
    pets.push(new Pet('Mittens', 15, 7));
    pets.push(new Pet('Whiskers', 10, 3));

    // Fill the page with the starting values as soon as it loads,
    // otherwise the dashboard would stay blank until the first click.
    checkAndUpdatePetInfoInHtml();

    // --- DASHBOARD BUTTONS ---
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);

    // EVENT LISTENERS FOR SIDE BAR:
    // One call attaches a click listener to every .pet-card (jQuery loops over all matches for us).
    $('.pet-card').on('click', clickedPetCard);
    // END EVENT LISTNERS

    // KEYBOARD SHORTCUTS: T = Treat, P = Play, E = Exercise
    // .trigger('click') fires the button's click handlers as if it had been clicked,
    // so keys and mouse clicks always share the same logic.
    // Listening on `document` catches key presses anywhere on the page.
    $(document).on('keydown', function(event) {
      const key = event.key.toLowerCase(); // so Caps Lock / Shift still work
      if (key === 't') $('.treat-button').trigger('click');
      if (key === 'p') $('.play-button').trigger('click');
      if (key === 'e') $('.exercise-button').trigger('click');
    });

    // Returns the Pet object whose name matches activePetName.
    // .find() checks each pet in order and returns the first match (or undefined if none match).
    function getActivePet() {
      return pets.find(pet => pet.name === activePetName);
    }

    // --- BUTTON HANDLERS ---
    // Each handler changes the active pet through its setters (which block negatives),
    // then redraws the page so the new numbers show up.
    // `+= 1` is shorthand for `pet.happiness = pet.happiness + 1`: it reads with the getter, then writes with the setter.

    // Treat: more happiness, more weight
    function clickedTreatButton() {
      console.log("meowmeowmeow");
      const pet = getActivePet();
      pet.happiness += 1;
      pet.weight += 1;
      checkAndUpdatePetInfoInHtml();
    }

    // Play: more happiness, less weight
    function clickedPlayButton() {
      const pet = getActivePet();
      pet.happiness += 1;
      pet.weight -= 1;
      checkAndUpdatePetInfoInHtml();
    }

    // Exercise: less happiness, less weight
    function clickedExerciseButton() {
      const pet = getActivePet();
      pet.happiness -= 1;
      pet.weight -= 1;
      checkAndUpdatePetInfoInHtml();
    }

    // Makes the clicked sidebar card's pet the active pet.
    // Inside a jQuery handler, `this` is the card that was clicked (this is why it's
    // a normal function, not an arrow function — arrows don't get their own `this`).
    function clickedPetCard() {
      const index = $('.pet-card').index(this); // 0, 1 or 2 — matches pets[0], pets[1], pets[2]
      // Guard: if there were more cards than pets, pets[index] would be undefined.
      if (pets[index]) {
        activePetName = pets[index].name;
        checkAndUpdatePetInfoInHtml();
      }
    }

    // Single entry point for "something changed, refresh the page".
    // Every handler calls this, so any future check (like the one below) only needs adding here.
    function checkAndUpdatePetInfoInHtml() {
      disableUnhappyPetCards();
      updatePetInfoInHtml();
    }

    // Stops a pet's sidebar card from being selected once its happiness hits 0.
    // (The Pet setter blocks negative values, so 0 is as low as happiness can go.)
    // .off('click', clickedPetCard) removes the listener that .on() attached above,
    // so clicking that card no longer does anything.
    function disableUnhappyPetCards() {
      $('.pet-card').each(function(i) {
        if (pets[i] && pets[i].happiness <= 0) {
          $(this).off('click', clickedPetCard);
        }
      });
    }

    // Unused for now — the Pet setters already stop weight and happiness going below zero.

    // Redraws everything on the page from the `pets` array.
    // The page never stores its own copy of the data; it always re-reads `pets`.
    function updatePetInfoInHtml() {
      // Label each sidebar card with its own pet (card 1 = pets[0], card 2 = pets[1], ...).
      // .each() calls the function once per card, passing its position as i.
      $('.pet-card').each(function(i) {
        if (pets[i]) {
          // .find() searches only inside THIS card, so each card gets its own name.
          $(this).find('.card-name').text(pets[i].name);
          $(this).find('.pet-name-button').attr('id', pets[i].name);

          // Highlight this card only if it's the active pet.
          // With a true/false second argument, .toggleClass() adds the classes on true
          // and removes them on false, so exactly one card is outlined at a time.
          // ring-orange-800 is a deep, maroon-leaning orange.
          $(this).toggleClass('ring-4 ring-orange-800', pets[i].name === activePetName);
        }
      });

      // Find the active pet, then copy its details into the main section.
      for(let i = 0; i < pets.length; i++) {
        if (pets[i].name === activePetName) {
          // Copy the image from the matching sidebar card into the main image.
          // .eq(i) picks the card at position i, the same position as pets[i].
          const cardImage = $('.pet-card').eq(i).find('img');
          $('.pet-image').attr('src', cardImage.attr('src'));
          $('.pet-image').attr('alt', pets[i].name);

          // Fill the dashboard text. $('.name') matches every element with that class.
          $('.name').text(pets[i].name);
          $('.weight').text(pets[i].weight);
          $('.happiness').text(pets[i].happiness);
          return; // Exit the loop once the active pet is found and updated
        }
      }
    }
})
