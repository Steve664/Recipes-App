let result = document.getElementById("result");
let searchBtn = document.getElementById("searchBtn");
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

searchBtn.addEventListener("click", e => {
    let input = document.getElementById('input').value
    getMeal(input)
})

function getMeal(input) {
    fetch(url + input)
        .then(resp => resp.json)
        .then(data => {
            let myMeal = data.meals[0]
            displayMeal(myMeal)
        })
}

