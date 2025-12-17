# **NestJS UUID Auth \- API Testing Guide (PowerShell Edition)**

To run examples:

```sh
git clone 
cd nestjs-uuid-auth-backend
npm install
npm audit fix
docker compose up -d
docker ps
npm run start:dev
```

Use the following PowerShell commands to test your running application.

**Base URL:** http://localhost:3000 

**Make Sure App is Running**

## **1\. User Management**

### **A. Register a Standard User**

Creates a new user with the default USER role.

```powershell
$body = @{
    name = "Yash Gupta"
    email = "yashg1973@gmail.com"
    password = "yashg1973"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body $body
```

### **B. Register an Admin User**

Since the DTO allows passing a role, we can create an Admin for testing purposes.

```powershell
$body = @{
    name = "Super Admin"
    email = "lastmomenttuitions@gmail.com"
    password = "lastmomenttuitions"
    role = "ADMIN"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body $body
```

## **2\. Authentication Flow**

### **A. Login**

This returns your **UUID Access Token**.

```powershell
$body = @{
    email = "yashg1973@gmail.com"
    password = "yashg1973"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body $body

# Display full response
Write-Output $loginResponse

# Display just the access token
$token = $loginResponse.accessToken
Write-Output $token
```

**Response Example:**

```powershell
{
  "accessToken": "550e8400-e29b-41d4-a716-446655440000",
  "user": {
    "id": "654321...",
    "name": "Yash Gupta",
    "email": "yashg1973@gmail.com",
    "role": "USER"
  }
}
```

**Note:** Copy the accessToken from the response. You will need it for the next steps.

## **3\. Protected Routes**

### **A. Get User Profile (Requires Login)**

Replace \<YOUR\_TOKEN\> with the UUID you received from login and \<USER\_ID\> with the ID of the user.

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/users/<USER_ID>" -Method GET -Headers $headers
```

### **B. Test Admin Authorization**

Try to delete a user.

1. If you use the **User Token** (John), you should get 403 Forbidden (PowerShell will throw an error).  
2. If you use the **Admin Token**, it should succeed.

```powershell
$adminToken = "<ADMIN_TOKEN>"  # Replace with Admin JWT

$headers = @{
    Authorization = "Bearer $adminToken"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/users/<USER_ID>" -Method DELETE -Headers $headers
```

## **4\. Session Management (Redis)**

### **A. Test Max Sessions (3 Limit)**

1. Login 3 times as "John". You will get 3 different UUID tokens.  
2. Login a **4th time**.  
3. Try to use the **1st token** to access a protected route.  
4. It should fail with 401 Unauthorized because the oldest session was removed from Redis and MongoDB.

### **B. Logout**

This invalidates the specific token immediately.

```powershell
$headers = @{
    Authorization = "Bearer $token"  # Replace with the token to logout
}

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/logout" -Method POST -Headers $headers
```

## **5\. Troubleshooting**

If commands fail:

1. **Check connection:** Ensure http://localhost:3000 is reachable.  
2. **Check Database:** Ensure MongoDB and Redis are running (docker ps).  
3. **Inspect Logs:** Check the NestJS console output for errors.