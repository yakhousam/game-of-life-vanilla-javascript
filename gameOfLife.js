const grid = {
  gridElement: document.getElementById("grid"),
  btnStart: document.getElementById("btn-start"),
  btnPause: document.getElementById("btn-pause"),
  btnFast: document.getElementById("btn-fast"),
  btnSlow: document.getElementById("btn-slow"),
  btnReset: document.getElementById("btn-reset"),
  generationTxt: document.getElementById("generation"),
  gameModelArea: document.getElementById("game-model"),
  inputGliderGun: document.getElementById("glider-gun"),
  inputPentadecathlon: document.getElementById("pentadecathlon"),
  
  row: 10,
  col: 10,
  speed: 500,
  generation: -1,
  gridArray: [],
  gridArrayNextGeneration: [],
  intervalID: 0,
  gliderGunArray: [[8, 4],[9, 4],[9, 5],[8, 5],[8, 14],[9, 14],[10, 14],[11, 15],[12, 16],[12, 17],[11, 19],[10, 20],[9, 20],[8, 20],[9, 21],[7, 19],[9, 18],[7, 15],[6, 16],[6, 17],[8, 24],[8, 25],[7, 25],[6, 25],[6, 24],[7, 24],[5, 26],[5, 28],[4, 28],[9, 26],[9, 28],[10, 28],[6, 38],[7, 38],[7, 39],[6, 39]],
  pentadecathlonArray:[[11, 20],[12, 20],[13, 21],[13, 19],[14, 20],[15, 20],[16, 20],[17, 20],[18, 21],[18, 19],[19, 20],[20, 20]],
  isThereNewGenration: true,

  plalyGame() {
    

    if (this.intervalID !== 0) {
      return;
    }

    this.intervalID = setInterval(() => {     
        if (this.isThereNewGenration === false) {
        clearInterval(this.intervalID);
        this.intervalID = 0;
        return;
      }
      this.render();      
    }, this.speed);
  },

  render() {    
    for (let i = 0, len = this.gridArray.length; i < len; i++) {
      for (let j = 0, lenj = this.gridArray[i].length; j < lenj; j++) {
        
        let count = this.countCelleAliveAroundMe(i,j);

        if (!this.gridArray[i][j] && count === 3) {
          this.gridArrayNextGeneration[i][j] = true;  
        } else if (this.gridArray[i][j] && count <= 3 && count >= 2) {
          this.gridArrayNextGeneration[i][j] = true;
        } else {
          this.gridArrayNextGeneration[i][j] = false;
        }
      }
    }
    for (let i = 0, len = this.gridArrayNextGeneration.length; i < len; i++) {
      if(i==0 && this.generation > -1){
        this.isThereNewGenration = false;
      }
      for (
        let j = 0, lenj = this.gridArrayNextGeneration[i].length;
        j < lenj;
        j++
      ) {
        if (this.generation > -1) {
          if (this.gridArrayNextGeneration[i][j]) {
            document
              .getElementById(`${"00" + i + "00" + j}`)
              .classList.add("life");
            // document.querySelector(`[data-row = '${i}'][data-col = '${j}']`).classList.add("life")

           
          } else {
            //document.querySelector(`[data-row = '${i}'][data-col = '${j}']`).classList.remove("life");
            document
              .getElementById(`${"00" + i + "00" + j}`)
              .classList.remove("life");
          }
          if(this.gridArray[i][j] !== this.gridArrayNextGeneration[i][j]){
            this.isThereNewGenration = true;
          }
          this.gridArray[i][j] = this.gridArrayNextGeneration[i][j];
        }
      }
    }
    this.generation++;
    if(this.generation > -1 && this.isThereNewGenration === true){
      this.generationTxt.textContent = `Generation : ${this.generation}`;
    }
    
    
  },
  reset() {
    clearInterval(this.intervalID);
    this.intervalID = 0;
    this.setup();
    this.generation = 0;
    this.generationTxt.textContent = "Generation : 0";
    this.gameModelArea.textContent = "";
    this.isThereNewGenration = true;
    

  },
  setup(col, row) {
    this.col = col || 70;
    this.row = row || 50;
    this.speed = 500;
    this.gridArray = Array(this.row)
      .fill()
      .map(() => Array(this.col).fill(false));
    this.gridArrayNextGeneration = Array(this.row)
      .fill()
      .map(() => Array(this.col).fill(false));
    this.gridElement.innerHTML = "";
    this.gridElement.style.gridTemplateColumns = `repeat(${this.col},12px)`;
    this.gridElement.style.gridTemplateRows = `repeat(${this.row},12px)`;

    let inputModelIsChecked = document.querySelector(':checked');
    inputModelIsChecked ? inputModelIsChecked.checked = false : null;
    
    for (let i = 0, len = this.gridArray.length; i < len; i++) {
      for (let j = 0, lenj = this.gridArray[i].length; j < lenj; j++) {
        let boxElement = document.createElement("div");
        boxElement.setAttribute("data-row", i);
        boxElement.setAttribute("data-col", j);
        boxElement.setAttribute("class", "box");
        boxElement.setAttribute("id", "00" + i + "00" + j);
        this.gridElement.appendChild(boxElement);
      }
    }
  },
  events() {
    this.gridElement.addEventListener("click", e => {
      let j = e.target.getAttribute("data-col");
      let i = e.target.getAttribute("data-row");
      this.gridArray[i][j] = !this.gridArray[i][j];
      e.target.classList.toggle("life");
      
      if (this.gridArray[i][j] == false) {
        this.gameModelArea.textContent = this.gameModelArea.textContent.replace(
          `[${i}, ${j}],`,
          ""
        );
      } else {
        this.gameModelArea.textContent += `[${i}, ${j}],`;
      }
    });

    this.btnStart.addEventListener("click", () => {
      this.isThereNewGenration = true;
      this.plalyGame();
    });
    this.btnPause.addEventListener("click", () => {
      clearInterval(this.intervalID);
      this.intervalID = 0;
      this.isThereNewGenration = true;
    });
    this.btnFast.addEventListener("click", () => {
      this.speed -= this.speed >= 50 ? 50 : 0;
      clearInterval(this.intervalID);
      this.intervalID = 0;
      this.plalyGame();
    });
    this.btnSlow.addEventListener("click", () => {
      this.speed += 50;
      clearInterval(this.intervalID);
      this.intervalID = 0;
      this.plalyGame();
    });
    this.btnReset.addEventListener("click", () => {
      this.reset();
    });
    this.inputGliderGun.addEventListener("click", (e) => {
      this.reset();
      e.target.checked = true;
      this.renderModel(this.gliderGunArray);
    });
    this.inputPentadecathlon.addEventListener("click", (e) => {
      this.reset();
      e.target.checked = true;
      this.renderModel(this.pentadecathlonArray);
    });
  },

  renderModel(arr){
    arr.forEach(element => {
      let i = element[0];
      let j = element[1];
      this.gridArray[i][j] = true;
      document.getElementById(`${"00" + i + "00" + j}`).classList.add("life");
      this.gameModelArea.textContent += `[${i}, ${j}],`;
    });
  },

  countCelleAliveAroundMe(i,j) {
    let topLeft =
      typeof this.gridArray[i - 1] !== "undefined" &&
      typeof this.gridArray[i - 1][j - 1] !== "undefined"
        ? this.gridArray[i - 1][j - 1]
        : 0;
    let top =
      typeof this.gridArray[i - 1] !== "undefined" &&
      typeof this.gridArray[i - 1][j] !== "undefined"
        ? this.gridArray[i - 1][j]
        : 0;
    let topRight =
      typeof this.gridArray[i - 1] !== "undefined" &&
      typeof this.gridArray[i - 1][j + 1] !== "undefined"
        ? this.gridArray[i - 1][j + 1]
        : 0;
    let left =
      typeof this.gridArray[i] !== "undefined" &&
      typeof this.gridArray[i][j - 1] !== "undefined"
        ? this.gridArray[i][j - 1]
        : 0;
    let right =
      typeof this.gridArray[i] !== "undefined" &&
      typeof this.gridArray[i][j + 1] !== "undefined"
        ? this.gridArray[i][j + 1]
        : 0;
    let bottomLeft =
      typeof this.gridArray[i + 1] !== "undefined" &&
      typeof this.gridArray[i + 1][j - 1] !== "undefined"
        ? this.gridArray[i + 1][j - 1]
        : 0;
    let bottom =
      typeof this.gridArray[i + 1] !== "undefined" &&
      typeof this.gridArray[i + 1][j] !== "undefined"
        ? this.gridArray[i + 1][j]
        : 0;
    let bottomRight =
      typeof this.gridArray[i + 1] !== "undefined" &&
      typeof this.gridArray[i + 1][j + 1] !== "undefined"
        ? this.gridArray[i + 1][j + 1]
        : 0;
    return (
      topLeft +
      top +
      topRight +
      left +
      right +
      bottomLeft +
      bottom +
      bottomRight
    );
  }
};

grid.setup();
grid.events();

