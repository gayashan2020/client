// services/users.js

export async function fetchUsers(filter = "", role) {
    const response = await fetch("/api/users/allUsers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter, role }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

export async function updateUser(userData) {
    const response = await fetch("/api/users/updateUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    return response;
}

export async function approveUser(user) {
    const response = await fetch("/api/users/approveUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: user.email,
            approval: true,
        }),
    });

    return response;
}