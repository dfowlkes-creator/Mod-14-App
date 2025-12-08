# Rocket Food Delivery - Mobile Application

## Project Overview

This is a cross-platform mobile food delivery application built with React Native and Expo, allowing users to browse restaurants, view menus, place orders, and track order history. The backend is powered by Java Spring Boot with MySQL database.

## Differences Between Native and Cross-Platform Mobile Applications

### Native Applications

- **Definition**: Built specifically for one platform (iOS or Android)
- **Languages**: Swift/Objective-C for iOS, Kotlin/Java for Android
- **Performance**: Optimal performance with direct access to device features
- **Development**: Requires separate codebases for each platform
- **Cost**: Higher development and maintenance costs
- **User Experience**: Best possible UI/UX for each platform

### Cross-Platform Applications (This Project)

- **Definition**: Single codebase runs on multiple platforms (iOS, Android, Web)
- **Framework**: Built with React Native and Expo
- **Languages**: JavaScript/TypeScript
- **Performance**: Near-native performance with shared codebase
- **Development**: One codebase for all platforms (~70% code reuse)
- **Cost**: Lower development and maintenance costs
- **User Experience**: Consistent UI/UX across platforms

### Why React Native/Expo Was Chosen

- **Rapid Development**: Hot reload and live preview speed up development
- **Code Reusability**: Write once, deploy to iOS, Android, and Web
- **Large Community**: Extensive libraries and community support
- **Cost-Effective**: Single development team for multiple platforms
- **Easy Updates**: Over-the-air updates without app store approval

---

## Technology Stack

### Frontend (Client)

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library with native stack navigator
- **Axios**: HTTP client for API requests
- **React Native AsyncStorage**: Local data persistence

### Backend (Server)

- **Java 17**: Programming language
- **Spring Boot 3.x**: Backend framework
- **MySQL**: Relational database
- **JPA/Hibernate**: ORM for database operations
- **Spring Security**: Authentication and authorization
- **Maven**: Dependency management

---

## Features Implemented

### 1. Login Page

- User authentication with email and password
- Error handling for incorrect credentials
- Automatic redirection to Restaurants page on success
- Form validation for empty fields

### 2. Restaurants Page

- **Rating Filter**: Filter restaurants by 3, 4, or 5-star ratings
- **Price Filter**: Filter by price range ($, $$, $$$)
- Displays all restaurants when no filters are selected
- Restaurant cards display images randomly selected from `assets/Images/Restaurants/` folder
- Each card shows restaurant name, star rating, and price range
- Grid layout (2 columns) for optimal mobile viewing
- Clicking a restaurant card navigates to the Restaurant Menu / Order Page

### 3. Restaurant Menu Page

- Displays restaurant name, price range, and rating
- Menu items with images, names, descriptions, and prices
- Quantity controls (+ and -) for each menu item
- Dynamic "Create Order" button (disabled when no items selected)
- Real-time total calculation
- Automatic quantity reset when switching restaurants

### 4. Order Confirmation Modal

- Shows selected products with quantities and prices
- Displays total price in proper currency format ($20.95)
- "Confirm Order" button with loading state
- Success feedback with green checkmark icon
- Failure feedback with red X icon
- Automatic modal updates based on order status

### 5. Order History Page

- Table layout with ORDER, STATUS, and VIEW columns
- Magnifying glass (🔍) icon for viewing order details
- Order Detail Modal showing:
  - Order date
  - Courier information
  - Status
  - Complete list of products with prices
  - Order total

### 6. Navigation

- **Header Navigation**:
  - Rocket Food Delivery logo
  - LOG OUT button (redirects to Login)
  - Visible on all pages except Login
- **Footer Navigation**:
  - Restaurants tab (🍔 icon)
  - OrderHistory tab (🕐 icon)
  - Available on Restaurant Menu and Order History pages

### 7. Design & UI

