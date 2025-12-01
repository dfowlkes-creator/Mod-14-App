# Module 13 – FSO-1613 Mobile Development 1

## ✏️ Prompt - 01

**📎 Context:** Creating a login/authentication page and integrating it into the navigation stack for a React Native Expo app.

How do I create a login/authentication page using a wireframe reference?

## 🤖 Response - 01

To create a login/authentication page based on your wireframe reference:

1. Review the wireframe for required UI elements (logo, input fields, button, etc.).
2. Create a new screen component (e.g., LoginScreen.tsx) in src/navigation/screens/.
3. Build the UI using React Native components and style it to match the wireframe.
4. Add state and logic for form fields and error messages.
5. Integrate the screen into your navigation stack and set it as the initial route if needed.
6. (Optional) Connect to backend for authentication.

Example skeleton for LoginScreen.tsx:

```tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    // Backend integration will be added later
  };

  return (
    <View style={styles.container}>
      {/* Logo component or image can be added here */}
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: { fontSize: 24, marginBottom: 24 },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  error: { color: "red", marginBottom: 12 },
  link: { color: "blue", marginTop: 12 },
});
```

---

## ✏️ Prompt - 02

**📎 Context:** Adding the login screen to the navigation stack and setting it as the initial route.

Add the login screen to navigation (no backend integration yet).

## 🤖 Response - 02

The LoginScreen was added to the navigation stack in App.tsx and set as the initial route:

```tsx
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Details: undefined;
};
import LoginScreen from "./navigation/screens/LoginScreen";
// ...existing code...
<Stack.Navigator initialRouteName="Login">
  <Stack.Screen
    name="Login"
    component={LoginScreen}
    options={{ title: "Login" }}
  />
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{ title: "Overview" }}
  />
  <Stack.Screen name="Details" component={DetailsScreen} />
</Stack.Navigator>;
```

Users now see the login page first when opening the app.

---

## ✏️ Prompt - 03

**📎 Context:** Making the login page identical to the wireframe with proper logo, credentials validation, and navigation to Restaurants page.

I need the login page to be identical to the wireframe authentication page. The page must look identical to the wireframe. I also need for these requirements to be met: Entering the correct credentials for login will take the user to the restaurant page. Display an inline error message above the Login button when attempting to log in with the incorrect credentials.

## 🤖 Response - 03

Updated LoginScreen.tsx to match the wireframe exactly with:

- Rocket Food logo (AppLogoV2.png) displayed at the top with proper styling
- "Sign In" title centered below the logo
- Email and password input fields with proper styling and placeholders
- Hardcoded credentials: email: `user@rocketfood.com`, password: `password123`
- Navigation to Restaurants page on successful login
- Inline error message displayed above the Login button for incorrect credentials
- "Forgot Password?" link at the bottom
- Professional styling matching the wireframe layout

Also created RestaurantsScreen.tsx and added it to the navigation stack.

---

## ✏️ Prompt - 04

**📎 Context:** Fixing image path error preventing the app from loading.

The app won't load due to an image path error.

## 🤖 Response - 04

Fixed the image path in LoginScreen.tsx from `../../assets/Images/AppLogoV2.png` to `../../../assets/Images/AppLogoV2.png` (three directory levels up instead of two). The path needed to go from `src/navigation/screens/` up to the project root to reach the assets folder.

---

## ✏️ Prompt - 05

**📎 Context:** Updating the Restaurants page to match the wireframe exactly with grid layout, images, filters, and bottom navigation.

The app Restaurants page isn't identical to the wireframe. The page needs to look exactly like the wireframe for Restaurants Page (without filter functionality).

## 🤖 Response - 05

Completely redesigned RestaurantsScreen.tsx to match the wireframe with:

