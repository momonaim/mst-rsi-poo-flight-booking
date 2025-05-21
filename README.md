# Flight Booking Application

This project is a flight ticket booking application that allows users to search for, book, and manage their flight reservations online.  
It also includes an admin module to manage fare categories, extract statistics, and monitor flight performance.  

## Key Features

- **Flight Search:** Find available flights based on user-selected criteria (date, departure, destination, etc.).  
- **Booking:** Reserve flights and make payments through Stripe integration.  
- **Admin Panel:** Modify or add fare categories, retrieve flight occupancy rates, and analyze customer data.  
- **Statistics:** View charts and reports for data-driven strategic decisions.  

---
## Client Preview

https://github.com/user-attachments/assets/387778f9-9b49-48eb-8bef-c9720bbdffc4


---

## Steps to Run the Project

### Prerequisites

1. **Install Node.js and npm** (for the frontend):
   - Download and install from [Node.js official website](https://nodejs.org/).

2. **Install Java Development Kit (JDK):**
   - Ensure you have JDK 11 or higher installed.

3. **Install MySQL:**
   - Set up a MySQL server and create a database for the application.

4. **Install Maven:**
   - Required for building the Spring Boot backend.

5. **Stripe API Keys:**
   - Obtain the public and secret keys from the [Stripe dashboard](https://dashboard.stripe.com/).

### Backend Setup (Spring Boot)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/momonaim/mst-rsi-poo-flight-booking.git
   cd mst-rsi-poo-flight-booking/server
   ```

2. **Update `application.properties`:**
   - Navigate to `src/main/resources/application.properties` and update the following:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Build the project:**
   ```bash
   mvn clean install
   ```

4. **Run the backend server:**
   ```bash
   mvn spring-boot:run
   ```
   `
   Or use the SpringBoot Extension from VS Code
   `

### Frontend Setup (React)

1. **Navigate to the client directory:**
   ```bash
   cd flight-booking/client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update the Stripe public key:**
   - Open `src/index.js` and replace the placeholder:
     ```javascript
     const stripePromise = loadStripe('your_stripe_public_key');
     ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`.

### Database Initialization

1. **Run initial scripts:**
   - Execute the SQL scripts if needed to initialize the database schema and seed data.

2. **Verify database connection:**
   - Ensure the backend is correctly connected to the MySQL database by checking the logs for successful startup messages.

---

## Stripe API Key Configuration

To enable payment functionality, update the Stripe API keys in the relevant files.

### Backend (Secret Key)

The Stripe secret key must be updated in the following files:  

1. **`server/src/main/java/com/flight/flight_backend/StripeConfig.java`**  
   - Locate the following line:
     ```java
     Stripe.apiKey = "STRIPE_API_SECRET_KEY";
     ```
     Replace `"STRIPE_API_SECRET_KEY"` with your actual Stripe secret key.  

2. **`server/src/main/java/com/flight/flight_backend/controller/PaymentController.java`**  
   - Ensure that the secret key is correctly referenced in all methods interacting with Stripe.  

### Frontend (Public Key)

The Stripe public key must be updated in:  

1. **`client/src/index.js`**  
   - Locate the following line:
     ```javascript
     const stripePromise = loadStripe('STRIPE_API_PUBLIC_KEY');
     ```
     Replace `'STRIPE_API_PUBLIC_KEY'` with your actual Stripe public key.  

---

## Important Notes

- **Security:** Never expose the secret key on the frontend. Use environment variables to securely store the API keys, especially in a production environment.  
- **Stripe Documentation:** For more information about managing API keys, refer to the [official Stripe documentation](https://stripe.com/docs/api).  

---

## Technologies Used

- **Frontend:** React with Material-UI for the user interface.  
- **Backend:** Spring Boot for handling services and REST APIs.  
- **Database:** MySQL for storing flight, customer, and reservation data.  
- **Payment:** Stripe integration for seamless payment management.  

## Contribution

Contributions are welcome! If you'd like to participate, feel free to open an issue or submit a pull request.

---

Thank you for your interest in this flight booking project. 🚀

