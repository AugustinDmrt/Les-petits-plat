let searchBar = document.getElementById("searchBar");
let recipeCard = document.getElementById("recipList");
let nbrRecipeCard = document.getElementById("nbrRecipe");

searchBar.addEventListener("keyup", searchRecipes);

function QuantityOfCard() {
  let i = 0;
  const recipes = recipeCard.childNodes;
  recipes.forEach(function (recipe) {
    if (recipe.className === "card" && recipe.style.display !== "none") {
      i += 1;
    }
  });
  nbrRecipeCard.innerHTML = i;
}

function searchRecipes(e) {
  let searchTerm = e.target.value.toLowerCase();
  applyFilters(searchTerm);
}

function filterByIngredient(ingredients, ingredientTags) {
  if (ingredientTags.length === 0) return true;

  return ingredientTags.every((tag) => {
    return ingredients.some((ingredient) => {
      let ingredientName = ingredient.childNodes[0].innerHTML.toLowerCase();
      return ingredientName.includes(tag);
    });
  });
}

function filterByAppareil(appareil, appareilTags) {
  if (appareilTags.length === 0) return true;

  return appareilTags.every((tag) => {
    return appareil.includes(tag);
  });
}

function filterByUstensile(ustensiles, ustensileTags) {
  if (ustensileTags.length === 0) return true;

  return ustensileTags.every((tag) => {
    return ustensiles.some((ustensile) => {
      let ustensileName = ustensile.value.toLowerCase();
      return ustensileName.includes(tag);
    });
  });
}

function handleMultipleSelection(item, selectedClass) {
  const filterValue = item.textContent.trim();
  if (item.classList.contains(selectedClass)) {
    item.classList.remove(selectedClass);
    removeTag(filterValue);
  } else {
    item.classList.add(selectedClass);
    addTag(filterValue);
  }

  const list = item.parentNode;
  const selectedItems = list.querySelectorAll(`.${selectedClass}`);

  selectedItems.forEach((selectedItem) => {
    list.prepend(selectedItem);
  });

  // Apply the filter
  applyFilters();
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

  // Apply the filter
  applyFilters();
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

  // Apply the filter
  applyFilters();
}

function applyFilters(searchTerm = "") {
  const tagGroup = document.getElementById("tagGroup");
  const tags = tagGroup.getElementsByClassName("tagItem");
  const selectedTags = Array.from(tags).map((tag) =>
    tag.textContent.trim().toLowerCase()
  );

  const ingredientTags = selectedTags; // Assuming all tags are ingredient tags for simplicity
  const appareilTags = selectedTags; // Assuming all tags are appareil tags for simplicity
  const ustensileTags = selectedTags; // Assuming all tags are ustensile tags for simplicity

  const recipes = recipeCard.childNodes;
  recipes.forEach(function (recipe) {
    if (recipe.className === "card") {
      let ingredients = Array.from(
        recipe.childNodes[3].childNodes[1].childNodes
      );
      let appareils = recipe.childNodes[2].childNodes[2].value.toLowerCase();
      let ustensiles = Array.from(
        recipe.childNodes[2].childNodes[3].childNodes
      );

      let matchesIngredient = filterByIngredient(ingredients, ingredientTags);
      let matchesAppareil = filterByAppareil(appareils, appareilTags);
      let matchesUstensile = filterByUstensile(ustensiles, ustensileTags);
      let matchesSearchTerm = recipe.textContent
        .toLowerCase()
        .includes(searchTerm);

      if (
        matchesIngredient &&
        matchesAppareil &&
        matchesUstensile &&
        matchesSearchTerm
      ) {
        recipe.style.display = "flex";
      } else {
        recipe.style.display = "none";
      }
    }
  });

  QuantityOfCard();
}

function fillSelector(datas) {
  const ingredientList = document.getElementById("ingredientList");
  const applianceList = document.getElementById("applianceList");
  const ustensilList = document.getElementById("ustensilList");

  let appliances = [];
  let ingredients = [];
  let ustensils = [];

  datas.forEach((data) => {
    if (!appliances.includes(data.appliance)) {
      appliances.push(data.appliance);
    }
    data.ingredients.forEach((ingr) => {
      if (!ingredients.includes(ingr.ingredient)) {
        ingredients.push(ingr.ingredient);
      }
    });
    data.ustensils.forEach((ust) => {
      if (!ustensils.includes(ust)) {
        ustensils.push(ust);
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

fetch("../data/recipes.json")
  .then((response) => response.json())
  .then((data) => {
    displayRecipes(data);
    fillSelector(data);
  })
  .catch((err) => console.log(err));
