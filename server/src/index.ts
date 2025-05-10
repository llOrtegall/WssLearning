import express, { type Request, type Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import ws, { type WebSocket } from "ws";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import morgan from "morgan";
import fs from "node:fs";

// -------------- Interfaces ---------------
interface UserPayload extends JwtPayload{
  id: string;
  username: string;
}

interface WSUD extends WebSocket {
  username?: string;
  id?: string;
}

// -------------- Funtions ----------------
const verifyToken = (token: string) => new Promise<UserPayload | Error>((resolve, reject) => {
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if(err) {
      if(err.name === 'JsonWebTokenError') {
        reject(new Error('Invalid token'));
      } else {
        reject(new Error('error verifying token'));
      }
    }

    resolve(decoded as UserPayload);
  });
})

// ---------------- Express ----------------
const app = express();

app.disable('x-powered-by')
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(morgan("dev"));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/register', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if(!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  // create file if no exist
  if (!fs.existsSync('users.json')) {
    fs.writeFileSync('users.json', '[]');
  }

  // validate max user 10 
  if(JSON.parse(fs.readFileSync('users.json', 'utf-8')).length >= 10) {
    res.status(400).json({ message: 'Max users reached try again tomorrow' });
    return;
  }

  // validate if user not exist
  const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

  const userExist = users.find((user: { username: string }) => user.username === username);

  if(userExist) {
    res.status(400).json({ message: 'User already exists use another username' });
    return;
  }

  const id = crypto.randomUUID();

  // hash password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  users.push({ id, username, password: hash });

  fs.writeFileSync('users.json', JSON.stringify(users));

  res.status(201).json({ message: 'User registered', username });
})

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if(!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

  const user = users.find((user: { username: string }) => user.username === username);

  if(!user) {
    res.status(400).json({ message: 'User or password incorrect' });
    return;
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if(!validPassword) {
    res.status(400).json({ message: 'User or password incorrect' });
    return;
  }

  jwt.sign({ id: user.id, username }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' }, (err, token) => {
    if(err) {
      res.status(500).json({ message: 'Error generating token' });
      return;
    }

    res.status(200).cookie('token', token, { sameSite: 'none', secure: false, httpOnly: false, expires: new Date(Date.now() + 2 * 60 * 60 * 1000) }).json({ message: 'Login successful' });
  });

})

// ---------------- WebSocket ----------------

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new ws.WebSocketServer({ server });

wss.on('connection', async (ws: WSUD, req) => {
  const token = req.headers.cookie 

  if(!token) {
    ws.close();
    return;
  }

  try {
    const decoded = await verifyToken(token.split('=')[1]);
    if(decoded instanceof Error) {
      ws.close();
      return;
    }

    ws.username = decoded.username;
    ws.id = decoded.id;
  } catch (error) {
    console.log(error);
    ws.close();
    return;
  }


  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`Hello ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });


  [...wss.clients].forEach((c: WSUD) => {
    c.send(JSON.stringify({
      type: 'client_connected',
      username: ws.username,
      id: ws.id
    }))
  } )
});
