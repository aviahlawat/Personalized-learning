// Function to make POST requests to backend
export const makePostRequest = async (data: any) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  try {
    const response = await fetch(`${backendUrl}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
};