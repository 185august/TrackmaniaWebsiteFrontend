export function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}