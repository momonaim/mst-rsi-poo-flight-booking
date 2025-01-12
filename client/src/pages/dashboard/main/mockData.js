// mockData.js

export const mockUsers = [
    { userId: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'admin' },
    { userId: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'user' },
    { userId: 3, name: 'Emma Brown', email: 'emma.brown@example.com', role: 'user' },
    { userId: 4, name: 'David Clark', email: 'david.clark@example.com', role: 'admin' },
    { userId: 5, name: 'Sophia Turner', email: 'sophia.turner@example.com', role: 'user' },
];

export const mockFlights = [
    { flightId: 'FL123', occupancyRate: 0.5, departure: '2025-03-01', destination: 'Paris' },
    { flightId: 'FL124', occupancyRate: 0.75, departure: '2025-03-05', destination: 'New York' },
    { flightId: 'FL125', occupancyRate: 0.4, departure: '2025-03-10', destination: 'Tokyo' },
    { flightId: 'FL126', occupancyRate: 0.85, departure: '2025-03-15', destination: 'London' },
    { flightId: 'FL127', occupancyRate: 0.6, departure: '2025-03-20', destination: 'Berlin' },
    { flightId: 'FL128', occupancyRate: 0.2, departure: '2025-03-25', destination: 'Madrid' },
];

export const mockClients = [
    { clientId: 1, name: 'Alice Cooper', department: 'Finance', reservationCount: 5 },
    { clientId: 2, name: 'Bob Johnson', department: 'Marketing', reservationCount: 2 },
    { clientId: 3, name: 'Charlie Williams', department: 'IT', reservationCount: 3 },
    { clientId: 4, name: 'Diana Martinez', department: 'Finance', reservationCount: 4 },
    { clientId: 5, name: 'Edward Scott', department: 'HR', reservationCount: 1 },
    { clientId: 6, name: 'Fiona Clark', department: 'Marketing', reservationCount: 6 },
];

export const mockTicketCategories = [
    { categoryId: 1, name: 'Economy', price: 150, description: 'Standard class' },
    { categoryId: 2, name: 'Business', price: 500, description: 'Premium class with extra services' },
    { categoryId: 3, name: 'First Class', price: 1000, description: 'Luxurious class with exclusive services' },
    { categoryId: 4, name: 'Junior', price: 100, description: 'For passengers under 18 years old' },
    { categoryId: 5, name: 'Senior', price: 120, description: 'For passengers over 65 years old' },
];
