
export default function (string) {
    return  string.match(/\{([^}]+)\}/)[0]
}