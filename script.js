
"use strict";

// 1. Select the HTML elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const errorMessage = document.querySelector("#error-message");
const noteCount = document.querySelector("#note-count");
const searchInput = document.querySelector("#search-input");

// 2. Create an array to store notes
let notes = [];

// 3. Save notes to localStorage
function saveNotes() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}

// 4. Load saved notes from localStorage
function loadNotes() {
  const savedNotes = localStorage.getItem("quickNotes");

  if (savedNotes) {
    try {
      const parsedNotes = JSON.parse(savedNotes);

      if (Array.isArray(parsedNotes)) {
        notes = parsedNotes.filter(function (note) {
          return (
            note &&
            typeof note.id === "number" &&
            typeof note.text === "string" &&
            typeof note.category === "string" &&
            typeof note.createdAt === "string"
          );
        });
      }
    } catch (error) {
      notes = [];
    }
  }
}

// 5. Update the note count
function updateNoteCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

// 6. Display notes on the page
function render() {
  notesList.replaceChildren();

  // Update the count of all saved notes
  updateNoteCount();

  // Get the search term
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Filter notes by their text
  const filteredNotes = notes.filter(function (note) {
    return note.text.toLowerCase().includes(searchTerm);
  });

  // Show a message when no notes match the search
  if (filteredNotes.length === 0 && searchTerm !== "") {
    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    notesList.append(message);
    return;
  }

  // Display each matching note
  filteredNotes.forEach(function (note) {
    const noteCard = document.createElement("li");
    noteCard.classList.add("note-card");

    // Apply the category colour
    const categoryClass = "category-" + note.category.toLowerCase();
    noteCard.classList.add(categoryClass);

    // Display the note text
    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    // Display the category
    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("category-label");
    categoryLabel.textContent = note.category;

    // Display the date and time
    const dateLabel = document.createElement("time");
    dateLabel.classList.add("note-date");
    dateLabel.textContent = note.createdAt;

    // Create the Delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    // Delete the selected note
    deleteButton.addEventListener("click", function () {
      notes = notes.filter(function (item) {
        return item.id !== note.id;
      });

      saveNotes();
      render();
    });

    // Add elements to the note card
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

// 7. Handle form submission and validate notes
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Reject empty notes
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    noteInput.focus();
    return;
  }

  // Reject notes longer than 200 characters
  if (text.length > 200) {
    errorMessage.textContent =
      "Notes must be 200 characters or fewer.";
    noteInput.focus();
    return;
  }

  // Clear any previous error
  errorMessage.textContent = "";

  // Create the new note
  const note = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  // Add the note
  notes.push(note);

  // Save and display the updated notes
  saveNotes();
  render();

  // Clear the input
  noteInput.value = "";
  noteInput.focus();
});

// 8. Search notes as the user types
searchInput.addEventListener("input", function () {
  render();
});

// 9. Clear the search field and show all notes
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    searchInput.value = "";
    render();
  }
});

// 10. Optional Clear All button support
const clearAllButton = document.querySelector("#clear-all");

if (clearAllButton) {
  clearAllButton.addEventListener("click", function () {
    if (notes.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete all notes?"
    );

    if (confirmed) {
      notes = [];
      saveNotes();
      render();
      errorMessage.textContent = "";
    }
  });
}

// 11. Load saved notes and display them when the page opens
loadNotes();
render();
