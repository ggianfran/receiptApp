// Get categories and entry arrays form localStorage
let categories = JSON.parse(localStorage.getItem("categories"));
if (categories === null) {
  categories = [];
}
let entries = JSON.parse(localStorage.getItem("entries"));
if (entries === null) {
  entries = [];
}
let numOfCats = 1;
const catcolors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
catcolors.forEach((element, index) => {
  let selector = "div#category-" + index;
  $(selector).css("background-color", element);
});

initialize();

function initialize() {
  $("#form-cat-indicator").css("background-color", catcolors[0]);
  // Binding submission (pressing enter) to creating a new entry
  $("#form").bind("submit", (e) => {
    e.preventDefault();
    addEntry(
      $("#form-input").val(),
      $("#form-input").parent().parent().attr("category")
    ); // Create new entry
    $("#form-input")[0].value = ""; // Empty the form
  });

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "[": // Selector for deleting all entries
        e.preventDefault();
        $(".entry:not(.template, .entry-form)").remove(); // Remove all entries
        updateAll(); // Update LS and Total count
        break;
      case "]":
        $("input.category").val("");
        updateAll();
        break;
      case " ": // Selector changing category
        e.preventDefault();
        changeCategory();
        updateAll();
        break;
    }
  });

  // Populate with stored entries
  if (entries.length > 0) {
    entries.forEach((element, index) =>
      createEntry(element.value, element.category, index)
    );
  }
  if (categories.length > 0) {
    categories.forEach(
      (element, index) => ($("input.category")[index].value = element)
    );
  }
  $("input:not(#form-input)").change(updateAll);
  updateAll();
}

/****************FUNCTIONS********************/

function updateAll() {
  updateLS();
  updateTotal();
}

// Function is called when entry form is submitted
function addEntry(value, category) {
  createEntry(value, category, entries.length);
  updateAll();
}

// Creating the new element after submission
function createEntry(value, category, index) {
  const newEntry = $("#entry-template").clone();
  newEntry.attr("id", "entry" + index).attr("category", category);
  newEntry.removeClass("template");
  newEntry.children().removeClass("template");
  newEntry.children(".input")[0].value = value;
  newEntry
    .children(".category-indicator")
    .css("background-color", catcolors[category]);
  $(".entries-container").append(newEntry);
  $("input:not(#form-input)").change(updateAll);
}

function updateTotal() {
  // Update total sum at bottom
  const allEntries = $("input:not(.template,.category,#form-input)");
  let sum = 0;
  let catSum = [0, 0, 0, 0, 0];
  allEntries.each(function () {
    if (!isNaN(parseFloat(this.value))) {
      sum += parseFloat(this.value);
      catSum[parseInt($(this).parents("div.entry").attr("category"))] +=
        parseFloat(this.value);
    }
  });
  sum = Math.round(sum * 100) / 100;
  $("#total-count").html(sum);

  catSum.forEach((element, index) => {
    let selector = "#result-" + index;
    $(selector).html(Math.round(element * 100) / 100);
  });
  // Update individual category totals
}

// Updating of localstorage so that entries persist over refreshes
function updateLS() {
  const allEntries = $("input.input:not(.template, #form-input)");
  const allCategories = $("input.category");

  const entries = [];
  allEntries.each(function () {
    entries.push({
      value: this.value,
      category: $(this).parent().attr("category"),
    });
  });

  const categories = [];
  numOfCats = 0;
  allCategories.each(function () {
    categories.push(this.value);
    if (this.value != "") {
      numOfCats++;
    }
  });

  if (numOfCats < 1) {
    numOfCats = 1;
  }
  localStorage.setItem("entries", JSON.stringify(entries));
  localStorage.setItem("categories", JSON.stringify(categories));
}

function changeCategory() {
  let focusedDiv = $("input:focus:not(.category)").parents("div.entry");
  let newCat = (parseInt(focusedDiv.attr("category")) + 1) % numOfCats;
  if (isNaN(newCat)) {
    return;
  }
  focusedDiv.attr("category", newCat);
  focusedDiv
    .children("div.category-indicator")
    .css("background-color", catcolors[newCat]);
}
