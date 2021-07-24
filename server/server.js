'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const memeDao = require('./meme-dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Wrong username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};

// init express
const app = new express(); // FIXME: should we use new?
const PORT = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: '- lorem ipsum dolor sit amet -',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/*** APIs ***/

// GET /api/memes
app.get('/api/memes',
  [ ],
  (req, res) => {
  memeDao.listMemes()
    .then(memes => res.json(memes))
    .catch(() => res.status(500).end());
});

// GET /api/privatememes
app.get('/api/privatememes/',
    isLoggedIn,
    [ ],
    (req, res) => {
        memeDao.listPrivateMemes()
            .then(memes => res.json(memes))
            .catch(() => res.status(500).end());
});

// GET to retrieve all the images
app.get('/api/images',
    (req, res) => {
        memeDao.listImages()
            .then(images => res.json(images))
            .catch(() => res.status(500).end());
});


// Add new meme
// POST /api/memes
app.post('/api/memes',
    isLoggedIn,
    [
      check(['iID', 'sID', 'uID']).isInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter); // format error message
        if (!errors.isEmpty()) {
          return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
        }

        const meme = {
          iID: req.body.iID,
          sID: req.body.sID,
          uID: req.body.uID,
          creator: req.body.creator,
          uname: req.body.uname,
          title: req.body.title,
          visibility: req.body.visibility,
        };

        try {
          const result = await memeDao.createMeme(meme);
          res.json(result);
        } catch (err) {
          res.status(503).json({ error: `Database error during the creation of a new meme: ${err}.` });
        }
});


// Add new sentence
// POST /api/sentences
app.post('/api/sentences',
    isLoggedIn,
    [
      check(['iID']).isInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter); // format error message
        if (!errors.isEmpty()) {
          return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
        }

        const sentence = {
            iID: req.body.iID,
            text1: req.body.text1,
            text2: req.body.text2,
            text3: req.body.text3,
            font: req.body.font,
            color: req.body.color,
        };

        try {
          const result = await memeDao.createSentence(sentence);
          res.json(result);
        } catch (err) {
          res.status(503).json({ error: `Database error during the creation of a new meme: ${err}.` });
        }
});


// DELETE /api/memes/<id>
app.delete('/api/memes/:id',
  isLoggedIn,
  [ check('id').isInt() ],
  async (req, res) => {
    try {
      await memeDao.deleteMeme(req.user.id, req.params.id);
      res.status(200).json({});
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}` });
    }
});


/*** USER APIs ***/

// Login --> POST /sessions
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);  // we sand back an object: { id: row.uID, username: row.email, name: row.name }
    });
  })(req, res, next);
});



// Logout --> DELETE /sessions/current 
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Public view due to unauthenticated user.'});;
});


/*** Other express-related instructions ***/

// Activate the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

