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
