
class WebSocket {
    connection(client){
        client.on("disconnect", async () => {
            console.log("disconnect");});
    }
}

export default new WebSocket()