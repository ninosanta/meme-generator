'use strict';

/* Data Access Object (DAO) module for accessing memes */

const db = require('./db');

// get all public memes
exports.listMemes = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM memes, sentences, images WHERE memes.sID = sentences.sID AND memes.iID = images.iID";
//    const sql = "SELECT * FROM memes INNER JOIN sentences ON  memes.sID = sentences.id INNER JOIN images ON memes.iID = images.iID INNER JOIN users ON memes.uID = users.uID";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = [ ...rows ];
      resolve(memes.filter(m => m.visibility === "public"));
    });
  });
};

// get all memes, included the private ones
exports.listPrivateMemes = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM memes, sentences, images WHERE memes.sID = sentences.sID AND memes.iID = images.iID";

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = [ ...rows ];
      resolve(memes);
    });
  });
};

// get all images
exports.listImages = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM images";

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const images = [ ...rows ];
      resolve(images);
    });
  });
};

// get a meme identified by {mID}
exports.getMeme = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM memes WHERE mID=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Meme not found.' });
      } else {
        const meme = { ...row };
        resolve(meme);
      }
    });
  });
};


// add a new meme
// the meme id is added automatically by the DB then the meme is returned as result
exports.createMeme = (meme) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO memes (iID, sID, uID, creator, uname, title, visibility) VALUES(?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [meme.iID, meme.sID, meme.uID, meme.creator, meme.uname, meme.title, meme.visibility], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(exports.getMeme(this.lastID));
    });
  });
};


// get a meme identified by {sID}
exports.getSentence = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM sentences WHERE sID=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Sentence not found.' });
      } else {
        const sentence = { ...row };
        resolve(sentence);
      }
    });
  });
};


// add a new sentence
// the sentence id is added automatically by the DB then the sentence is returned as result
exports.createSentence = (sentence) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO sentences (iID, text1, text2, text3, font, color) VALUES(?, ?, ?, ?, ?, ?)';
    db.run(sql, [sentence.iID, sentence.text1, sentence.text2, sentence.text3, sentence.font, sentence.color], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(exports.getSentence(this.lastID));
    });
  });
};

// delete an existing meme and its sentences
exports.deleteMeme = (user, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM memes WHERE mID = ? AND uID = ?';
    const sql1 = 'DELETE FROM sentences WHERE sID IN (SELECT sID FROM memes WHERE mID = ?)';

    db.run(sql1, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });

    db.run(sql, [id, user], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

