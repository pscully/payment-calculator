class View {
  constructor() {
    this.app = this.getElement("#root");
    this.heading = this.createElement("h1");
    this.heading.textContent = "Calculate Payment";
    this.app.appendChild(this.heading);
    this.span = this.createElement("span");
    this.input = this.createElement("input");
    this.input.type = "number";
    this.input.name = "amount";
    this.calculate = this.createElement("button");
    this.calculate.textContent = "Calculate";
    this.save = this.createElement("button");
    this.save.textContent = "Save payment";
    this.span.appendChild(this.input);
    this.span.appendChild(this.calculate);
    this.span.appendChild(this.save);
    this.app.appendChild(this.span);
  }

  createElement(element) {
    return document.createElement(element);
  }

  getElement(element) {
    const el = document.querySelector(element);
    return el;
  }
}

const app = new View();
