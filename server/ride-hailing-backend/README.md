# Ride Hailing Backend

## Overview
This project is a backend system for a ride-hailing application that focuses on car and bus pooling. It provides functionalities for user authentication, ride requests, booking management, driver and operator management, and pooling services.

## Features
- User registration and authentication
- Booking management for rides and pools
- Driver management including status updates and trip assignments
- Operator management for fleet oversight
- Car and bus pooling functionalities
- Ride matching service to connect riders with drivers
- Notification service for user updates
- Payment processing for bookings

## Project Structure
```
ride-hailing-backend
├── src
│   ├── app.js                  # Entry point of the application
│   ├── config
│   │   └── db.js              # Database connection configuration
│   ├── controllers
│   │   ├── authController.js   # User authentication functions
│   │   ├── bookingController.js # Booking management functions
│   │   ├── driverController.js  # Driver management functions
│   │   ├── operatorController.js # Operator management functions
│   │   ├── poolController.js    # Car and bus pooling functions
│   │   ├── rideController.js    # Ride request handling functions
│   │   └── userController.js    # User profile management functions
│   ├── models
│   │   ├── booking.js           # Booking model
│   │   ├── bus.js               # Bus model
│   │   ├── carpool.js           # Carpool model
│   │   ├── driver.js            # Driver model
│   │   ├── location.js          # Location model
│   │   ├── operator.js          # Operator model
│   │   ├── route.js             # Route model
│   │   ├── routeStop.js         # Route stop model
│   │   ├── user.js              # User model
│   │   └── vehicle.js           # Vehicle model
│   ├── routes
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── bookingRoutes.js     # Booking routes
│   │   ├── driverRoutes.js      # Driver routes
│   │   ├── operatorRoutes.js    # Operator routes
│   │   ├── poolRoutes.js        # Pooling routes
│   │   ├── rideRoutes.js        # Ride management routes
│   │   └── userRoutes.js        # User management routes
│   ├── services
│   │   ├── matchingService.js    # Ride matching logic
│   │   ├── notificationService.js # Notification logic
│   │   └── paymentService.js      # Payment processing logic
│   ├── utils
│   │   └── helpers.js            # Utility functions
│   └── db
│       └── db.sql                # Database schema
├── package.json                  # NPM configuration
├── .env                          # Environment variables
└── README.md                     # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd ride-hailing-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the environment variables in the `.env` file. You can use the `.env.example` as a reference.

4. Set up the database using the SQL schema in `src/db/db.sql`.

5. Start the application:
   ```
   npm start
   ```

## Usage
- Use the provided API endpoints to interact with the application.
- Refer to the individual controller files for detailed information on available functions and their usage.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.