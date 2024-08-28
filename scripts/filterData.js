// Récupération des éléments HTML nécessaires pour la recherche, l'affichage des recettes et le comptage des recettes
let searchBar = document.getElementById("searchBar");
let recipeCard = document.getElementById("recipList");
let nbrRecipeCard = document.getElementById("nbrRecipe");

// Ajout d'un écouteur d'événements pour détecter les entrées dans la barre de recherche
searchBar.addEventListener("keyup", searchRecipes);

// Fonction pour mettre à jour le nombre de recettes affichées
function QuantityOfCard() {
  let i = 0;
  const recipes = recipeCard.childNodes;

  // Parcourt de toutes les cartes de recettes
  recipes.forEach(function (recipe) {
    // Vérifie si la carte est visible (affichée)
    if (recipe.className === "card" && recipe.style.display !== "none") {
      i += 1; // Incrémente le compteur si la carte est visible
    }
  });

  // Affiche le nombre de recettes visibles
  nbrRecipeCard.innerHTML = i;
}

// Fonction pour effectuer une recherche dans les recettes en fonction de l'entrée de l'utilisateur
function searchRecipes(e) {
  let searchTerm = e.target.value.toLowerCase(); // Récupère le terme de recherche saisi par l'utilisateur
  applyFilters(searchTerm); // Applique les filtres avec le terme de recherche
}

// Fonction pour filtrer les recettes par ingrédient
function filterByIngredient(ingredients, ingredientTags) {
  if (ingredientTags.length === 0) return true;

  // Vérifie si tous les tags d'ingrédients sont présents dans les ingrédients de la recette
  return ingredientTags.every((tag) => {
    return ingredients.some((ingredient) => {
      let ingredientName = ingredient.childNodes[0].innerHTML.toLowerCase();
      return ingredientName.includes(tag);
    });
  });
}

// Fonction pour filtrer les recettes par appareil
function filterByAppareil(appareil, appareilTags) {
  if (appareilTags.length === 0) return true;

  // Vérifie si tous les tags d'appareils sont présents dans les appareils de la recette
  return appareilTags.every((tag) => {
    return appareil.includes(tag);
  });
}

// Fonction pour filtrer les recettes par ustensile
function filterByUstensile(ustensiles, ustensileTags) {
  if (ustensileTags.length === 0) return true;

  // Vérifie si tous les tags d'ustensiles sont présents dans les ustensiles de la recette
  return ustensileTags.every((tag) => {
    return ustensiles.some((ustensile) => {
      let ustensileName = ustensile.value.toLowerCase();
      return ustensileName.includes(tag);
    });
  });
}

// Fonction pour gérer la sélection multiple d'éléments dans les listes déroulantes (ingrédients, appareils, ustensiles)
function handleMultipleSelection(item, selectedClass) {
  const filterValue = item.textContent.trim();

  // Ajoute ou supprime la classe sélectionnée en fonction de l'état de l'élément
  if (item.classList.contains(selectedClass)) {
    item.classList.remove(selectedClass);
    removeTag(filterValue); // Supprime le tag si l'élément est désélectionné
  } else {
    item.classList.add(selectedClass);
    addTag(filterValue); // Ajoute le tag si l'élément est sélectionné
  }

  // Réorganise les éléments sélectionnés en haut de la liste
  const list = item.parentNode;
  const selectedItems = list.querySelectorAll(`.${selectedClass}`);
  selectedItems.forEach((selectedItem) => {
    list.prepend(selectedItem);
  });

  // Applique les filtres mis à jour
  applyFilters();
}

// Fonction pour ajouter un tag au groupe de tags actifs
function addTag(text) {
  const tagGroup = document.getElementById("tagGroup");
  const tagItem = document.createElement("div");
  tagItem.className = "tagItem";

  // Création des éléments pour afficher le tag
  const tagText = document.createElement("p");
  tagText.textContent = text;
  const tagClose = document.createElement("i");
  tagClose.className = "fa-solid fa-xmark";
  tagClose.addEventListener("click", () => removeTag(text)); // Ajoute la possibilité de supprimer le tag

  // Ajoute le texte du tag et le bouton de fermeture au tag
  tagItem.appendChild(tagText);
  tagItem.appendChild(tagClose);
  tagGroup.appendChild(tagItem);

  // Applique les filtres avec le nouveau tag ajouté
  applyFilters();
}

