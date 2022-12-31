let result = document.getElementById("result");
let searchBtn = document.getElementById("searchBtn");
let url = "www.themealdb.com/api/json/v1/1/search.php?s=";
let term = document.getElementById("input")

searchBtn.addEventListener("click", async () => {

    const search = term.value;
    const meals = await getMeal(search);

    if (meals) {
        meals.forEach((meal) => {
            displayMeal(meal);
        });
    }
});



async function getMeal(input) {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + input
    );

    const respData = await resp.json();
    const meals = respData.meals;

    return meals;
}

function displayMeal(myMeal) {
    let count = 1;
    let ingredients = [];
    for (let i in myMeal) {
        let ingredient = "";
        let measure = "";
        if (i.startsWith("strIngredient") && myMeal[i]) {
            ingredient = myMeal[i];
            measure = myMeal[`strMeasure` + count];
            count += 1;
            ingredients.push(`${measure} ${ingredient}`);
        }
    }
    console.log(ingredients);
    result.innerHTML = `
<img src=${myMeal.strMealThumb}>
<div class="details">
    <h2>${myMeal.strMeal}</h2>
    <h4>${myMeal.strArea}</h4>
</div>
<div id="ingredient-con"></div>
<div id="recipe">
    <button id="hide-recipe">X</button>
    <pre id="instructions">${myMeal.strInstructions}</pre>
</div>
<button id="show-recipe">View Recipe</button>
`;
    let ingredientCon = document.getElementById("ingredient-con");
    let parent = document.createElement("ul");
    let recipe = document.getElementById("recipe");
    let hideRecipe = document.getElementById("hide-recipe");
    let showRecipe = document.getElementById("show-recipe");
    ingredients.forEach((i) => {
        let child = document.createElement("li");
        child.innerText = i;
        parent.appendChild(child);
        ingredientCon.appendChild(parent);
    });
    hideRecipe.addEventListener("click", () => {
        recipe.style.display = "none";
    });
    showRecipe.addEventListener("click", () => {
        recipe.style.display = "block";
    });
}


