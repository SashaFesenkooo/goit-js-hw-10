import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries  from './fetchCountries.js'


import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));


// Получаем данные введенные в инпут и очищаем карточку после удаления

function onInput(e) {
  let  inputValue = e.target.value.trim();
if (!inputValue) {
  resetCard(countryList);
  resetCard(countryInfo);
  
  return;
}
  // фетчим полученные данные в разметку с проверкой на количество найденных значений

fetchCountries(inputValue).then(data =>  {
  
  if (data.length > 10) { 
    Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );

  resetCard(countryList);
  resetCard(countryInfo);
  return;

}

renderMarkup(data);
   
}).catch(err => {
  resetCard(countryList);
  resetCard(countryInfo);

  Notiflix.Notify.failure("Oops, there is no country with that name");
});
}



// ф-ция очистки карточки после удаления введенных данных

function resetCard(card) {
  card.innerHTML = "";
}


// разметка для списка стран
function markupCountryList(countries)  {
return countries.map(

  ({ name, flags }) => 
  `<li class = list> 
  <img class = img_list src = "${flags.svg}" alt = "${name.official}" >
  ${name.official}
  
  </li>`
).join("");

}
// Разметка для полной карточки

function markupCountryInfo(country)  {
  return country.map(({ name, capital, population, flags, languages }) => {
    return `
        <h1 class="name"><img class = img src="${flags.svg} " alt="${
      name.official
    }" ${name.official}</h1>
        <p class="text">Capital: ${capital[0]}</p>
        <p class="text">Population: ${population}</p>
        <p class="text">Languages: ${Object.values(languages).join(',')}</p>
      `;
  });
}
// ф-ия рендера разметки на страницу

function renderMarkup(countries) {
  if (countries.length === 1) {
    resetCard(countryList);
    countryInfo.innerHTML = markupCountryInfo(countries);
  }
  else {
  resetCard(countryInfo);
  countryList.innerHTML = markupCountryList(countries);
  }
}