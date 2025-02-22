export const getUserDetails = async () => {
    try {
        const response = await fetch("https://your-api-url.com/user-details", {
            method: "GET",
            credentials: "include", // If using cookies/session
        });
        if (!response.ok) throw new Error("Failed to fetch user details");
        return await response.json();
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
};