- Consistent color scheme matching wireframe specifications:
  - Orange (#DA583B): Primary buttons and accents
  - Dark Gray (#222126): Text and headers
  - Green (#609475): Success states
  - Red/Orange (#DA583B): Error states
  - Yellow (#F0CB67): Available accent color
  - White (#FFFFFF): Backgrounds
- SafeAreaView implementation for notch/camera cutout handling
- Platform-specific adjustments for Android and iOS
- Responsive design for various screen sizes

---

## Project Structure

```
Damon_Mod-13_App/
├── client/                          # React Native Frontend
│   ├── App.tsx                      # Main app component with navigation
│   ├── package.json                 # Frontend dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── screens/                     # Screen components
│   │   ├── LoginScreen.tsx          # Login page
│   │   ├── RestaurantsScreen.tsx    # Restaurants listing with filters
│   │   ├── RestaurantMenuScreen.tsx # Menu display with ordering
│   │   └── OrderHistoryScreen.tsx   # Order history table
│   ├── services/                    # API service layer
│   │   └── apiService.ts            # HTTP client and API endpoints
│   └── assets/                      # Images and static files
│       └── Images/
│           ├── AppLogoV1.png        # Header logo
│           ├── AppLogoV2.png        # Login logo
│           ├── RestaurantMenu.jpg   # Default menu image
│           └── Restaurants/         # Restaurant cuisine images
│
└── serverJAVA/                      # Spring Boot Backend
    ├── pom.xml                      # Maven dependencies
    ├── src/main/
    │   ├── java/com/rocketFoodDelivery/rocketFood/
    │   │   ├── RocketFoodApplication.java
    │   │   ├── config/              # Configuration classes
    │   │   ├── controller/          # REST API controllers
    │   │   ├── models/              # Entity models
    │   │   ├── repository/          # JPA repositories
    │   │   ├── service/             # Business logic
    │   │   ├── security/            # Authentication
    │   │   └── dtos/                # Data transfer objects
    │   └── resources/
    │       └── application.properties # Database and app config
    └── target/                      # Compiled Java classes
```

---

## Installation and Setup

### Prerequisites

- **Node.js**: Version 16.x or higher
- **npm** or **yarn**: Package manager
- **Java JDK**: Version 17 or higher
- **Maven**: Version 3.x
- **MySQL**: Version 8.x
- **Expo CLI**: Install globally (`npm install -g expo-cli`)
- **Android Studio** (for Android development/testing)
- **Xcode** (for iOS development/testing - macOS only)

### Database Setup

1. **Install MySQL** (if not already installed)

2. **Create Database**:

```sql
CREATE DATABASE mod13_rdelivery;
```

3. **Configure Database Connection**:

   - The database credentials are included in `serverJAVA/src/main/resources/application.properties`
   - Database credentials are also provided in the project deliverables documentation
   - No additional configuration needed - the backend will connect automatically on startup

4. **Database Schema**:
   - The application uses Hibernate with `ddl-auto=update`
   - Tables will be automatically created on first run
   - Sample data is seeded automatically with the `manual-seeding` profile

### Backend Setup (Java Spring Boot)

1. **Navigate to backend directory**:

```bash
cd serverJAVA
```

2. **Install dependencies** (Maven will automatically download):

```bash
mvn clean install
```

3. **Run the Spring Boot application**:

```bash
mvn spring-boot:run
```

4. **Verify backend is running**:
   - Server should start on `http://localhost:8080`
   - Check console for "Started RocketFoodApplication" message
   - Database tables will be created automatically

### Frontend Setup (React Native/Expo)

1. **Navigate to client directory**:

```bash
cd client
```

2. **Install dependencies**:

```bash
npm install
```

3. **Start Expo development server**:

```bash
npx expo start
```

4. **Run on device/emulator**:
   - Press `i` for iOS Simulator (macOS only)
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

---

## Running the Application

### Option 1: iOS Simulator (macOS Only)

1. **Install Xcode** from Mac App Store
2. **Install iOS Simulator**:
   - Open Xcode → Settings → Platforms
   - Download desired iOS runtime
3. **Start backend server**:

```bash
cd serverJAVA
mvn spring-boot:run
```

4. **Start Expo in new terminal**:

```bash
cd client
npx expo start
```

5. **Press `i`** in Expo terminal to launch iOS Simulator

### Option 2: Android Emulator

1. **Install Android Studio**
2. **Create Virtual Device**:
   - Open Android Studio → Device Manager
   - Create new virtual device (e.g., Pixel 7)
3. **Set up Android SDK**:
   - Add to `~/.zshrc` or `~/.bashrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

4. **Reload shell configuration**:

```bash
source ~/.zshrc
```

5. **Start backend server**:

```bash
cd serverJAVA
mvn spring-boot:run
```

6. **Start Expo in new terminal**:

```bash
cd client
npx expo start
```

7. **Press `a`** in Expo terminal to launch Android Emulator

### Option 3: Physical Device

1. **Install Expo Go app** from App Store or Play Store
2. **Ensure device and computer are on same WiFi network**
3. **Start backend and frontend servers** (as above)
4. **Scan QR code** displayed in terminal or Expo Dev Tools

---

## API Endpoints

### Authentication

- `POST /api/customers/login` - User login

### Restaurants

- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants?rating={rating}` - Filter by rating
- `GET /api/restaurants?price_range={price}` - Filter by price
- `GET /api/restaurants?rating={rating}&price_range={price}` - Both filters

### Products

- `GET /api/products/restaurant/{restaurantId}` - Get menu for restaurant

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders/customer/{customerId}` - Get customer order history

---

## Testing Credentials

Use these credentials to test the application:

**Email**: `test@example.com` (or any registered customer email)
**Password**: `password123` (or corresponding password)

_Note: Actual test credentials depend on seeded data in your database._

---

## Key Features & Requirements Met

### Main Requirements

- ✅ Expo project properly set up with all dependencies
- ✅ React Navigation with React Native AsyncStorage
- ✅ Assets correctly placed in resources folder
- ✅ Login page with error handling
- ✅ Restaurants page with Rating and Price filters
- ✅ Restaurant menu page with quantity controls
- ✅ Order confirmation modal with success/failure states
- ✅ Order history page with detail modal
- ✅ Header and Footer navigation
- ✅ Consistent color scheme matching wireframes
- ✅ All wireframe pages implemented and respected

### Extra Features

- ✅ Cross-platform compatibility (iOS and Android)
- ✅ SafeAreaView for proper display on devices with notches
- ✅ Platform-specific padding for Android status bar
- ✅ Loading states for all API calls
- ✅ Error handling with retry options
- ✅ Dynamic rating system (1-5 stars generated on order)
- ✅ Real-time price calculations
- ✅ Responsive card layouts

---

## Third-Party Service Integrations

### Twilio SMS Service

#### Overview

Twilio is a cloud communications platform that enables sending SMS, voice calls, and other messaging services via API. This project integrates Twilio for sending order confirmation and status update SMS notifications to customers.

#### Account Setup Instructions

1. **Create Twilio Account**:

   - Visit [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
   - Click "Sign up" and complete the registration form
   - Verify your email address
   - Complete phone verification (required for account security)

2. **Get Your Credentials**:

   - Log in to [Twilio Console](https://console.twilio.com/)
   - Navigate to the Dashboard home page
   - Locate your **Account SID** and **Auth Token** in the "Account Info" section
   - Copy these credentials (you'll need them for configuration)

3. **Get a Twilio Phone Number**:

   - In the Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
   - Select your country and search for available numbers
   - Choose a number with SMS capabilities
   - Complete the purchase (trial accounts get a free number)
   - Copy your Twilio phone number in E.164 format (e.g., +1234567890)

4. **Configure Trial Account Settings** (if using trial):
   - Navigate to **Phone Numbers** → **Manage** → **Verified Caller IDs**
   - Add and verify recipient phone numbers that will receive test SMS
   - Trial accounts can only send SMS to verified numbers

#### Configuration in Application

**Location**: `serverJAVA/src/main/resources/application.properties`

Update the following properties with your Twilio credentials:

```properties
# Twilio Configuration
twilio.account.sid = ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
twilio.auth.token = your_auth_token_here
twilio.phone.number = +1234567890
```

**Example Configuration**:

```properties
twilio.account.sid = AC1234567890abcdef1234567890abcdef
twilio.auth.token = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
twilio.phone.number = +15551234567
```

#### How to Use Twilio in Java Spring Boot

1. **Add Twilio SDK Dependency** (already included in `pom.xml`):

```xml
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>9.2.0</version>
</dependency>
```

2. **Create Twilio Service Class**:

Create `serverJAVA/src/main/java/com/rocketFoodDelivery/rocketFood/service/TwilioService.java`:

```java
package com.rocketFoodDelivery.rocketFood.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    public void sendOrderConfirmationSMS(String toPhoneNumber, String orderId, double totalAmount) {
        Twilio.init(accountSid, authToken);

        String messageBody = String.format(
            "🚀 Rocket Food Delivery - Order Confirmed!\n\n" +
            "Order #%s\n" +
            "Total: $%.2f\n\n" +
            "Your delicious food is on its way! 🍔",
            orderId, totalAmount
        );

        Message message = Message.creator(
            new PhoneNumber(toPhoneNumber),
            new PhoneNumber(fromPhoneNumber),
            messageBody
        ).create();

        System.out.println("SMS sent successfully. SID: " + message.getSid());
    }
}
```

3. **Integrate with Order Service**:

In `OrderService.java`, inject and use the Twilio service:

```java
@Autowired
private TwilioService twilioService;

public Order createOrder(OrderRequest request) {
    // ... existing order creation logic ...

    // Send SMS notification
    String customerPhone = order.getCustomer().getPhoneNumber();
    twilioService.sendOrderConfirmationSMS(
        customerPhone,
        order.getId().toString(),
        order.getTotalAmount()
    );

    return order;
}
```

#### Testing Twilio Integration

1. **Using Twilio Console**:

   - Go to **Messaging** → **Try it out** → **Send an SMS**
   - Send a test message to verify your setup

2. **Using Application**:

   - Ensure customer records have valid phone numbers in database
   - Place an order through the mobile app
   - Check that SMS is delivered to the customer's phone
   - Verify SMS content and formatting

3. **Check Logs**:
   - Monitor Twilio Console **Logs** section for delivery status
   - Check application console for any error messages

#### Documentation

- Screenshots of Twilio account dashboard showing Account SID and verified phone numbers are included in project deliverables
- Account status: **Active and Verified**

---

### Notify.EU Email Service

#### Overview

Notify.EU is an email notification service that allows sending templated emails to customers. This project uses Notify.EU for sending order confirmations, receipts, and promotional emails.

#### Account Setup Instructions

1. **Create Notify.EU Account**:

   - Visit [https://notify.eu](https://notify.eu) or your regional Notify service
   - Click "Sign up" or "Get Started"
   - Complete the registration form with:
     - Email address
     - Organization/Company name
     - Password
   - Verify your email address via confirmation link

2. **Access Your Dashboard**:

   - Log in to the Notify.EU dashboard
   - Navigate to **Settings** or **API Settings**

3. **Get API Credentials**:

   - Locate the **API Keys** section
   - Copy your **Secret Key** (authentication token)
   - Copy your **Client ID** (organization identifier)
   - Store these securely - they are needed for application configuration

4. **Create Email Template**:

   - Go to **Templates** section in dashboard
   - Click **Create New Template**
   - Design your order confirmation email template with placeholders:
     - `{{customer_name}}` - Customer's full name
     - `{{order_id}}` - Order reference number
     - `{{order_items}}` - List of ordered items
     - `{{total_amount}}` - Order total price
     - `{{delivery_address}}` - Customer's delivery address
   - Save template and copy the **Template ID**

5. **Configure Sender Information**:
   - Navigate to **Sender Settings**
   - Add and verify sender email address (e.g., noreply@rocketfooddelivery.com)
   - Complete domain verification if using custom domain

#### Configuration in Application

**Location**: `serverJAVA/src/main/resources/application.properties`

Update the following properties with your Notify.EU credentials:

```properties
# Notify.EU Configuration
notify.secret.key = sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
notify.client.id = client_xxxxxxxxxxxxxxxxxxxxxxxx
notify.template.id = template-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Example Configuration**:

```properties
notify.secret.key = sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
notify.client.id = client_abc123def456ghi789
notify.template.id = template-1234-5678-90ab-cdef12345678
```

#### How to Use Notify.EU in Java Spring Boot

1. **Add HTTP Client Dependencies** (already in `pom.xml`):

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

2. **Create Notify.EU Service Class**:

Create `serverJAVA/src/main/java/com/rocketFoodDelivery/rocketFood/service/NotifyService.java`:

```java
package com.rocketFoodDelivery.rocketFood.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotifyService {

    @Value("${notify.secret.key}")
    private String secretKey;

    @Value("${notify.client.id}")
    private String clientId;

    @Value("${notify.template.id}")
    private String templateId;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String NOTIFY_API_URL = "https://api.notify.eu/v1/send";

    public void sendOrderConfirmationEmail(String toEmail, String customerName,
                                          String orderId, String orderItems,
                                          double totalAmount) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + secretKey);
            headers.set("X-Client-ID", clientId);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("template_id", templateId);
            requestBody.put("to_email", toEmail);

            Map<String, String> variables = new HashMap<>();
            variables.put("customer_name", customerName);
            variables.put("order_id", orderId);
            variables.put("order_items", orderItems);
            variables.put("total_amount", String.format("$%.2f", totalAmount));

            requestBody.put("variables", variables);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                NOTIFY_API_URL,
                HttpMethod.POST,
                request,
                String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Email sent successfully to: " + toEmail);
            }
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
```

3. **Integrate with Order Service**:

In `OrderService.java`, inject and use the Notify service:

```java
@Autowired
private NotifyService notifyService;

public Order createOrder(OrderRequest request) {
    // ... existing order creation logic ...

    // Format order items for email
    String orderItems = order.getOrderProducts().stream()
        .map(op -> String.format("%s x%d - $%.2f",
            op.getProduct().getName(),
            op.getQuantity(),
            op.getPrice()))
        .collect(Collectors.joining("\n"));

    // Send email notification
    notifyService.sendOrderConfirmationEmail(
        order.getCustomer().getEmail(),
        order.getCustomer().getName(),
        order.getId().toString(),
        orderItems,
        order.getTotalAmount()
    );

    return order;
}
```

#### Testing Notify.EU Integration

1. **Using Notify.EU Dashboard**:

   - Navigate to **Test** section
   - Send a test email using your template
   - Verify template variables are correctly populated

2. **Using Application**:

   - Place an order through the mobile app
   - Check email inbox (including spam/junk folder)
   - Verify email content, formatting, and template variables

3. **Check Logs**:

   - Monitor Notify.EU dashboard **Logs** or **Analytics** section
   - Check email delivery status and open rates
   - Review application console for API response codes

4. **Troubleshooting**:
   - Verify API credentials are correct
   - Ensure sender email is verified
   - Check API rate limits in dashboard
   - Confirm template ID matches created template

#### Documentation

- Screenshots of Notify.EU dashboard showing API credentials (with sensitive data redacted) and template configuration are included in project deliverables
- Account status: **Active and Verified**

---

### Integration Status Summary

Both Twilio and Notify.EU services have been successfully set up:

✅ **Accounts Created**: Both third-party service accounts are active and verified  
✅ **Credentials Configured**: API keys and credentials added to `application.properties`  
✅ **Documentation Provided**: Setup screenshots included in deliverables  
✅ **Implementation Ready**: Service classes can be created following the detailed instructions above

**Current Status**: Configuration complete. The code examples provided above can be implemented to enable full SMS and email notification functionality for order confirmations and customer communications.

---

## Known Issues and Limitations

1. **Network Configuration**:

   - API base URL is configured in `client/services/api.ts` as `http://10.0.0.200:8080`
   - This configuration allows the mobile app (running on emulator or physical device) to communicate with the backend server
   - The IP address `10.0.0.200` is the local network address of the development machine running the Spring Boot backend
   - Both the mobile device/emulator and backend server must be on the same network
   - To use a different IP address, update the `API_BASE_URL` constant in `client/services/api.ts`

2. **Database Credentials**:

   - Database credentials are included in `application.properties` for training purposes
   - Credentials are also documented in the project deliverables
   - For production deployment, credentials should be externalized to environment variables

3. **Image Assets**:
   - Restaurant cards display images randomly selected from available cuisine images in `assets/Images/Restaurants/`
   - Menu items use a shared default image (RestaurantMenu.jpg) as per project requirements
   - Restaurant images are mapped by cuisine keywords (Greek, Japanese, Vietnamese, etc.)

---

## Troubleshooting

### Backend Won't Start

- Verify MySQL is running: `mysql.server status`
- Check database exists: `mysql -u root -p` then `SHOW DATABASES;`
- Verify Java version: `java -version` (should be 17+)
- Check port 8080 is available: `lsof -i :8080`

### Frontend Won't Connect to Backend

- Ensure backend is running on port 8080
- For physical device, update API URL to computer's IP
- Check devices are on same WiFi network
- Verify firewall isn't blocking connections

### Android Emulator Issues

- Ensure Android SDK path is correctly set
- Verify virtual device is created in Device Manager
- Check emulator is running: `adb devices`
- Try cold boot of emulator

### iOS Simulator Issues

- Verify Xcode is installed with Command Line Tools
- Check iOS runtime is downloaded
- Clear derived data if needed
- Restart simulator

---

## Development Workflow

### Making Changes

1. **Backend changes**:

   - Modify Java files in `serverJAVA/src/main/java/`
   - Spring Boot will auto-reload with DevTools
   - Or restart: `mvn spring-boot:run`

2. **Frontend changes**:
   - Modify `.tsx` files in `client/screens/` or `client/services/`
   - Expo hot-reloads automatically
   - Shake device or press `r` to reload manually

### Git Workflow

Current branch: `expo`

Before submission:

```bash
git add .
git commit -m "Final project submission"
git push origin expo
git checkout main
git merge expo
git push origin main
```

---

## Project Requirements Checklist

### Main Requirements

- [x] Expo project with proper dependencies (React Navigation, AsyncStorage, Fortawesome)
- [x] Assets placed in resources folder (Images/Restaurants/)
- [x] Login page with validation and error handling
- [x] Restaurants page with Rating and Price filters
- [x] Restaurant menu showing all items without filtering
- [x] Menu quantities reset to 0 when switching restaurants
- [x] Create Order button disabled when no items selected
- [x] Order Confirmation Modal with selected products
- [x] Prices in currency format (not negative)
- [x] Success/failure messages with icons
- [x] Order History page with table layout
- [x] Order Detail Modal with comprehensive information
- [x] Header navigation (logo + LOG OUT)
- [x] Footer navigation (Restaurants + OrderHistory tabs)
- [x] Colors consistent with wireframes
- [x] All wireframe pages respected

### Extra Miles

- [x] Wireframes consistent across Phone and Android platforms
- [x] Twilio account created (proof provided separately)
- [x] Notify.EU account created (proof provided separately)
- [x] README.md file with comprehensive information
- [x] Student ID screenshot (provided separately)
- [x] Video demonstration (provided separately)
- [x] Development branch merged into main

---

## Credits

**Developer**: Damon Fowlkes
**Course**: Mobile Application Development - Module 13
**Institution**: CodeBoxx
**Framework**: React Native with Expo
**Backend**: Java Spring Boot
**Database**: MySQL

---

## License

This project is developed for educational purposes as part of the CodeBoxx curriculum.

---

## Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Navigation](https://reactnavigation.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## Support

For issues or questions about this project, please contact the development team or refer to the course materials.

**Last Updated**: December 2025
