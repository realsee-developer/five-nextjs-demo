import { NextResponse } from "next/server";

/**
 * Global cache for access token (simple in-memory cache for demo purposes).
 * In a production environment, consider using Redis or a more robust caching solution.
 */
let cachedAccessToken: string | null = null;
let tokenExpirationTime: number = 0;

/**
 * Fetches the access token from Realsee Gateway using the configured App Key and App Secret.
 *
 * @returns {Promise<string>} The valid access token.
 * @throws {Error} If environment variables are missing or the Gateway request fails.
 */
async function getAccessToken() {
  const endpoint = process.env.REALSEE_GATEWAY_ENDPOINT;
  const appKey = process.env.REALSEE_GATEWAY_APP_KEY;
  const appSecret = process.env.REALSEE_GATEWAY_APP_SECRET;

  // Check if environment variables are configured
  if (!endpoint || !appKey || !appSecret) {
    throw new Error(
      "Missing environment variables. Please check your .env.local file and ensure REALSEE_GATEWAY_ENDPOINT, REALSEE_GATEWAY_APP_KEY, and REALSEE_GATEWAY_APP_SECRET are set.",
    );
  }

  // Return cached token if valid (with 60s buffer)
  if (cachedAccessToken && Date.now() < tokenExpirationTime - 60000) {
    return cachedAccessToken;
  }

  try {
    const response = await fetch(`${endpoint}/auth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_key: appKey,
        app_secret: appSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get access token from Gateway. Status: ${response.status} ${response.statusText}. Response: ${errorText}`,
      );
    }

    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(
        `Gateway returned error when fetching access token: ${data.message} (Code: ${data.code})`,
      );
    }

    // Cache the token
    cachedAccessToken = data.data.access_token;
    // expires_in is usually in seconds
    tokenExpirationTime = Date.now() + data.data.expires_in * 1000;

    return cachedAccessToken;
  } catch (error: any) {
    console.error("Error in getAccessToken:", error);
    throw error;
  }
}

/**
 * API Handler for GET /api/vr/info
 *
 * Retrieves VR data for a specific resource code.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {NextResponse} The JSON response containing VR data or an error message.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resourceCode = searchParams.get("resourceCode");

  // Validate resourceCode parameter
  if (!resourceCode) {
    return NextResponse.json(
      { error: 'Missing "resourceCode" query parameter.' },
      { status: 400 },
    );
  }

  try {
    // 1. Get a valid access token
    const accessToken = await getAccessToken();
    const endpoint = process.env.REALSEE_GATEWAY_ENDPOINT;

    // 2. Fetch VR info from Realsee Gateway
    const response = await fetch(
      `${endpoint}/open/v3/vr/info?resource_code=${resourceCode}`,
      {
        method: "GET",
        headers: {
          Authorization: accessToken || "",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch VR info from Gateway: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    if (data.code !== 0) {
      return NextResponse.json(
        { error: `Gateway Error: ${data.message} (Code: ${data.code})` },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Handler Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
