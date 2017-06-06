export function print(data, channel, options) {
    console.log(data);
    return Promise.resolve(true);
}

export default {
    print
};