let ingredientFilter = document.getElementById('ingredientFilter');
let appareilsFilter = document.getElementById('appareilsFilter');
let ustensilesFilter = document.getElementById('ustensilesFilter');
let searchBar = document.getElementById('searchBar');
let recipeCard = document.getElementById('recipList');
let nbrRecipeCard = document.getElementById('nbrRecipe');

searchBar.addEventListener('keyup', searchRecipes);
ingredientFilter.addEventListener('change', ingredientSelector);
appareilsFilter.addEventListener('change', appareilsSelector);
ustensilesFilter.addEventListener('change', ustensilesSelector);

function QuantityOfCard(e){
    let i = 0;
    const recipes = recipeCard.childNodes;
    recipes.forEach(function(recipe){
        if(recipe.className === 'card'){
            let quantity = recipe.style.display;
            if (quantity == 'flex'){
                i +=1;
            }
        }
    });
    nbrRecipeCard.innerHTML = i;
}

function searchRecipes(e){
    let searchTerm = e.target.value.toLowerCase();
    const recipes = recipeCard.childNodes;
    recipes.forEach(function(recipe){
        if(recipe.className === 'card'){
            let recipeName = recipe.childNodes[1].childNodes[0].innerHTML.toLowerCase();
            if(recipeName.includes(searchTerm)){
                recipe.style.display = 'flex';
            }else{
                recipe.style.display = 'none';
            }

        }
    });
    QuantityOfCard()
}

function ingredientSelector(e){
    let ingredientValue = e.target.value.toLowerCase();
    const recipes = recipeCard.childNodes;
    recipes.forEach(function(recipe){
        if(recipe.className === 'card'){
            let ingredients = recipe.childNodes[3].childNodes[1].childNodes;
            ingredients.forEach(function(ingredient){
                let ingredientName = ingredient.childNodes[0].innerHTML.toLowerCase();
                if(ingredientName.toLowerCase().includes(ingredientValue)){
                    recipe.style.display = 'flex';
                }else{
                    recipe.style.display = 'none';
                }
            });
        }
    });
}


function appareilsSelector(e){
    let appareilValue = e.target.value.toLowerCase();
    const recipes = recipeCard.childNodes;
    recipes.forEach(function(recipe){
        if(recipe.className === 'card'){
            let appareils = recipe.childNodes[2].childNodes[2].value.toLowerCase();
            if(appareils.includes(appareilValue)){
                recipe.style.display = 'flex';
            }else{
                recipe.style.display = 'none';
            }
        }
    });
}
            

function ustensilesSelector(e){
    let ustensileValue = e.target.value.toLowerCase();
    const recipes = recipeCard.childNodes;
    recipes.forEach(function(recipe){
        if(recipe.className === 'card'){
            let ustensiles = recipe.childNodes[2].childNodes[3].childNodes;
            ustensiles.forEach(function(ustensile){
                let ustensileName = ustensile.value.toLowerCase();
                if(ustensileName.toLowerCase().includes(ustensileValue)){
                    recipe.style.display = 'flex';
                }else{
                    recipe.style.display = 'none';
                }
            });
        }
    });
}

