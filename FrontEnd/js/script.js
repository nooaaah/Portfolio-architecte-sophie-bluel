let conferences = []; 


async function getWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    for (let i = 0; i < json.length; i++) {
        setFigure(json[i]);
    }
     
    conferences = document.querySelectorAll('.galleryFigure');

  } catch (error) {
    console.error(error.message);
  }
}

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    for (let i = 0; i < json.length; i++) {
        setFilter(json[i].name, json[i].id);
    }

  } catch (error) {
    console.error(error.message);
  }
}

function setFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}"><figcaption>${data.title}</figcaption>`;
    figure.classList.add('galleryFigure');
    figure.dataset.category = data.categoryId; 
    document.querySelector(".gallery").append(figure);
}


const divFilter = document.createElement('div')
divFilter.setAttribute('id', 'divFilter')

const portfolio = document.querySelector('#portfolio'); 
const gallery = document.querySelector('.gallery'); 

portfolio.insertBefore(divFilter,gallery);

function setFilter(name, id) {
    const button = document.createElement("button");
    button.setAttribute('id', 'filterButton')
    button.classList.add('button');
    button.dataset.filter = id; 
    button.textContent = name; 
    document.querySelector("#divFilter").append(button);
}

  setFilter("tous","all")
    const modify = document.createElement("button");
    modify.setAttribute('class', 'modify-btn')
    modify.setAttribute('id', 'modifyButton')
    modify.innerHTML = `${"Modifer"}`;
    document.querySelector("#divFilter").append(modify);









const buttonList = document.querySelector('#divFilter');
const filterButton = buttonList.querySelectorAll('.button');


divFilter.addEventListener('click', (e) => {
  if (e.target.classList.contains('button')) {
    const buttons = divFilter.querySelectorAll('.button');
    buttons.forEach(btn => btn.classList.remove('active'));
    const filter = e.target.getAttribute('data-filter')
    e.target.classList.add('active');
    filterConf(filter)
  }
});

  

function filterConf(confFilter) {
    conferences.forEach((conf) => {
        const confCategory = conf.dataset.category;
        
        if (confFilter === 'all' || confFilter === confCategory) {
            conf.style.display = 'block';
        } else {
            conf.style.display = 'none';
        }
    });
}






getWorks();
getCategories();



