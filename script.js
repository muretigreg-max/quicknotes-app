// 1. Select the HTML elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");

// 2. Create an array to store notes
const notes = [];

// 3. Display notes on the page
function render() {
  notesList.replaceChildren();

  notes.forEach(function (note) {
    // Create the note card
    const noteCard = document.createElement("li");
    noteCard.classList.add("note-card");

    // Apply the category colour
    const categoryClass =
      "category-" + note.category.toLowerCase();

    noteCard.classList.add(categoryClass);

    // Create the note text
    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    // Create the category label
    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("category-label");
    categoryLabel.textContent = note.category;

    // Create the date and time
    const dateLabel = document.createElement("time");
    dateLabel.classList.add("note-date");
    dateLabel.textContent = note.createdAt;

    // Create the Delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    // Add all elements to the card
    noteCard.append(
      noteText,
      categoryLabel,
      dateLabel,
      deleteButton
    );

    // Add the card to the notes list
    notesList.append(noteCard);
  });
}

// 4. Handle form submission
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Create a new note object
  const note = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  // Store the note and update the page
  notes.push(note);
  render();

  // Clear the input
  noteInput.value = "";
  noteInput.focus();
});