// Fonction pour supprimer un tag du groupe de tags actifs
function removeTag(text) {
  const tagGroup = document.getElementById("tagGroup");
  const tags = tagGroup.getElementsByClassName("tagItem");

  // Parcourt tous les tags et retire celui qui correspond au texte donné
  for (let i = 0; i < tags.length; i++) {
    if (tags[i].textContent.trim() === text) {
      tags[i].remove();
      break;
    }
  }

  // Retire la sélection correspondante dans les listes déroulantes
  const allItems = document.querySelectorAll("li");
  allItems.forEach((item) => {
    if (item.textContent.trim() === text) {
      item.classList.remove("selected-item");
    }
  });

  // Applique les filtres mis à jour
  applyFilters();
}

// Fonction pour appliquer les filtres aux recettes affichées
function applyFilters(searchTerm = "") {
  const tagGroup = document.getElementById("tagGroup");
  const tags = tagGroup.getElementsByClassName("tagItem");
  const selectedTags = Array.from(tags).map((tag) =>
    tag.textContent.trim().toLowerCase()
  );

  // On suppose que tous les tags sont des tags d'ingrédients pour simplifier
  const ingredientTags = selectedTags;
  const appareilTags = selectedTags;
  const ustensileTags = selectedTags;

  const recipes = recipeCard.childNodes;

  // Parcourt de chaque recette pour appliquer les filtres
  recipes.forEach(function (recipe) {
    if (recipe.className === "card") {
      let ingredients = Array.from(
        recipe.childNodes[3].childNodes[1].childNodes
      );
      let appareils = recipe.childNodes[2].childNodes[2].value.toLowerCase();
      let ustensiles = Array.from(
        recipe.childNodes[2].childNodes[3].childNodes
      );

      // Vérifie si la recette correspond aux filtres actifs
      let matchesIngredient = filterByIngredient(ingredients, ingredientTags);
      let matchesAppareil = filterByAppareil(appareils, appareilTags);
      let matchesUstensile = filterByUstensile(ustensiles, ustensileTags);
      let matchesSearchTerm = recipe.textContent
        .toLowerCase()
        .includes(searchTerm);

      // Affiche ou cache la recette en fonction des filtres
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

  // Met à jour le nombre de recettes affichées
  QuantityOfCard();
}

// Fonction pour remplir les sélecteurs avec les options disponibles (ingrédients, appareils, ustensiles)
function fillSelector(datas) {
  const ingredientList = document.getElementById("ingredientList");
  const applianceList = document.getElementById("applianceList");
  const ustensilList = document.getElementById("ustensilList");

  let appliances = [];
  let ingredients = [];
  let ustensils = [];

  // Parcourt toutes les données pour extraire les appareils, ingrédients et ustensiles uniques
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

  // Remplir la liste des appareils
  appliances.forEach((data) => {
    const li = document.createElement("li");
    li.textContent = data;
    applianceList.appendChild(li);
    li.addEventListener("click", () =>
      handleMultipleSelection(li, "selected-item")
    );
  });

  // Remplir la liste des ingrédients
  ingredients.forEach((data) => {
    const li = document.createElement("li");
    li.textContent = data;
    ingredientList.appendChild(li);
    li.addEventListener("click", () =>
      handleMultipleSelection(li, "selected-item")
    );
  });

  // Remplir la liste des ustensiles
  ustensils.forEach((data) => {
    const li = document.createElement("li");
    li.textContent = data;
    ustensilList.appendChild(li);
    li.addEventListener("click", () =>
      handleMultipleSelection(li, "selected-item")
    );
  });
}

// Récupération des recettes depuis le fichier JSON et initialisation de l'affichage
fetch("../data/recipes.json")
  .then((response) => response.json())
  .then((data) => {
    displayRecipes(data);
    fillSelector(data);
  })
  .catch((err) => console.log(err));
