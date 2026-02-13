
# Five Next.js Demo

This project demonstrates how to integrate **Five** (Realsee's VR rendering engine) into a **Next.js** application. It serves as a reference implementation for getting started with Realsee's VR capabilities.

## Architecture and Best Practices

This project follows **Next.js App Router** and **Vercel Best Practices**:

### 1. Client/Server Separation
-   **Server Components**: `app/(pages)/[resourceCode]/page.tsx` handles routing and metadata (SEO). It imports the heavy VR client component dynamically.
-   **Client Components**: `components/FiveCanvas.tsx` contains all browser-specific logic (Five SDK, DOM manipulation, Window events).
-   **Dynamic Imports**: `components/FiveCanvasWrapper.tsx` uses `next/dynamic` with `{ ssr: false }` to prevent server-side rendering of the VR engine, reducing the initial bundle size.

### 2. State Management & Data Fetching
-   **Zustand**: Used for global state management. The `Five` instance is stored in `hooks/useFiveStore.ts`, keeping it accessible to any component in the application without prop drilling.
-   **SWR**: Used for robust data fetching in `FiveCanvas.tsx`. It handles caching, revalidation, and loading states automatically, ensuring a snappy user experience.

### 3. Project Structure
-   `app/(pages)`: Contains UI routes (e.g., the VR demo page).
-   `app/(apis)`: Contains Backend API routes (e.g., `/api/vr/info`).
-   `components/`: Reusable React components.
-   `hooks/`: Custom hooks (Zustand store).

### 4. Security
-   **Backend Proxy**: The `api/vr/info` route acts as a proxy to the Realsee Gateway. It securely handles `App Key` and `App Secret` on the server, ensuring credentials are never exposed to the client.

## Key Files

-   `app/(pages)/[resourceCode]/page.tsx`: Main entry point for the VR demo.
-   `app/(apis)/api/vr/info/route.ts`: Backend handler for fetching VR data.
-   `components/FiveCanvas.tsx`: Core VR rendering component.
-   `hooks/useFiveStore.ts`: Global state store.

## Prerequisites

Before you begin, ensure you have the following:

-   **Node.js**: Version 18.17 or later.
-   **Realsee Developer Account**: You need a valid `App Key` and `App Secret`.
-   **VR Resource Code**: A valid code (e.g., a Work Code) for the VR content you wish to display.

## Installation

1.  Clone the repository or navigate to the project directory:

    ```bash
    cd five-nextjs-demo
    ```

2.  Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

    > **Note**: If you encounter issues with `sharp`, the installation script handles compatibility automatically.

## Configuration

You must configure your Realsee credentials before running the application.

1.  Create a `.env.local` file in the root directory. You can copy the example file:

    ```bash
    cp .env.local.example .env.local
    ```

2.  Open `.env.local` and update the following variables with your actual credentials:

    ```env
    # The endpoint for the Realsee Gateway (usually https://app-gateway.realsee.ai)
    REALSEE_GATEWAY_ENDPOINT=https://app-gateway.realsee.ai
    
    # Your Realsee App Key
    REALSEE_GATEWAY_APP_KEY=your_app_key_here
    
    # Your Realsee App Secret
    REALSEE_GATEWAY_APP_SECRET=your_app_secret_here
    ```

    > **Important**: Never commit your `.env.local` file to version control to keep your secrets safe.

## Running the Demo

1.  Start the development server:

    ```bash
    npm run dev
    ```

2.  Open your browser and navigate to the following URL format:

    ```
    http://localhost:3000/<YOUR_RESOURCE_CODE>
    ```
    
    Replace `<YOUR_RESOURCE_CODE>` with your actual VR resource code (e.g., `81gM551K00000000`).

3.  The VR scene should load and become interactive.

## Troubleshooting

### "Missing environment variables" Error
-   **Cause**: The `.env.local` file is missing or variables are empty.
-   **Fix**: Ensure `.env.local` exists and contains `REALSEE_GATEWAY_APP_KEY` and `REALSEE_GATEWAY_APP_SECRET`.

### "illegal app_secret" (Code: -2)
-   **Cause**: The App Secret provided in `.env.local` does not match the App Key.
-   **Fix**: Double-check your credentials. Ensure there are no trailing spaces/newlines in the `.env.local` file.

### "Failed to get access token"
-   **Cause**: Network connectivity issues or incorrect Gateway Endpoint.
-   **Fix**: Verify your internet connection and check if `REALSEE_GATEWAY_ENDPOINT` is correct.

### VR Scene is stuck on "Loading..."
-   **Cause**: The API might be failing silently or returning invalid data.
-   **Fix**: Open the browser developer console (F12) and check for red error messages.

## License

This project is licensed under the MIT License.
