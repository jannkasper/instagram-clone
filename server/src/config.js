import dotenv from 'dotenv'
dotenv.config();

const config = {
    port: process.env.PORT || 3005,
    protocol: process.env.PROTOCOL || 'http',
    cookiesFilePath: process.env.COOKIE_FILE_PATH || 'cookies.json',
    cookieString: process.env.COOKIE_JSON || '',
    instagramCredentials: {
        username: process.env.INSTA_USERNAME || '',
        password: process.env.INSTA_PASSWORD || ''
    },
};

export default config