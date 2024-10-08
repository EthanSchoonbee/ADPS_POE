// Initiate all imports
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
//this is the package that will be used to sanitize the data from the request body
import mongoSanitize from "express-mongo-sanitize";

//this is jsdom package that will be used to create a window object which is for the DOMPurify package
const window = new JSDOM("").window;
//this purify object will be used to sanitize the data from the request body
const purify = DOMPurify(window);

//method middleware to prevent xss attacks. This method will sanitize the data from the request body
const preventXssMiddleware = (req, res, next) => {
    try {
        for (let key in req.body) {
            if (typeof req.body[key] === "string") {
                req.body[key] = purify.sanitize(req.body[key]);
            }
        }
        next();
    } catch (err) {
        next(new Error("XSS prevention failed."));
    }
};

//rate limit method middleware to limit the number of requests that can be made to the server
const rateLimitMiddleware = rateLimit({
    //starting with 15 minutes because the user will be logged in for 15 minutes
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
});

//Preventing no sql injection attacks
//this will be similar to sql injection prevention but for mongoDB
const noSqlInjectionPreventionMiddleware = mongoSanitize();

const securityHeadersMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], //only allowing resources from the same origin
            scriptSrc: ["'self'", "'unsafe-inline'"], //only allowing scripts from the same origin
            styleSrc: ["'self'", "'unsafe-inline'"], //only allowing styles from the same origin
            imgSrc: ["'self'", "data:", "https"], //only allowing images from the same origin and https sites
        },
    },
    frameguard: {
        action: "deny", //prevents the site from being embedded in iframes on other sites
    },
    referrerPolicy: {
        policy: "strict-origin-when-cross-origin", //limits information sent in the referer header
    },
    hsts: {
        maxAge: 31536000, //1 year
        inclueSubDomains: true, //include all subdomains
        preload: true, //preload the site in the browser
    },
});

const removeSensitiveHeadersMiddleware = (req, res, next) => {
    try {
        res.removeHeader("X-Powered-By");
        next();
    } catch (err) {
        next(new Error("Failed to remove sensitive headers."));
    }
};

const securityMiddleware = [
    (req, res, next) => {
        console.log(`[${new Date().toISOString()}] Security middleware applied to ${req.method} ${req.path}`);
        next();
    },
    preventXssMiddleware,
    rateLimitMiddleware,
    noSqlInjectionPreventionMiddleware,
    securityHeadersMiddleware,
    removeSensitiveHeadersMiddleware,
];

export default securityMiddleware;
