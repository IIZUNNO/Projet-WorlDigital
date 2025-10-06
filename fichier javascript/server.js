
// IMPORTATIONS

const express = require("express"); // session
const path = require("path"); // 
const sqlite3 = require("sqlite3").verbose();
const session = require('express-session'); // l'import pour gérer les sessions
const app = express();
app.use(express.urlencoded({ extended: false })); 

// -----------------BASE DE DONNEES----------------------- //

const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error("Erreur lors de l'ouverture de la base de données:", err.message);
    } else {
        console.log("Base de données users.db OK");
    }
});

// creation de la table 'users' si jamais cest le premier lancement ou elle n'existe pas
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// ------------------CONFIGURATION DES SESSIONS------------------- //
app.use(session({
    secret: 'cookieTEST', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// -------------------------------------------------------- //



// ---------------------VERIFICATION-------------------------//

// Middleware de vérification de la session, pour les differentes pages 
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
}

//----------------------------------------------------------//


// ----------------------CHARGEMENT CSS JS IMAGES dans public-----------------//
app.use(express.static(path.join(__dirname, 'public')));

// -------------------LES ROUTES -------------------------------//
// Route pour la page d'accueil (avec vérification si l'utilisateur est connecté ou non)
app.get("/", (req, res) => {
    const userId = req.session.userId;
    res.sendFile(path.join(__dirname, 'views', 'index.html'), {
        userId: userId 
    });
});

// Route pour la page Musique
app.get("/musique", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'musique.html'));
});

// Route pour la page Sport
app.get("/sport", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sport.html'));
});

// Route pour la page Jeux
app.get("/jeux", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'jeux.html'));
});

// Route pour la page Actu Mondiale
app.get("/actu", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'actu.html'));
});

// Route pour afficher la page de création d'un utilisateur (sans vérification)
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Route pour afficher la page de connexion (sans vérification)
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Route pour traiter l'inscription (sans vérification)
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT id FROM users WHERE username = ?", [username], (err, row) => {
        if (row) {
            return res.send("Nom d'utilisateur déjà pris. <a href='/register'>Réessayer</a>");
        }

        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
            if (err) {
                return res.status(500).send("Erreur lors de l'inscription.");
            }
            res.send("Inscription réussie! <a href='/login'>Se connecter</a>");
        });
    });
});

// Route pour traiter la connexion (sans vérification)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT id, password FROM users WHERE username = ?", [username], (err, row) => {
        if (err || !row) {
            return res.send("Nom d'utilisateur ou mot de passe incorrect. <a href='/login'>Réessayer</a>");
        }

        // Comparaison basique du mot de passe
        if (row.password === password) {
            // Enregistrer la session
            req.session.userId = row.id;
            req.session.username = username;
            return res.send(`Bienvenue ${username}! <a href='/'>Retour à la page d'accueil</a>`);
        } else {
            return res.send("Nom d'utilisateur ou mot de passe incorrect. <a href='/login'>Réessayer</a>");
        }
    });
});

// Route pour afficher la liste des utilisateurs (accessible seulement si connecté)
app.get("/users", isAuthenticated, (req, res) => {
    db.all("SELECT id, username FROM users", (err, rows) => {
        if (err) {
            return res.status(500).send("Erreur lors de la récupération des utilisateurs.");
        }
        let usersList = "<h1>Liste des utilisateurs</h1><ul>";
        rows.forEach((user) => {
            usersList += `<li>${user.username}</li>`;
        });
        usersList += "</ul>";
        res.send(usersList);
    });
});

// Route pour afficher la page "Mon Compte" (accessible seulement si connecté)
app.get("/moncompte", isAuthenticated, (req, res) => {
    res.send(`Bienvenue dans votre compte, ${req.session.username}. <a href='/logout'>Se déconnecter</a>`);
});

// Route de déconnexion
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/'); 
        }
        res.clearCookie('sid'); 
        res.redirect('/');
    });
});


// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`ON: http://localhost:${PORT}`);
});
