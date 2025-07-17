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
        setFilter(json[i]);
    }

  } catch (error) {
    console.error(error.message);
  }
}

function setFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${data.imageUrl} alt= ${data.title}> <figcaption>${data.title}</figcation>`;
    
    document.querySelector(".gallery").append(figure);
}



function setFilter(data) {
    const div = document.createElement("div");
    div.innerHTML = `<button>${data.name}</button>`;
    
    document.querySelector("#portfolio[h2]").appendChild(div);
}


getWorks();
getCategories();

