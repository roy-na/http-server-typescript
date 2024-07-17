function getRequestRoute(request: Buffer) {
    return request.toString().split(' ')[1].split('/')[1]
}
function getFullRequestRoute(request: Buffer) {
    return request.toString().split(' ')[1]
}