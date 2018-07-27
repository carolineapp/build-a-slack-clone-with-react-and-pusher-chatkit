require("env2")("../.env");

const instanceLocator = process.env.REACT_APP_INSTANCE_LOCATOR;
const chatkitKey = process.env.REACT_APP_CHATKIT_KEY;
const tokenProvider = process.env.REACT_APP_TOKEN_PROVIDER_URL;

module.exports = { instanceLocator, chatkitKey, tokenProvider };
