const generateRandomString = (len = 100) => {
    let str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let length = str.length;
    let random = "";
    for (let i = 0; i < len; i++) {
        const post = Math.ceil(Math.random() * (length - 1)); // 0 * length => 0, 1 * (length-1) => lenght-1
        random += str[post];
    }
    return random;
};

module.exports = {
    generateRandomString,
};
