import axios from "axios";

export const setErrorMessage = (errorMessage, errorObj) => {
    errorObj.value = errorMessage;
    setTimeout(() => {
        errorObj.value = "";
    }, 3000);
};

export const GetCurrentUser = () => {
    const currentUserJson = sessionStorage.getItem("currentUser");
    return JSON.parse(currentUserJson)
};

export const validateUbisoftName = async (requestString, errorMessageObject) => {
    try {
        if (!requestString || typeof requestString !== "string") {
            setErrorMessage("Please enter at least one username.", errorMessageObject);
            return null;
        }

        const requestNamesCleaned = requestString.replace(/\s+/g, "");
        const response = await axios.post(
            `/api/PlayerAccounts/GetAndUpdatePlayerAccounts?ubisoftUsernamesCommaSeperated=${requestNamesCleaned}`
        );
        if (response.status !== 200) {
            setErrorMessage(response.data, errorMessageObject);
            return null;
        }
        const successMessage = response.data.length > 1 ? "Ubisoft names are valid" : "Ubisoft name is valid";
        setErrorMessage(successMessage, errorMessageObject);
        return response.data;
    } catch (error) {
        setErrorMessage(error.response.data, errorMessageObject);
        return null;
    }
};