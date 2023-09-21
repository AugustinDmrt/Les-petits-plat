let recipList = document.getElementById('recipList');
let nbrRecipe = document.getElementById('nbrRecipe');
function displayRecipes(recipes) {
    recipes.forEach((recipe) => {
        
        const card = document.createElement("div");
        card.classList.add("card");
        
        const cardImage = document.createElement("div");
        cardImage.classList.add("cardImage");
        const image = document.createElement("img");
        image.src = "../assets/images/RecipeImage/"+recipe.image;
        image.alt = "recette";
        const timeSpan = document.createElement("span");
        timeSpan.textContent = recipe.time;
        cardImage.appendChild(image);
        cardImage.appendChild(timeSpan);
        card.appendChild(cardImage);
        
        const cardTitle = document.createElement("div");
        cardTitle.classList.add("cardTitle");
        const title = document.createElement("h2");
        title.textContent = recipe.name;
        cardTitle.appendChild(title);
        card.appendChild(cardTitle);
        
        const cardDescribe = document.createElement("div");
        cardDescribe.classList.add("cardDescribe");
        const descriptionHeader = document.createElement("p");
        descriptionHeader.textContent = "RECETTE";
        const description = document.createElement("p");
        description.textContent = recipe.description;
        cardDescribe.appendChild(descriptionHeader);
        cardDescribe.appendChild(description);
        card.appendChild(cardDescribe);
        
        const cardIngredient = document.createElement("div");
        cardIngredient.classList.add("cardIngredient");
        const ingredientsHeader = document.createElement("p");
        ingredientsHeader.textContent = "INGREDIENT";
        const listComponent = document.createElement("div");
        listComponent.classList.add("listComponent");
        
        recipe.ingredients.forEach(ingredient => {
            const listItem = document.createElement("div");
            listItem.classList.add("listItem");
            const ingredientName = document.createElement("p");
            ingredientName.textContent = ingredient.ingredient;
            const ingredientQuantity = document.createElement("span");
            ingredientQuantity.textContent = `${ingredient.quantity} ${ingredient.unit || ''}`;
            listItem.appendChild(ingredientName);
            listItem.appendChild(ingredientQuantity);
            listComponent.appendChild(listItem);
        });
        
        cardIngredient.appendChild(ingredientsHeader);
        cardIngredient.appendChild(listComponent);
        card.appendChild(cardIngredient);
        recipList.appendChild(card);
    });
    nbrRecipe.innerHTML= recipes.length;
}

fetch('../data/recipes.js')
.then(response => response.json())
.then(data => displayRecipes(data))
.catch(err => console.log(err));