let admin = false;

const isAdmin = () => {
    return admin;
}
const setAdmin = (value: boolean) => {
    admin = value;
}
const resetAdmin = () => {
    admin = false;
}

export { isAdmin, setAdmin, resetAdmin };