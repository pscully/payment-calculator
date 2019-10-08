const Airtable = require("airtable");
const Base = new Airtable({ apiKey: "keygnXHHKdXsI39wk" }).base(
  "apppdEXyxiUokMWRL"
);

class Model {
  constructor() {
    this.calculations = [];
    console.log(this.calculations);
  }

  bindOnCalculationChange(callback) {
    this.onCalculationChange = callback;
  }

  _commit(calculations) {
    this.onCalculationChange(calculations);
    this.save(calculations);
    this.calculations = [];
  }

  save(calculations) {
    calculations.forEach(calculation => {
      Base("Payments").create([
        {
          fields: {
            Amount: calculation.amount,
            Date: calculation.date
          }
        }
      ]);
    });
  }

  calculate(hours, minutes, rate) {
    console.log("INPUTS", hours, minutes, rate);
    const fraction = minutes / 60;
    const totalTime = parseInt(hours) + fraction;
    const payment = totalTime * rate;
    console.log(typeof totalTime);
    const calculation = {
      amount: payment,
      date: new Date()
    };
    this.calculations.push(calculation);
    console.log(this.calculations);
    this._commit(this.calculations);
  }
}

class View {
  constructor() {
    this.app = this.getElement("#root");
    this.heading = this.createElement("h1");
    this.heading.textContent = "Calculate Payment";
    this.app.appendChild(this.heading);
    this.span = this.createElement("span");
    this.hours = this.createElement("input");
    this.hours.type = "number";
    this.hours.name = "hours";
    this.hours.placeholder = "Hours";
    this.minutes = this.createElement("input");
    this.minutes.type = "number";
    this.minutes.name = "minutes";
    this.minutes.placeholder = "Minutes";
    this.calculate = this.createElement("button");
    this.calculate.textContent = "Calculate";
    this.save = this.createElement("button");
    this.save.textContent = "Save payment";
    this.span.appendChild(this.hours);
    this.span.appendChild(this.minutes);
    this.span.appendChild(this.calculate);
    this.span.appendChild(this.save);
    this.app.appendChild(this.span);
    this.answer = this.createElement("div", "answer");
    this.app.appendChild(this.answer);
    this.rate = 15;
  }

  _clearInput = () => {
    this.hours.value = "";
    this.minutes.value = "";
  };

  get _getHours() {
    return this.hours.value;
  }

  get _getMinutes() {
    return this.minutes.value;
  }

  createElement(element, className) {
    const el = document.createElement(element);
    if (className === undefined) {
      return el;
    } else {
      el.classList.add(className);
      return el;
    }
  }

  getElement(element) {
    const el = document.querySelector(element);
    return el;
  }

  displayResult(calculations) {
    while (this.answer.firstChild) {
      this.answer.removeChild(this.answer.firstChild);
    }

    if (calculations.length === 0) {
      this.message = this.createElement("p");
      this.message.textContent = "No, calculations yet.";
      this.answer.appendChild(this.message);
    } else {
      const last = calculations.length - 1;
      const calculation = calculations[last];
      const p = this.createElement("p");
      p.textContent = `You owe $${calculation.amount}`;
      this.answer.appendChild(p);
    }
  }

  bindCalculate(handler) {
    this.calculate.addEventListener("click", event => {
      console.log("Calculate Clicked");
      if (this._getHours && this._getMinutes) {
        console.log("Hours", this._getHours, "Minutes", this._getMinutes);
        handler(this._getHours, this._getMinutes, this.rate);
        this._clearInput();
      }
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.bindOnCalculationChange(this.onCalculate);
    this.view.bindCalculate(this.handleCalculate);
    this.onCalculate(this.model.calculations);
  }

  onCalculate = calculations => {
    this.view.displayResult(calculations);
  };

  handleCalculate = (hours, minutes, rate) => {
    this.model.calculate(hours, minutes, rate);
  };
}

const app = new Controller(new Model(), new View());
