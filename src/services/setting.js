// src/services/setting.js
export async function createSetting(userId) {
  const response = await fetch("/api/settings/createSetting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({userId}),
  });

  if (!response.ok) {
    throw new Error(`Error adding setting: ${response.status}`);
  }

  return response.json();
}

export async function getSettingByID(id) {
  const response = await fetch(`/api/settings/getSettingByID?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log(response?.status);
  }

  return response.json();
}

export async function updateSetting(id, year, month, value) {

    const response = await fetch("/api/settings/updateSetting", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, year, month, value }),
    });
  
    if (!response.ok) {
      throw new Error(`Error updating course: ${response.status}`);
    }
  
    return response.json();
  }
