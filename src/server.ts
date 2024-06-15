import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import pool from './database';

const app = express();
const PORT: number = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: 'fakhfakljdh23424',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));
app.post('/auth', async (req: Request,res: Response): Promise<void> =>{    
    console.log(req.url,req.method, req.hostname);
    const userData: {readonly name:string,readonly password:string} = req.body;
    try{
        const sql:string = `select user,password from users where user = "${userData.name}" and password = "${userData.password}"`;
        const [rows] = await pool.query(sql);
        const n = (rows as any[]).length;
        if(n === 1){
            req.session.user = {
                username: `${userData.name}`
            }; 
            res.redirect('/dashboard.html');
        }else{
            res.send('user not found');
        }
    }catch(err){
        console.log(err);
        console.log('Error executing query');
        res
        .status(500)
        .send("server error");
    }
});
app.get('/logout',(req:Request,res:Response)=>{
    console.log(req.url,req.method, req.hostname);
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send('failed to logout');
        }
        res.send('Logged out successfully');
    });
});
app.get('/profile',(req:Request,res:Response)=>{
    console.log(req.url,req.method, req.hostname);
    if(req.session.user){
        res.send(`Hello, user ${req.session.user.username}`);
    }else{
        console.error('Sesssion not found');
        res.status(401).send('User not logged in');
    }
});
app.post('/person',async (req: Request,res:Response): Promise<void> =>{
    console.log(req.url,req.method, req.hostname);
    if(!req.session.user){
        res.status(401).send('Unauthorized');
        return;
    }
    try{
        const [rows] = await pool.query('select * from Employees');
        res.json(rows);

    }catch(err){
        console.log("error executing queries");
        res
        .status(500)
        .send('server error');
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
