let code = '';

const getRoomCode = () => {
    return code;
}
const setRoomCode = (roomId: string) => {
    code = roomId;
}
const deleteRoomCode = () => {
    code = '';
}

export { getRoomCode, setRoomCode, deleteRoomCode };