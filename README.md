# Project 2 - Finn Bishop - COMP 484

Please scroll down to view unique methods.  

## 🚀 Live Demo

You can view the published website on github pages: https://finn-bishop.github.io/fb-project2/index.html
## Unique code beyond project requirements
This project has unique elements that don't manifest necessarily as visual flair, as, the same things could have been achieved in the absence of these tools. However, I felt it important to develop skills in the two following domains: usage of a css library, in this case, `tailwind` and `object oriented programming` in JavaScript. 

<h4>Multiple giga pets</h4>
I implemented two classes. One for a general pet, and the other, for a pet with a `breathfire` method. This functionality serves as my additonal behavior for this specific gigapet. 

```js
class Pet {
  // Runs once when you write `new Pet(...)`.
  // Note: this assigns the fields directly, so the setters' checks are skipped here.
  constructor(name, weight, happiness) {
    this._name = name;
    this._weight = weight;
    this._happiness = happiness;
  }
  /* ... */
}

// This class is only for 'biscuits'. It is purely to create an object that has a specific, unique method. 
class FireBreathingPet extends Pet {
  constructor(name, weight, happiness) {
    // super(...) runs Pet's constructor first so _name, _weight and _happiness get set.
    super(name, weight, happiness);
    this._breathesFire = true;
  }

  // Getter: `pet.breathesFire` returns whether this pet can currently breathe fire.
  get breathesFire() {
    return this._breathesFire;
  }

  // Setter: `pet.breathesFire = false` turns the feature off.
  // Boolean(...) makes sure the stored value is always true or false.
  set breathesFire(value) {
    this._breathesFire = Boolean(value);
  }
}

```

<h4>Tailwind</h4>

All of tailwind is imported. To see how code in tailwind is implemented, look at each element's class since Tailwind is designed for inline writing without significant effort directed to custom CSS clases in a dedicated `styles.css`. I haven't changed `style.css` too much except for cases to avoid collisions. `input.css` and `output.css` contain debugging code and the specific tailwind classes used for rendering. 

## Unique jQuery Methods
I've listed each of my 2 unique jQuery methods with their corresponding line numbers.

### ```.trigger()```
Found on lines `84-86` in `script.js`. The [.trigger()](https://api.jquery.com/trigger/) method fires an event on the selected element as if the user had done it themselves. Here, pressing `T`, `P` or `E` triggers a `click` on the Treat, Play or Exercise button, so keyboard shortcuts and mouse clicks run the exact same handler.
```js
$(document).on('keydown', function(event) {
  const key = event.key.toLowerCase();
  if (key === 't') $('.treat-button').trigger('click');
  if (key === 'p') $('.play-button').trigger('click');
  if (key === 'e') $('.exercise-button').trigger('click');
});
```

### ```.off()```
Found on line `151` in `script.js`. The [.off()](https://api.jquery.com/off/) method removes an event handler that was attached with `.on()`. Here, once a pet's happiness hits 0, the `clickedPetCard` listener is removed from its sidebar card, so that pet can no longer be selected.
```js
function disableUnhappyPetCards() {
  $('.pet-card').each(function(i) {
    if (pets[i] && pets[i].happiness <= 0) {
      $(this).off('click', clickedPetCard);
    }
  });
}
```
