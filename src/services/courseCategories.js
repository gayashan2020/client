// src\services\courseCategories.js

export async function addCategories(categoryData) {
  const response = await fetch("/api/courses/addCategories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    throw new Error(`Error adding course: ${response.status}`);
  }

  return response.json();
}

export async function fetchCategories(filter = "") {
  const response = await fetch("/api/courses/getCategories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filter }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
