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
}

fetch("../data/recipes.json")
  .then((response) => response.json())
  .then((data) => {
    displayRecipes(data);
    fillSelector(data);
  })
  .catch((err) => console.log(err));
