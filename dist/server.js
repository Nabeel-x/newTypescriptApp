"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./database"));
const app = (0, express_1.default)();
const PORT = 3000;
// Serve static files from the "public" directory
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: 'fakhfakljdh23424',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));
app.post('/auth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.url, req.method, req.hostname);
    const userData = req.body;
    try {
        const sql = `select user,password from users where user = "${userData.name}" and password = "${userData.password}"`;
        const [rows] = yield database_1.default.query(sql);
        const n = rows.length;
        if (n === 1) {
            req.session.user = {
                username: `${userData.name}`
            };
            res.redirect('/dashboard.html');
        }
        else {
            res.send('user not found');
        }
    }
    catch (err) {
        console.log(err);
        console.log('Error executing query');
        res
            .status(500)
            .send("server error");
    }
}));
app.get('/logout', (req, res) => {
    console.log(req.url, req.method, req.hostname);
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('failed to logout');
        }
        res.send('Logged out successfully');
    });
});
app.get('/profile', (req, res) => {
    console.log(req.url, req.method, req.hostname);
    if (req.session.user) {
        res.send(`Hello, user ${req.session.user.username}`);
    }
    else {
        console.error('Sesssion not found');
        res.status(401).send('User not logged in');
    }
});
app.post('/person', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.url, req.method, req.hostname);
    if (!req.session.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const [rows] = yield database_1.default.query('select * from Employees');
        res.json(rows);
    }
    catch (err) {
        console.log("error executing queries");
        res
            .status(500)
            .send('server error');
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
