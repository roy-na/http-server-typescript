function getRequestRoute(request: Buffer) {
    return request.toString().split(' ')[1].split('/')[1]
}
function getFullRequestRoute(request: Buffer) {
    return request.toString().split(' ')[1]
}

export function arrayToObject(array: string[]): { [key: string]: string } {
    return array.reduce((acc, item) => {
        if (item.trim() !== "") {
            const [key, ...rest] = item.split(':');
            acc[key.trim()] = rest.join(':').trim();
        }
        return acc;
    }, {} as { [key: string]: string });
}