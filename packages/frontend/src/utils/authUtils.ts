// Authentication utility functions

export interface AuthResult {
  success?: boolean;
  error?: string;
  message?: string;
  token?: string;
  username?: string;
}

export async function handleAuthRequest(
  endpoint: string,
  formData: FormData,
  isRegistering: boolean
): Promise<AuthResult> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  // Additional validation for registration
  if (isRegistering) {
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (isRegistering) {
        console.log("Successfully created account");
        return { success: true, message: "Successfully created account" };
      } else {
        console.log("Auth token:", data.token);
        return { success: true, token: data.token, username: data.username };
      }
    } else {
      return { error: data.error || "Authentication failed" };
    }
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}
