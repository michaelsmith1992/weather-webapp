const path = require("path");
const express = require("express");
const hbs = require("hbs");

const app = express();

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// Define Paths for express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirPath))

// Router

app.get("", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.render("index", {
        title: "Weather App",
        name: "Michael Smith"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Page",
        name: "Michael Smith"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        name: "Michael Smith",
        msg: "This is the help page"
    });
});

app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide a search term"
        });
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error
            });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }
            res.send({
                location,
                forecast: forecastData,
                address: req.query.address,
            });
        });
    });
});

app.get("/products", (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        });
    }
    res.send({
        products: []
    });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404 Error Page",
        name: "Michael Smith",
        error: "Help article not found."
    });
});

app.get("*", (req, res) => {
    res.render("404", {
        title: "404 Error Page",
        name: "Michael Smith",
        error: "Page not found."
    });
});

app.listen(3000, () => {
    console.log("server is up on port 3000");
});
