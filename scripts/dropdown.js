function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  dropdown.style.display =
    dropdown.style.display === "none" || dropdown.style.display === ""
      ? "flex"
      : "none";
}

function filterList(inputId, listId) {
  const input = document.getElementById(inputId);
  const filter = input.value.toLowerCase();
  const items = document.querySelectorAll(`#${listId} li`);
  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(filter) ? "" : "none";
  });
}

document
  .getElementById("searchIngredient")
  .addEventListener("keyup", () =>
    filterList("searchIngredient", "ingredientList")
  );
document
  .getElementById("searchAppliance")
  .addEventListener("keyup", () =>
    filterList("searchAppliance", "applianceList")
  );
document
  .getElementById("searchUstensil")
  .addEventListener("keyup", () =>
    filterList("searchUstensil", "ustensilList")
  );

function fillSelector(datas) {
  const ingredientList = document.getElementById("ingredientList");
  const applianceList = document.getElementById("applianceList");
  const ustensilList = document.getElementById("ustensilList");

  let appliances = [];
  let ingredients = [];
  let ustensils = [];

  datas.forEach((data) => {
    if (!appliances.includes(data.appliance.toLowerCase())) {
      appliances.push(data.appliance.toLowerCase());
    }
    data.ingredients.forEach((ingr) => {
      if (!ingredients.includes(ingr.ingredient.toLowerCase())) {
        ingredients.push(ingr.ingredient.toLowerCase());
      }
    });
    data.ustensils.forEach((ust) => {
      if (!ustensils.includes(ust.toLowerCase())) {
        ustensils.push(ust.toLowerCase());
      }
    });
  });

  appliances.forEach((data) => {
    const li = document.createElement("li");
    li.textContent = data;
    applianceList.appendChild(li);
    li.addEventListener("click", () =>
      handleMultipleSelection(li, "selected-item")
    );
  });

  ingredients.forEach((data) => {
    const li = document.createElement("li");
    li.textContent = data;
    ingredientList.appendChild(li);
    li.addEventListener("click", () =>
      handleMultipleSelection(li, "selected-item")
    );
  });

  ustensils.forEach((data) => {
    const li = document.createElement("li");
    li.textContent = data;
    ustensilList.appendChild(li);
    li.addEventListener("click", () =>
      handleMultipleSelection(li, "selected-item")
    );
  });
}

function handleMultipleSelection(item, selectedClass) {
  if (item.classList.contains(selectedClass)) {
    item.classList.remove(selectedClass);
    removeTag(item.textContent);
  } else {
    item.classList.add(selectedClass);
    addTag(item.textContent);
  }

  const list = item.parentNode;
  const selectedItems = list.querySelectorAll(`.${selectedClass}`);

  // Move selected items to the top
  selectedItems.forEach((selectedItem) => {
    list.prepend(selectedItem);
  });
}

function addTag(text) {
  const tagGroup = document.getElementById("tagGroup");
  const tagItem = document.createElement("div");
  tagItem.className = "tagItem";
  const tagText = document.createElement("p");
  tagText.textContent = text;
  const tagClose = document.createElement("i");
  tagClose.className = "fa-solid fa-xmark";
  tagClose.addEventListener("click", () => removeTag(text));

  tagItem.appendChild(tagText);
  tagItem.appendChild(tagClose);
  tagGroup.appendChild(tagItem);

  allSearch();
}

function removeTag(text) {
  const tagGroup = document.getElementById("tagGroup");
  const tags = tagGroup.getElementsByClassName("tagItem");
  for (let i = 0; i < tags.length; i++) {
    if (tags[i].textContent.trim() === text) {
      tags[i].remove();
      break;
    }
  }

  // Also remove the selected class from the corresponding dropdown item
  const allItems = document.querySelectorAll("li");
  allItems.forEach((item) => {
    if (item.textContent.trim() === text) {
      item.classList.remove("selected-item");
    }
  });

  allSearch();
}

fetch("../data/recipes.json")
  .then((response) => response.json())
  .then((data) => {
    displayRecipes(data);
    fillSelector(data);
    const recipList = data;
  })
  .catch((err) => console.log(err));

// Initialisation des variable globale pour les filtres
let recipesIngr = [];
let recipesApp = [];
let ATERecipes = [];

const selectedIngr = [];
const selectedApp = [];
const selectedUst = [];
// -----------------------------------------------------

async function allSearch() {
  // Reset des recettes filtré avant de rechercher
  recipesIngr = [];
  recipesApp = [];
  ATERecipes = [];
  // ---------------------------------------------

  await searchIngr();
  await searchApp();
  await searchUst();

  // Cacher toutes les recette ---------------------------
  const allRecipes = document.getElementById("recipList");
  for (let i = 0; i < allRecipes.children.length; i++) {
    allRecipes.children[i].style.display = "none";
  }
  // -----------------------------------------------------

  // Afficher toutes les recette filtré qui sont dans ATERecipes ----------------------------------------------------
  ATERecipes.forEach((recipe) => {
    for (let i = 0; i < allRecipes.children.length; i++) {
      if (
        recipe.children[1].innerText.toLowerCase() ==
        allRecipes.children[i].children[1].innerText.toLowerCase()
      ) {
        allRecipes.children[i].style.display = "flex";
      }
    }
  });
  // ----------------------------------------------------------------------------------------------------------------
}

// Get Ingr ----------------------------------------------------------
function searchIngr() {
  const allIngr = document.getElementById("ingredientList").children;

  for (let i = 0; i < allIngr.length; i++) {
    if (allIngr[i].className === "selected-item") {
      selectedIngr.push(allIngr[i].innerHTML);
    }
  }

  if (selectedIngr.length == 0) {
    // for (let i = 0; i < recipList.children.length; i++) {
    //   recipesIngr.push(recipList.children[i]);
    // }
    recipesIngr = recipList;
  } else {
    selectedIngr.forEach((ingr) => {
      for (let i = 0; i < recipList.children.length; i++) {
        if (recipList.children[i].innerHTML.includes(ingr)) {
          recipesIngr.push(recipList.children[i]);
        }
      }
    });
  }
}
//---------------------------------------------------------------------

// Get App ----------------------------------------------------------
function searchApp() {
  const allApp = document.getElementById("applianceList").children;

  for (let i = 0; i < allApp.length; i++) {
    if (allApp[i].className === "selected-item") {
      selectedApp.push(allApp[i].innerHTML);
    }
  }

  if (selectedApp.length == 0) {
    if (selectedIngr.length == 0) {
      recipesApp = recipList;
    } else {
      recipesApp = recipesIngr;
    }
  } else {
    selectedApp.forEach((ingr) => {
      for (let i = 0; i < recipesIngr.length; i++) {
        if (recipesIngr[i].innerHTML.includes(ingr)) {
          recipesApp.push(recipesIngr[i]);
        }
      }
    });
  }
}
//---------------------------------------------------------------------

// Get Ust ----------------------------------------------------------
function searchUst() {
  const allApp = document.getElementById("ustensilList").children;

  for (let i = 0; i < allApp.length; i++) {
    if (allApp[i].className === "selected-item") {
      selectedUst.push(allApp[i].innerHTML);
    }
  }

  if (selectedUst.length == 0) {
    ATERecipes = recipesApp;
  } else {
    selectedUst.forEach((ingr) => {
      for (let i = 0; i < recipesApp.length; i++) {
        if (recipesApp[i].innerHTML.includes(ingr)) {
          ATERecipes.push(recipesApp[i]);
        }
      }
    });
  }
}
//---------------------------------------------------------------------
