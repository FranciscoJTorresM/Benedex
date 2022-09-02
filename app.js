class Ben10ex {
  constructor() {
    this.section = document.getElementById("section-content");
    this.generarMasBen10es = document.getElementById("generarMasBen10es");
    this.generarBen10Aleatorio = document.getElementById(
      "generarBen10Aleatorio"
    );
    this.iconoBuscar = document.getElementById("iconoBuscar");
    this.contenedor_resultados = document.getElementById(
      "contenedor_resultados"
    );
    this.iconoCerrar = document.getElementById("iconoCerrar");
    this.superData = [];
    this.Ben10Actual = "";
    this.cociente = 12;
    this.count = 0;
    this.eventHandler();
  }

  eventHandler() {
    document.addEventListener("DOMContentLoaded", () => {
      this.fetchData();

      M.AutoInit();
    });

    this.generarMasBen10es.addEventListener("click", () => {
      this.cargarBen10es();
    });

    document.addEventListener("click", (ev) => {
      this.aparecerModal(ev);
    });

    this.generarBen10Aleatorio.addEventListener("click", () => {
      this.Ben10Aleatorio();
    });

    this.iconoBuscar.addEventListener("click", () => {
      this.busquedaDeBen10();
    });

    this.iconoCerrar.addEventListener("click", () => {
      this.cancelarBusqueda();
    });
  }

  async fetchData() {
    const response = await fetch("./data.json");
    const data = await response.json();
    this.setSuperData = data;
    this.cargarBen10es();
  }

  set setSuperData(data) {
    this.superData = [...data];
  }

  cargarBen10es() {
    const minidata = this.superData.slice(
      this.cociente * this.count,
      this.cociente * (this.count + 1)
    );
    this.count++;
    this.generarHTML(minidata);
  }

  generarHTML(data) {
    data.map((Ben10, index) => {
      const id = (this.count - 1) * this.cociente + index;
      const { name, ThumbnailImage: urlImage, type } = Ben10;
      if (this.Ben10Actual !== name) {
        const card = document.createElement("div");
        card.classList.add("col");
        card.classList.add("s6");
        card.classList.add("m4");
        card.classList.add("l3");
        card.classList.add("x12");

        if (type.length === 1) {
          card.innerHTML = `
                <div class="card" style="background-color:#3a3a4e">
                  <div class="card-image">
                    <a class="modal-trigger" href="#modal1">
                      <img src="${urlImage}" data-img=${id} />
                    </a>
                  </div>
                  <div class="card-content">
                    <p class="light-blue-text lighten-5">${name}</p>
                  </div>
                  <div class="card-action">
                    <a href="#">${type[0]}</a>
                  </div>
                </div>
          `;
        } else {
          card.classList.add("col");
          card.innerHTML = `
            <div class="card" style="background-color:#3a3a4e">
              <div class="card-image">
                    <a class="modal-trigger" href="#modal1">
                      <img src="${urlImage}" data-img=${id} />
                    </a>
              </div>
              <div class="card-content">
                <p class="light-blue-text lighten-5">${name}</p>
              </div>
              <div class="card-action type-content">
                <a href="#">${type[0]}</a>
               
              </div>
            </div>
      `;
        }
        this.Ben10Actual = name;
        this.section.appendChild(card);
      }
    });
  }

  aparecerModal(ev) {
    const { target } = ev;
    const posicionData = target.getAttribute("data-img");
    if (ev.target.nodeName === "IMG" && posicionData) {
      this.generarContenidoModal(posicionData);
    }
  }

  generarContenidoModal(posicion) {
    const {
      ThumbnailImage: urlImage,
      name,
      abilities,
      general,
      type,
    } = this.superData[posicion];

    const modal_leftContent = document.getElementById("modal_leftContent");
    modal_leftContent.innerHTML = `
    <img src=${urlImage} class="img-modal" />
    `;

    const modal_nombreBen10 = document.getElementById("modal_nombreBen10");
    modal_nombreBen10.textContent = name;

    const habilidadesBen10 = document.getElementById("modal_habilidadesBen10");
    this.limpiarContenido(habilidadesBen10, "Habilidades");
    this.caracteristicasAElementosHTML(abilities, habilidadesBen10);

    const generalBen10 = document.getElementById("modal_generalBen10");
    this.limpiarContenido(generalBen10, "General  ");
    this.caracteristicasAElementosHTML(general, generalBen10);

    const tipoDeBen10 = document.getElementById("modal_tipoDeBen10");
    this.limpiarContenido(tipoDeBen10, "Tipo");
    this.caracteristicasAElementosHTML(type, tipoDeBen10);
  }

  limpiarContenido(elemento, texto = "") {
    elemento.textContent = "";
    elemento.innerHTML = `<h6 class="left-align">${texto}:</h6>`;
  }

  caracteristicasAElementosHTML = (caracteristicas, padre) => {
    caracteristicas.forEach((caracteristica) => {
      const h6Content = document.createElement("h6");
      h6Content.classList.add("col");
      h6Content.classList.add("s4");
      h6Content.textContent = caracteristica;
      padre.appendChild(h6Content);
    });
  };

  Ben10Aleatorio() {
    const numeroAleatorio = Math.round(Math.random() * 10);
    this.generarContenidoModal(numeroAleatorio);
  }

  busquedaDeBen10() {
    const searchInput = document
      .getElementById("searchInput")
      .value.toLowerCase();

    if (searchInput.length > 1) {
      const resultados = [];
      this.superData.filter((elemento) => {
        const { name, id } = elemento;
        const lowerCaseName = name.toLowerCase();
        if (lowerCaseName.startsWith(searchInput)) {
          resultados.push({ name: name, id: id });
        }
      });
      this.Ben10esEncontrados(resultados);
    }
  }

  Ben10esEncontrados(resultados) {
    if (resultados.length > 0) {
      resultados.forEach((elemento) => {
        const { name, id } = elemento;
        document.getElementById("iconoBuscar").style.display = "none";
        document.getElementById("iconoCerrar").style.display = "block";
        this.contenedor_resultados.style.display = "block";
        const element_a = document.createElement("a");
        element_a.classList.add("Ben10Encontrado");
        element_a.classList.add("modal-trigger");
        element_a.setAttribute("href", "#modal1");
        element_a.addEventListener("click", () => {
          this.generarContenidoModal(id - 1);
        });
        element_a.textContent = name;
        this.contenedor_resultados.appendChild(element_a);
      });
    }
  }

  cancelarBusqueda() {
    this.contenedor_resultados.style.display = "none";
    this.contenedor_resultados.innerHTML = ``;
    document.getElementById("iconoCerrar").style.display = "none";
    document.getElementById("iconoBuscar").style.display = "block";
  }
}

const Ben10ES = new Ben10ex();
