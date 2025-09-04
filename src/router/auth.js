export function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}