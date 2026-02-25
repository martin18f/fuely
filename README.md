# Fuely – Fuel Cost Calculator

A simple web-based fuel cost calculator for estimating travel expenses.  
Live demo: https://fuely-nine.vercel.app/

---

## 📌 About The Project

**Fuely** is a lightweight web application designed to quickly calculate fuel costs for a trip.

Users can:

- Enter trip distance (km)
- Enter vehicle fuel consumption (L/100 km)
- Enter fuel price (per liter)
- Instantly calculate total fuel cost
- View clear and structured results

The goal of this project is to provide a fast and accurate cost estimation tool for drivers and travelers.

---

## 🧮 Calculation Formula

The application uses the following formula:

Total Cost = (Distance / 100 × Consumption) × Fuel Price

### Example

- Distance: 250 km  
- Consumption: 7.5 L / 100 km  
- Fuel Price: 1.65 € / L  

(250 / 100 × 7.5) × 1.65 = 30.94 €

---

## 🛠️ Built With

- HTML5  
- CSS3  
- Vanilla JavaScript  
- Vercel (Deployment)

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/fuely.git
cd fuely
```

### Run locally

Open `index.html` in your browser  

or use a local server:

```bash
npx serve
```

---

## 📂 Project Structure

```
fuely/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 🔮 Future Improvements

- Multi-currency support (€ / $ / £)
- Round-trip calculation option
- Calculation history storage
- Integration with real-time fuel price APIs
- Enhanced mobile responsiveness
- Dark/light theme switcher

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Created as a practical web project for estimating travel fuel expenses.