- Header section with Rocket Food logo and "LOG OUT" button
- "NEARBY RESTAURANTS" section title
- Rating and Price filter dropdowns (styled in red with "-- Select --" text)
- "RESTAURANTS" section title
- 2-column grid layout for restaurant cards
- Restaurant cards with food images, name, and star ratings
- Sample restaurants: Golden Bar & Grill ($$), WJU Eats ($$), Sweet Dragon ($), Golden Creamery ($), Pizza Paradise ($$), Pasta House ($$)
- Bottom navigation bar with "Restaurants" and "OrderHistory" tabs with icons
- Used actual cuisine images from assets/Images/Restaurants/ folder
- Professional styling matching the wireframe color scheme and layout

---

## ✏️ Prompt - 06

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 06

Paste the AI's answer here

---

## ✏️ Prompt - 04

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 04

Paste the AI's answer here

---

## ✏️ Prompt - 05

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 05

Paste the AI's answer here

---

## ✏️ Prompt - 06

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 06

Paste the AI's answer here

---

## ✏️ Prompt - 07

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 07

Paste the AI's answer here

---

## ✏️ Prompt - 08

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 08

Paste the AI's answer here

---

## ✏️ Prompt - 09

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 09

Paste the AI's answer here

---

## ✏️ Prompt - 10

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 10

Paste the AI's answer here

---

## ✏️ Prompt - 11

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 11

Paste the AI's answer here

---

## ✏️ Prompt - 12

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 12

Paste the AI's answer here

---

## ✏️ Prompt - 13

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 13

Paste the AI's answer here

---

## ✏️ Prompt - 14

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 14

Paste the AI's answer here

---

## ✏️ Prompt - 15

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 15

Paste the AI's answer here

---

## ✏️ Prompt - 16

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 16

Paste the AI's answer here

---

## ✏️ Prompt - 17

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 17

Paste the AI's answer here

---

## ✏️ Prompt - 18

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 18

Paste the AI's answer here

---

## ✏️ Prompt - 19

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 19

Paste the AI's answer here

---

## ✏️ Prompt - 20

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 20

Paste the AI's answer here

---

## ✏️ Prompt - 21

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 21

Paste the AI's answer here

---

## ✏️ Prompt - 22

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 22

Paste the AI's answer here

---

## ✏️ Prompt - 23

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 23

Paste the AI's answer here

---

## ✏️ Prompt - 24

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 24

Paste the AI's answer here

---

## ✏️ Prompt - 25

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 25

Paste the AI's answer here

---

## ✏️ Prompt - 26

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 26

Paste the AI's answer here

---

## ✏️ Prompt - 27

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 27

Paste the AI's answer here

---

## ✏️ Prompt - 28

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 28

Paste the AI's answer here

---

## ✏️ Prompt - 29

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 29

Paste the AI's answer here

---

## ✏️ Prompt - 30

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 30

Paste the AI's answer here

---

## ✏️ Prompt - 31

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 31

Paste the AI's answer here

---

## ✏️ Prompt - 32

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 32

Paste the AI's answer here

---

## ✏️ Prompt - 33

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 33

Paste the AI's answer here

---

## ✏️ Prompt - 34

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 34

Paste the AI's answer here

---

## ✏️ Prompt - 35

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 35

Paste the AI's answer here

---

## ✏️ Prompt - 36

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 36

Paste the AI's answer here

---

## ✏️ Prompt - 37

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 37

Paste the AI's answer here

---

## ✏️ Prompt - 38

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 38

Paste the AI's answer here

---

## ✏️ Prompt - 39

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 39

Paste the AI's answer here

---

## ✏️ Prompt - 40

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 40

Paste the AI's answer here

---

## ✏️ Prompt - 41

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 41

Paste the AI's answer here

---

## ✏️ Prompt - 42

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 42

Paste the AI's answer here

---

## ✏️ Prompt - 43

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 43

Paste the AI's answer here

---

## ✏️ Prompt - 44

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 44

Paste the AI's answer here

---

## ✏️ Prompt - 45

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 45

Paste the AI's answer here

---

## ✏️ Prompt - 46

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 46

Paste the AI's answer here

---

## ✏️ Prompt - 47

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 47

Paste the AI's answer here

---

## ✏️ Prompt - 48

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 48

Paste the AI's answer here

---

## ✏️ Prompt - 49

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 49

Paste the AI's answer here

---

