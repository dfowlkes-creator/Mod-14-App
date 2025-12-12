# Frontend-Backend Logic Flow and File Purposes

## Overview

This document explains, in detail, how the frontend (React Native) and backend (Spring Boot) parts of your application communicate, what each major file does, and how data flows from the user’s actions to the backend and back. This is written for junior developers and aims to make each step clear.

---

## 1. Frontend (React Native)

### a. Screen Files (UI and Navigation)

#### `AccountTypeSelectionScreen.tsx`

- **Purpose:**  
  Lets users who have both a Customer and Courier account choose which account type they want to use for the current session.
- **How it works:**
  - Receives `customerId` and `courierId` as parameters (from the previous screen or login).
  - When the user taps "Customer", it sets the global account type to "customer" and navigates to the `Restaurants` screen.
  - When the user taps "Courier", it sets the global account type to "courier" and navigates to the `CourierDeliveries` screen.
  - Uses React Navigation to move between screens.

#### Other Screens (e.g., `CustomerAccountScreen.tsx`, `CourierAccountScreen.tsx`, `RestaurantsScreen.tsx`, `CourierDeliveriesScreen.tsx`)

- **Purpose:**  
  Each screen is responsible for displaying and managing a specific part of the app (customer info, courier info, restaurant list, deliveries, etc.).
- **How they work:**
  - Use navigation to move between screens.
  - Fetch data from the backend using API service files.
  - Display data and allow user interactions (viewing orders, updating info, etc.).

### b. API Service Files

#### `services/api.ts` and `services/apiService.ts`

- **Purpose:**  
  These files contain functions that make HTTP requests to the backend API.
- **How they work:**
  - Use `fetch` or `axios` to send requests (GET, POST, PUT, DELETE) to backend endpoints.
  - Handle responses and errors.
  - Export functions like `getUserById`, `getAllUsers`, `createUser`, etc., which are used by the screens.

---

## 2. Backend (Spring Boot)

### a. Controller Layer

#### `UserApiController.java`

- **Purpose:**  
  Exposes REST API endpoints for user-related operations.
- **Endpoints and Logic:**
  - `GET /api/users/{id}`
    - Receives a user ID.
    - Calls the service to fetch user data.
    - Returns user data as a DTO (or 404 if not found).
  - `GET /api/users`
    - Returns a list of all users.
  - `POST /api/users`
    - Receives user data in the request body.
    - Calls the service to create a new user.
    - Returns the created user data.
  - `PUT /api/users/{id}`
    - Receives updated user data.
    - Updates the user with the given ID.
    - Returns the updated user data (or 404 if not found).
  - `DELETE /api/users/{id}`
    - Deletes the user with the given ID.
    - Returns a success message (or 404 if not found).

### b. DTOs (Data Transfer Objects)

#### `ApiUserDTO.java`

- **Purpose:**  
  Represents user data sent to the frontend (e.g., id, username, email).
- **How it works:**
  - Used by the controller to send user data in a safe, structured way.

#### `UserUpdateDTO.java`

- **Purpose:**  
  Represents the data needed to update a user (e.g., new username, new email).
- **How it works:**
  - Used by the controller to receive update data from the frontend.

### c. Service Layer

#### `UserService.java`

- **Purpose:**  
  Contains the business logic for user operations.
- **How it works:**
  - Fetches, creates, updates, and deletes users by interacting with the repository.
  - Converts between entities (database objects) and DTOs (API objects).

### d. Repository Layer

#### User Repository (e.g., `UserRepository.java`)

- **Purpose:**  
  Handles direct database operations for user entities.
- **How it works:**
  - Uses Spring Data JPA to interact with the database.
  - Provides methods like `findById`, `findAll`, `save`, and `deleteById`.

---

## 3. Logic Flow Example

### Example: User Selects Account Type and Fetches Data

1. **User opens the app and logs in.**
2. **`AccountTypeSelectionScreen.tsx` is shown.**
   - Receives `customerId` and `courierId` as navigation parameters.
   - User taps "Customer".
   - The app sets the global account type and navigates to the `Restaurants` screen.
3. **`RestaurantsScreen.tsx` loads.**
   - Calls a function from `apiService.ts` to fetch the list of restaurants.
   - Example API call: `GET /api/restaurants`
4. **Backend receives the request:**
   - The controller (`RestaurantApiController.java`) handles the request.
   - Calls the service to get restaurant data.
   - Service fetches data from the repository (database).
   - Data is converted to DTOs and sent back as a JSON response.
5. **Frontend receives the response:**
   - The screen displays the list of restaurants to the user.

---

## 4. Returned Responses

- **Success:**
  - `200 OK` with data (e.g., user info, restaurant list)
  - `201 Created` for new resources
- **Error:**
  - `404 Not Found` with an error message if the resource is missing
  - `400 Bad Request` for invalid input

---

## 5. File Purposes Summary

- **Frontend `/client/screens/`**:  
  UI and navigation logic for each app screen.
- **Frontend `/client/services/`**:  
  API communication logic.
- **Backend `/controller/api/`**:  
  REST API endpoints.
- **Backend `/dtos/`**:  
  Data transfer objects for API.
- **Backend `/service/`**:  
  Business logic.
- **Backend `/repository/`**:  
  Database access.

---

## 6. Explaining to Others

- **Each screen** in the frontend is responsible for a specific part of the user experience.
- **API service files** handle all communication with the backend, so screens don’t need to know about HTTP details.
- **Controllers** in the backend receive requests, call services, and return responses.
- **Services** contain the main logic and talk to repositories.
- **Repositories** talk to the database.
- **DTOs** are used to safely send and receive data between frontend and backend.

---

## 7. How to Add This Document to .gitignore

Add this line to your `.gitignore` file to prevent this document from being tracked by git:

```
/Damon_Mod-14_App/frontend-backend-logic.md
```

---

This document should help you understand and explain the flow and purpose of each part of your app!
