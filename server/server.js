import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const salt = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'marwen'
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "You are not authenticated"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Error: "token is not correct"});
            } else {
                req.name = decoded.name;
                next();
            }
        })
    }
}

app.get('/',verifyUser, (req, res) => {
    return res.json({Status: "Success", name: req.name})
})

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (`name`, `email`, `password`) VALUES (?)";
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ Error: "Please provide name, email, and password" });
    }

    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ Error: "Error hashing password" });
        }

        const values = [name, email, hash];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ Error: "Inserting data Error in server" });
            }
            return res.json({ Status: "Success" });
        });
    });
})

app.post('/create-notes', (req, res) => {
    const sql = "INSERT INTO notes (`title`, `content`) VALUES (?, ?)";
    const { title, content } = req.body;
  
    if (!title || !content) {
      return res.status(400).json({ Error: "Please provide title and content" });
    }
  
    const values = [title, content];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting notes:', err);
        return res.status(500).json({ Error: "Inserting notes Error in server" });
      }
      return res.json({ Status: "Success" });
    });
  });

  app.get('/notes', (req, res) => {
    const sql = "SELECT * FROM notes";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching notes:', err);
        return res.status(500).json({ error: 'Error fetching notes' });
      }
      res.json(result);
    });
});


app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM notes WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting note:', err);
            return res.status(500).json({ Error: "Deleting note error in server" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "Note not found" });
        }
        return res.json({ Status: "Success" });
    });
});

  
  

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ Error: "Internal Server Error" });
});

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [req.body.email], (err, data) => {
        if(err) return res.json({Error: "Login error in server"});
        if(data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if(err) return res.json({Error: "Password compare error"});
                if(response) {
                    const name = data[0].name;
                    const token = jwt.sign({name}, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            })
        } else {
            return res.json({Error: "No email existed"});
        }
    })
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.listen(8080, () => {
    console.log('Server running on port 8080...');
});
