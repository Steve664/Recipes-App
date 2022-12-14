let result = document.getElementById("output");
let searchBtn = document.getElementById("searchBtn");
let url = "www.themealdb.com/api/json/v1/1/search.php?s=";
let jsonUrl = "http://localhost:3000/meals"
let term = document.getElementById("input")
let current0bj;

document.addEventListener('DOMContentLoaded', () => {
    fetch(jsonUrl)
        .then(resp => resp.json())
        .then(data => data.forEach(element => renderFav(element)))

    getRandomMeal()

})


searchBtn.addEventListener("click", () => {
    startUp();
})

async function startUp() {
    const search = term.value;
    const meals = await getMeal(search);

    if (meals) {
        meals.forEach((meal) => {
            displayMeal(meal);
        });
    }
};



function renderFav(element) {
    let details = document.getElementById('details');
    let item = document.createElement('div')
    item.innerHTML = `<span class="Favorites">Name: ${element.strMeal}<br>Cuisine: ${element.strArea}</span>`
    item.addEventListener('click', () => displayMeal(element))
    details.appendChild(item)
}

function getRandomMeal() {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(resp => resp.json())
        .then(data => {
            const meals = data.meals[0]
            displayMeal(meals)
        })
}

async function getMeal(input) {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + input
    );

    const respData = await resp.json();
    const meals = respData.meals;
    if (meals === null) {
        result.innerHTML = '<h3>Invalid Input</h3>'
    }
    console.log(meals)
    current0bj = meals;
    return meals;
}

function displayMeal(recipeObj) {
    let ingredients = [];
    for (const key in recipeObj) {
        if (key.startsWith("strIngredient") && recipeObj[key]) {
            const ingredient = recipeObj[key];
            const measure = recipeObj[key.replace("Ingredient", "Measure")];
            ingredients.push(`${measure} ${ingredient}`);
        }
    }
    console.log(ingredients);
    result.innerHTML = `
<img src=${recipeObj.strMealThumb} class="img-responsive img-rounded" alt="${recipeObj.strMeal}" width="304" height="236">
<div class="details">
    <h2>${recipeObj.strMeal}</h2>
    <h4>${recipeObj.strArea}</h4>
</div>
<div id="ingredient"></div>
<div id="recipe">
    <p id="instructions">${recipeObj.strInstructions}</p>
</div>
    <div class="row">
      <h5>Video Recipe</h5>
      <div class="video">
        <iframe width="420" height="315"
        src="https://www.youtube.com/embed/${recipeObj.strYoutube.slice(-11)}">
        </iframe>
      </div>
    </div>
<button id="saveRecipe">Save Recipe</button>
<button id="randomRecipe">Random Recipe</button>
`;
    let ingredientCon = document.getElementById("ingredient");
    let parent = document.createElement("ul");
    let saveRecipe = document.getElementById("saveRecipe");
    let randomRecipe = document.getElementById("randomRecipe");
    ingredients.forEach((i) => {
        let child = document.createElement("li");
        child.innerText = i;
        parent.appendChild(child);
        ingredientCon.appendChild(parent);
    });
    saveRecipe.addEventListener("click", e => {
        e.preventDefault();
        saveMeal(recipeObj);
    });

    randomRecipe.addEventListener("click", e => {
        e.preventDefault();
        getRandomMeal();
    });
}

function saveMeal(recipeObj) {
    fetch(jsonUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(recipeObj)
    })
        .then((response) => response.json())

    displayMeal(current0bj)
}

