//On importe les dependances avec NodeJS via la fonction require()
// Permets de charger le module express dans une variable
var express = require("express");
// Création de l'application
var app = express();
// Permets de charger le module express-handlebars dans une variable
var expressHbs = require('express-handlebars');
// Permets de charger le module body-parser dans une variable
var bodyParser = require('body-parser');

// Définit 'hbs' comme moteur de vue pour l'application
// Moteur de vue: Responsable de créer l'HTML des views
app.set('view engine', 'hbs');
app.engine('hbs', expressHbs({
    extname: 'hbs'
}));

// Récupère les données des formulaires de la page, les formate et permets d'y accéder via req.body
app.use(bodyParser.urlencoded({
  // extended:Permets de jouer avec des tableaux
    extended: true
}));

// Permets de charger le module mongoose dans une variable
var mongoose = require('mongoose');
// code de connection a la base de donnée
mongoose.connect('mongodb://localhost/app');
// Création d'un template tâche
var Todo = mongoose.model('Todo', {
 task: {
 type: String,
 required: true
 }
});

// Permets de charges les fichiers statiques se trouvant dans le dossier public
// Permets de se servir directement dans fichiers (images, css...)
app.use(express.static('public'));


// var data = [];
// var counter = 0;

// définit la route basique, vers l'index et la fonction de callback
app.get("/", function(req, res) {
  //Vérifie si il y existe déja une liste de tâches
 Todo.find(function(err, arrayOfItems) {
 res.render("index", {
 item: arrayOfItems
 });
 });
});

// app.post(): Achemine les requetes HTTP POST vers /client_to_server via la fonction de callback spécifiée
app.post("/client_to_server", function(req, res) {
  // crée un objet "Todo" dans lequel il insère les données du formulaire récupérée via le body-parser
 Todo.create({
 task: req.body.userData
 });
 // Redirige vers l'index
 res.redirect("/");
});

// Permets de récupérer une tâche dans la bdd et de la modifier via son id
app.get('/delete/:id', function(req, res) {
  //Cherche l'objet Tâche ayant l'id correspondant dans la bdd
 Todo.findById(req.params.id, function(err, todo) {
 if (!err) { //___Si pas d'erreur lors de la recherche, on supprime
 todo.remove();
 } else { //____Si l'objet n'est pas trouvé dans la Base de Données on retourne une erreur
 return err
 }
 });
 // on retourne à l'index
 res.redirect('/');
});

// Permets d'éditer une tâche, renvoie vers la page d'édition et appelle la fonction de callback
app.get("/edit/:id", function(req, res) {
  // Cherche la tâche correspondante dans la base de donnéevia son id passé en paramètre
 Todo.findById(req.params.id, function(err, task) {
   // renvoie la page HTML "edit" pour pouvoir aller dessus
 res.render("edit", {
 todo: task
 });
 });
});

// Permets de récupérer les données du champ d'édition {TODO: todo} et de modifier la tâche
app.post('/update/:id', function(req, res) {
Todo.findById(req.params.id, function(err, todo) {
  // Permets d'aller modifier a base de données
 todo.task = req.body.updated_task;
 todo.save();
});
// Renvoie à la page d'index
 res.redirect('/');
});

// Redirige vers la page d'exemple statique
app.get('/static', function(req, res) {
    res.sendFile('static_example.html', {
        root: "public"
    });
});
//Rédirige vers l'index
app.get("*", function(req, res) {
    res.redirect("/")
});

// Indique l port écouté par l'application https
app.listen(3000);
// Texte affiché lorsque le serveur htpp fonctionne
console.log("Le serveur est en ligne !");
