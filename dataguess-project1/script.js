const countryList = document.getElementById('countries-list');
const filterInput = document.getElementById('filter-input');
let selectedCountryIndex = -1;

// GraphQL API'ye sorgu gönderme işlevi
function queryFetch(query, variables = {}) {
  return fetch('https://countries.trevorblades.com/', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  })
  .then(res => res.json())
  .catch(error => {
    console.error('API sorgusu hatası:', error);
    return { data: null };
  });
}

// Ülkeleri sorgulama ve liste oluşturma
queryFetch(`
  query Query {
    countries {
      name
      capital
    }
  }
`)
.then(data => {
  const countries = data.data.countries;

  countries.forEach((country, index) => {
    const countryItem = document.createElement('div');
    countryItem.className = 'country-item';
    countryItem.textContent = `${country.name} (Capital: ${country.capital})`;

    // Ülke tıklanabilirliği
    countryItem.addEventListener('click', () => {
      if (selectedCountryIndex !== -1) {
        const selectedCountry = document.querySelector('.selected');
        selectedCountry.classList.remove('selected');
      }
      countryItem.classList.add('selected');
      selectedCountryIndex = index;
    });

    countryList.appendChild(countryItem);
  });


  selectAutoItem();
})
.catch(error => {
  console.error('Ülke sorgusu hatası:', error);
});

// Filtreleme işlemi
filterInput.addEventListener('input', () => {
  const inputValue = filterInput.value.toLowerCase();
  const countryElements = Array.from(countryList.getElementsByClassName('country-item'));
  countryElements.forEach(element => {
    const countryName = element.textContent.toLowerCase();

    // Arama terimine göre filtreleme
    if (countryName.includes(inputValue)) {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  });


  selectAutoItem();
});

// Otomatik olarak 10. öğeyi veya son öğeyi seçme işlemi
function selectAutoItem() {
  const countryElements = Array.from(countryList.getElementsByClassName('country-item'));
  const filteredCountryElements = countryElements.filter(element => element.style.display !== 'none');

  if (filteredCountryElements.length > 0) {
    let autoSelectIndex = Math.min(9, filteredCountryElements.length - 1); 
    if (selectedCountryIndex !== autoSelectIndex) {
      // Seçili öğeyi güncelle
      selectedCountryIndex = autoSelectIndex;
      // Önceki seçimi kaldır
      const selectedCountry = document.querySelector('.selected');
      if (selectedCountry) {
        selectedCountry.classList.remove('selected');
      }
      // Yeni öğeyi seç
      filteredCountryElements[autoSelectIndex].classList.add('selected');
    }
  }
}
