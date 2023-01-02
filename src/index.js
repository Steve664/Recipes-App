let result = document.getElementById("result");
let searchBtn = document.getElementById("searchBtn");
let url = "www.themealdb.com/api/json/v1/1/search.php?s=";
let jsonUrl = "http://localhost:3000/meals"
let term = document.getElementById("input")
let current0bj;

document.addEventListener('DOMContentLoaded', () => {
    fetch(jsonUrl)
        .then(resp => resp.json())
        .then(data => data.forEach(element => renderFav(element)))

    let meal = getRandomMeal();
    displayMeal(meal)

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

async function getRandomMeal() {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
    );

    const respData = await resp.json();
    const meals = respData.meals;
    if (meals === null) {
        result.innerHTML = '<h3>Invalid Input</h3>'
    }
    console.log(meals)
    return meals;
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
<img src=${myMeal.strMealThumb} class="img-responsive img-rounded" alt="${myMeal.strMeal}" width="304" height="236">
<div class="details">
    <h2>${myMeal.strMeal}</h2>
    <h4>${myMeal.strArea}</h4>
</div>
<div id="ingredient"></div>
<div id="recipe">
    <pre id="instructions">${myMeal.strInstructions}</pre>
</div>
    <div class="row">
      <h5>Video Recipe</h5>
      <div class="videoWrapper">
        <iframe width="420" height="315"
        src="https://www.youtube.com/embed/${myMeal.strYoutube.slice(-11)}">
        </iframe>
      </div>
    </div>
<button id="saveRecipe">Save Recipe</button>
`;
    let ingredientCon = document.getElementById("ingredient");
    let parent = document.createElement("ul");
    let saveRecipe = document.getElementById("saveRecipe");
    ingredients.forEach((i) => {
        let child = document.createElement("li");
        child.innerText = i;
        parent.appendChild(child);
        ingredientCon.appendChild(parent);
    });
    saveRecipe.addEventListener("click", e => {
        e.preventDefault();
        saveMeal(myMeal);
    });
}

function saveMeal(myMeal) {
    fetch(jsonUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(myMeal)
    })
        .then((response) => response.json())

    displayMeal(current0bj)
}

