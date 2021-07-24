/**
 * All the API calls
 */

const BASEURL = '/api';

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // always return {} from server, never null or non json, otherwise it will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyze the cause of error
          response.json()
            .then(obj => reject(obj)) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => reject({ error: "Cannot communicate"  })) // connection error
  });
}

const getMemes = async (visibility) => {
  return getJson(
      ( visibility === "private" )
      ? fetch(BASEURL + '/privatememes')
      : fetch(BASEURL + '/memes')
  );
}

const getImages = async () => {
    return getJson(
        fetch(BASEURL + '/images')
    );
}

function addMeme(meme) {
  return getJson(
    fetch(BASEURL + "/memes", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...meme, user: 1 })
    })
  )
}

function addSentence(sentence) {
    return getJson(
        fetch(BASEURL + "/sentences", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...sentence, user: 1 })
        })
    )
}

function deleteMeme(meme) {
  return getJson(
    fetch(BASEURL + "/memes/" + meme.mID, {
      method: 'DELETE'
    })
  )
}



/*** Session APIs */

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if(response.ok) {
        const user = await response.json();
        return user;  // {id: ..., username: ..., name: ... }
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        } catch(err) {
            throw err;
        }
    }
}

async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
  const response = await fetch(BASEURL + '/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server, mostly unauthenticated user
  }
}

const API = { addMeme, addSentence, getImages, getMemes, deleteMeme, logIn, logOut, getUserInfo }
export default API;

