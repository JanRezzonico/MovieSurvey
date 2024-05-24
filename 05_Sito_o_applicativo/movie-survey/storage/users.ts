let users = Array<string>();

const getUserDifference = (newUsers: Array<string>) => {
    if (!newUsers) return null;
    let diff: { username: string, joined: boolean };
    if (newUsers.length > users.length) {
        const filtered = newUsers.filter((user) => !users.includes(user));
        const username = filtered[filtered.length - 1];
        if (!username) return null;
        diff = { username, joined: true };
    } else {
        const filtered = users.filter((user) => !newUsers.includes(user));
        const username = filtered[filtered.length - 1];
        if (!username) return null;
        diff = { username, joined: false };
    }
    users = newUsers;
    return diff;
}
const deleteUsers = () => {
    users = [];
}

export { getUserDifference, deleteUsers };