## ✏️ Prompt - 50

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 50

Paste the AI's answer here

---

## ✏️ Prompt - 51

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 51

Paste the AI's answer here

---

## ✏️ Prompt - 52

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 52

Paste the AI's answer here

---

## ✏️ Prompt - 53

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 53

Paste the AI's answer here

---

## ✏️ Prompt - 54

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 54

Paste the AI's answer here

---

## ✏️ Prompt - 55

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 55

Paste the AI's answer here

---

## ✏️ Prompt - 56

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 56

Paste the AI's answer here

---

## ✏️ Prompt - 57

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 57

Paste the AI's answer here

---

## ✏️ Prompt - 58

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 58

Paste the AI's answer here

---

## ✏️ Prompt - 59

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 59

Paste the AI's answer here

---

## ✏️ Prompt - 60

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 60

Paste the AI's answer here

---

## ✏️ Prompt - 61

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 61

Paste the AI's answer here

---

## ✏️ Prompt - 62

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 62

Paste the AI's answer here

---

## ✏️ Prompt - 63

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 63

Paste the AI's answer here

---

## ✏️ Prompt - 64

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 64

Paste the AI's answer here

---

## ✏️ Prompt - 65

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 65

Paste the AI's answer here

---

## ✏️ Prompt - 66

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 66

Paste the AI's answer here

---

## ✏️ Prompt - 67

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 67

Paste the AI's answer here

---

## ✏️ Prompt - 68

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 68

Paste the AI's answer here

---

## ✏️ Prompt - 69

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 69

Paste the AI's answer here

---

## ✏️ Prompt - 70

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 70

Paste the AI's answer here

---

## ✏️ Prompt - 71

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 71

Paste the AI's answer here

---

## ✏️ Prompt - 72

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 72

Paste the AI's answer here

---

## ✏️ Prompt - 73

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 73

Paste the AI's answer here

---

## ✏️ Prompt - 74

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 74

Paste the AI's answer here

---

## ✏️ Prompt - 75

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 75

Paste the AI's answer here

---

## ✏️ Prompt - 76

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 76

Paste the AI's answer here

---

## ✏️ Prompt - 77

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 77

Paste the AI's answer here

---

## ✏️ Prompt - 78

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 78

Paste the AI's answer here

---

## ✏️ Prompt - 79

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 79

Paste the AI's answer here

---

## ✏️ Prompt - 80

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 80

Paste the AI's answer here

---

## ✏️ Prompt - 81

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 81

Paste the AI's answer here

---

## ✏️ Prompt - 82

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 82

Paste the AI's answer here

---

## ✏️ Prompt - 83

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 83

Paste the AI's answer here

---

## ✏️ Prompt - 84

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 84

Paste the AI's answer here

---

## ✏️ Prompt - 85

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 85

Paste the AI's answer here

---

## ✏️ Prompt - 86

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 86

Paste the AI's answer here

---

## ✏️ Prompt - 87

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 87

Paste the AI's answer here

---

## ✏️ Prompt - 88

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 88

Paste the AI's answer here

---

## ✏️ Prompt - 89

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 89

Paste the AI's answer here

---

## ✏️ Prompt - 90

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 90

Paste the AI's answer here

---

## ✏️ Prompt - 91

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 91

Paste the AI's answer here

---

## ✏️ Prompt - 92

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 92

Paste the AI's answer here

---

## ✏️ Prompt - 93

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 93

Paste the AI's answer here

---

## ✏️ Prompt - 94

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 94

Paste the AI's answer here

---

## ✏️ Prompt - 95

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 95

Paste the AI's answer here

---

## ✏️ Prompt - 96

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 96

Paste the AI's answer here

---

## ✏️ Prompt - 97

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 97

Paste the AI's answer here

---

## ✏️ Prompt - 98

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 98

Paste the AI's answer here

---

## ✏️ Prompt - 99

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 99

Paste the AI's answer here

---

## ✏️ Prompt - 100

**📎 Context:** Write what you were working on here

Paste your prompt or question here

## 🤖 Response - 100

Paste the AI's answer here

---
