export async function createSetting(userId) {
  const response = await fetch("/api/settings/createSetting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
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

export async function updateYearlyCpd(settingId, year, yearlyTarget) {
  const response = await fetch("/api/settings/updateYearlyCpd", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ settingId, year, yearlyTarget }),
  });

  if (!response.ok) {
    throw new Error(`Error updating yearly CPD: ${response.status}`);
  }

  return response.json();
}

export async function updateMonthlyCpd(settingId, month, monthlyTarget, year) {
  console.log(settingId, month, monthlyTarget, year);
  const response = await fetch("/api/settings/updateMonthlyCpd", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ settingId, month, monthlyTarget, year }),
  });

  if (!response.ok) {
    throw new Error(`Error updating monthly CPD: ${response.status}`);
  }

  return response.json();
}

export async function fetchYearlyCpd(settingId, year) {
  const response = await fetch(
    `/api/settings/fetchYearlyCpd?settingId=${settingId}&year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching yearly CPD: ${response.status}`);
  }

  return response.json();
}

export async function fetchMonthlyCpd(settingId, year, month) {
  const response = await fetch(
    `/api/settings/fetchMonthlyCpd?settingId=${settingId}&year=${year}&month=${month}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching monthly CPD: ${response.status}`);
  }

  return response.json();
}
