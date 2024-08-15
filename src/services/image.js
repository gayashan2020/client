// src/services/images.js
export async function uploadImage(file) {
    // Create a FormData object to hold the file and any other data
    const formData = new FormData();
    formData.append("image", file); // Use "image" as the key
  
    // Make a POST request to the "uploadImage" API endpoint
    const response = await fetch("/api/images/upload", {
      method: "POST",
      body: formData, // Send the FormData object directly without JSON.stringify
      // Do not set "Content-Type": "application/json" here because it's multipart/form-data
    });
  
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
  
    const data = await response.json();
    return data.imageUrl; // Assuming the API returns the image URL in this format
  }
  