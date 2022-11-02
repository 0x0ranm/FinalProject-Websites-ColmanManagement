
// Import the neccesary modules 
const url = require("url")
const MovieService = require('../services/movies');
const CreditCardService = require('../services/creditCard');
const customersService = require("../services/customers");
const public_dir_path = "../public"


// Function to get the data on all the movies
const findAll = (req, res) => {

    // Checks if the users is logged in
    if (req.session.username != null) {

        // Gets the user data 
        const customer = customersService.getCustomer(req.session.username)
        customer.then(cust => {

            // Checks if the user exists
            if (cust) {

                // gets the data of all the movies in the DB
                const result = MovieService.getMovies()
                result.then(r => {
                    r['username'] = cust._id

                    // Checks if the user is a admin
                    if (cust.isAdmin == true) {
                        res.render("../views/movies-admin", { movies: r });
                    }
                    else {
                        res.render("../views/movies", { movies: r });
                    }
                })
            }

            // The user doesn't exists so redirects to the home page
            else {
                res.redirect("/")
            }
        })
    }

    // The user isn't logged in so redirects to the home page
    else {
        res.redirect("/")
    }
}

// Function to delete a movie
const deleteMovie = (req, res) => {

    // Checks if the users is logged in
    if (req.session.username != null) {

        // Gets the user data
        const customer = customersService.getCustomer(req.session.username)
        customer.then(cust => {

            // Checks if the user exists
            if (cust) {

                // Checks if the user is a admin
                if (cust.isAdmin == true) {
                    const result = MovieService.deleteMovie(req.body.movie_id)
                    result.then(r => {
                        res.redirect("/movies")
                    })
                }

                // The user isn't an admin so redirect to the main page
                else {
                    res.redirect("/movies")
                }
            }

            // The user doesn't exists so redirects to the home page
            else {
                res.redirect("/")
            }
        })
    }

    // The user isn't logged in so redirects to the home page
    else {
        res.redirect("/")
    }
}


// Function to add a movie to the DB
const addMovie = (req, res) => {

    // Checks if the users is logged in
    if (req.session.username != null) {

        // Gets the user data
        const customer = customersService.getCustomer(req.session.username)
        customer.then(cust => {

            // Checks if the user exists
            if (cust) {

                // Checks if the user is a admin
                if (cust.isAdmin == true) {
                    try {
                        const result = MovieService.addMovie(req.body.title, parseInt(req.body.year, 10), req.body.director, parseInt(req.body.length, 10),
                            req.body.actors.split(","), req.body.genre.split(","), req.body.preview, req.body.link.replace("watch?v=", "embed/"), parseInt(req.body.cost, 10))
                        result.then(r => {
                            res.redirect("/movies")
                        })
                    }
                    catch (e) {
                        res.render("../views/addMovie", { message: { status: "Movie already exists" } })
                    }

                }

                // The user isn't an admin so redirect to the main page
                else {
                    res.redirect("/movies")
                }
            }

            // The user doesn't exists so redirects to the home page
            else {
                res.redirect("/")
            }
        })
    }

    // The user isn't logged in so redirects to the home page
    else {
        res.redirect("/")
    }
}

// Function to get the addMovie page
const addMoviePage = (req, res) => {

    // Checks if the users is logged in
    if (req.session.username != null) {

        // Gets the user data
        const customer = customersService.getCustomer(req.session.username)
        customer.then(cust => {

            // Checks if the user exists
            if (cust) {

                // Checks if the user is a admin
                if (cust.isAdmin == true) {
                    res.render("../views/addMovie", { message: { status: "" } })
                }

                // The user isn't an admin so redirect to the main page
                else {
                    res.redirect("/movies")
                }
            }

            // The user doesn't exists so redirects to the home page
            else {
                res.redirect("/")
            }
        })
    }
    else {

        // The user isn't logged in so redirects to the home page
        res.redirect("/")
    }
}


