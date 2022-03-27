const search = document.getElementById("search");

const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");

const resultHeading = document.getElementById("result-heading");

const single_mealEl = document.getElementById("single-meal");

//event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    console.log(item);

    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  mealsEl.innerHTML = "";
  //   resultHeading.innerHTML = "";

  //   console.log(mealInfo);
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});

//get meal by id
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDom(meal);
    });
}
//fetch random meal from api
function getRandomMeal() {
  //clear meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

//add meal to dom
function addMealToDom(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `<div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt=" ${meal.strMeal}">
    <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : " "}
    </div>
    <div class="main">
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
    ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
    
    </ul>
    </div>
    </div>`;
}
//function
//search meal and fetch from api

function searchMeal(e) {
  e.preventDefault();
  //clear single meal
  single_mealEl.innerHTML = " ";

  //get search term
  const term = search.value;
  console.log(term);

  //check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        resultHeading.innerHTML = `<h2>Search results for "${term}": `;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>there is no search results .try again! </p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal"> 
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info"  data-mealID="${meal.idMeal}">
            <h3> ${meal.strMeal}</h3>
        
            </div>
              </div>`
            )
            .join("");
        }
      });

    //clear search text
    search.value = " ";
  } else {
    alert("please enter a search term");
  }
}

// <p>${meal.strInstructions}</p>
