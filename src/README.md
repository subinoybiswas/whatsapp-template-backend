# WhatsApp Template API

This API provides endpoints to validate and generate previews for WhatsApp message templates.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/subinoybiswas/whatsapp-template-backend
   cd whatsapptemplate
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add any necessary environment variables. For example:
   ```env
   PORT=3000
   ```

## Running the API

1. Start the server:

   ```sh
   npm start
   ```

2. The API will be running at `http://localhost:3000`.

## API Endpoints

### Health Check

- **URL:** `/healthcheck`
- **Method:** `GET`
- **Description:** Check if the API is running.
- **Response:**
  ```json
  {
    "message": "Healthy"
  }
  ```

### Validate Template

- **URL:** `/validate-template`
- **Method:** `POST`
- **Description:** Validate the placeholders in a template.
- **Request Body:**
  ```json
  {
    "template": "Hello, {{ name }}!"
  }
  ```
- **Response:**
  - Success:
    ```json
    {
      "success": true,
      "data": {
        "placeholders": ["name"]
      }
    }
    ```
  - Error:
    ```json
    {
      "success": false,
      "message": "Invalid template format"
    }
    ```

### Generate Preview

- **URL:** `/generate-preview`
- **Method:** `POST`
- **Description:** Generate a preview of the template with provided variables.
- **Request Body:**
  ```json
  {
    "template": "Hello, {{ name }}!",
    "variables": {
      "name": "John"
    }
  }
  ```
- **Response:**
  - Success:
    ```json
    {
      "success": true,
      "data": {
        "preview": "Hello, John!"
      }
    }
    ```
  - Error:
    ```json
    {
      "success": false,
      "message": "Missing variable for placeholder: name"
    }
    ```

## Error Handling

The API includes middleware for handling errors. The error responses follow a consistent format:

- **Error Response Format:**

  ```json
  {
    "success": false,
    "message": "Error message",
    "errors": [
      {
        "msg": "Error detail",
        "param": "parameter name",
        "location": "location of the parameter"
      }
    ]
  }
  ```

- **Common Error Messages:**
  - `Invalid template format`: The template format is incorrect.
  - `Missing variable for placeholder: {placeholder}`: A required variable for a placeholder is missing.
  - `Invalid variable value for placeholder: {placeholder}`: The value provided for a placeholder is invalid.

## Middleware

- **morgan:** HTTP request logger middleware.
- **helmet:** Helps secure the app by setting various HTTP headers.
- **cors:** Enables Cross-Origin Resource Sharing.
- **express-validator:** Middleware for validating and sanitizing request data.

## License

This project is licensed under the MIT License.