// Function to get the searchMovies page
const searchMovies = (req, res) => {

    // Checks if the users is logged in
    if (req.session.username != null) {

        // Gets the user data
        const customer = customersService.getCustomer(req.session.username)
        customer.then(cust => {

            // Checks if the user exists
            if (cust) {
                res.render("searchMovies.ejs", { username: { username: cust._id } })
            }

            // The user doesn't exists so redirects to the home page
            else {
                res.redirect("/")
            }
        })
    }

    // The user isn't logged in so redirects to the home page
    else {
        res.redirect("/")
    }
}

// Function to search movies in the DB
const search = (req, res) => {

    // Checks if the users is logged in
    if (req.session.username != null) {

        // Gets the user data
        const customer = customersService.getCustomer(req.session.username)
        customer.then(cust => {

            // Checks if the user exists
            if (cust) {

                // Parse the get request to get both the parameters and the value
                const query = url.parse(req.url).query
                const param = query.split("=")[0]
                const value = query.split("=")[1]
                const result = MovieService.search(param, value)
                result.then(r => {
                    r['username'] = cust._id
                    res.json(r);
                })
            }
            else {

                // The user doesn't exists so redirects to the home page
                res.redirect("/")
            }
        })
    }
    else {

        // The user isn't logged in so redirects to the home page
        res.redirect("/")
    }
}


// Function to update a movie details
const update = (req, res) => {

    // Checks if the users is logged in
    if (req.session.username != null) {

        // Gets the user data
        const customer = customersService.getCustomer(req.session.username)
        customer.then(cust => {

            // Checks if the user exists
            if (cust) {

                // Checks if the user is a admin
                if (cust.isAdmin == true) {
                    MovieService.update(req.body.title, req.body.preview, req.body.director, parseInt(req.body.year, 10), parseInt(req.body.length, 10),
                        req.body.actors.split(","), req.body.genre.split(","), req.body.link.replace("watch?v=", "embed/"), parseInt(req.body.cost, 10))
                    res.redirect("/movies")
                }

                // The user isn't an admin so redirect to the main page
                else {
                    res.redirect("/movies")
                }
            }

            // The user doesn't exists so redirects to the home page
            else {
                res.redirect("/")
            }
        })
    }

    // The user isn't logged in so redirects to the home page
    else {
        res.redirect("/")
    }
}

// Function to add order 
const order = (req, res) => {

    // Checks if the users is logged in
    if (req.session.username != null) {

        // Gets the user data
        const customer = customersService.getCustomer(req.session.username)
        customer.then(cust => {

            // Checks if the user exists
            if (cust) {
                    res.render("addOrder.ejs", { username: { username: cust._id } })
            }

            // The user doesn't exists so redirects to the home page
            else {
                res.redirect("/")
            }
        })
    }

    // The user isn't logged in so redirects to the home page
    else {
        res.redirect("/")
    }
}

// Function to add payment 
const paying = (req, res) => {

    // Checks if the users is logged in
    if (req.session.username != null) {

        // Gets the user data
        const customer = customersService.getCustomer(req.session.username)
        customer.then(cust => {

            // Checks if the user exists
            if (cust) {
                try {
                    const result = CreditCardService.addCard(req.body.cardNumber,req.session.username,req.body.date,req.body.secNum)
                    result.then(r => {
                        res.redirect("/movies")
                    })
                }
                catch (e) {
                    res.render("../views/addMovie", { message: { status: "Movie already exists" } })
                }
                
            }

            // The user doesn't exists so redirects to the home page
            else {
                res.redirect("/")
            }
        })
    }

    // The user isn't logged in so redirects to the home page
    else {
        res.redirect("/")
    }
}

// Exports the neccesary functions
module.exports = {
    findAll,
    deleteMovie,
    addMovie,
    addMoviePage,
    searchMovies,
    search,
    update,
    order,
    paying
};