# TODO

- [x] Add the user's name in the navbar next to the log-out button
- [x] Fix the modal appearance for private memes  
- [x] "Show password" option in the login form
- [ ] Add a close button in the login form to go back to the home  
- [ ] Indicate which memes are public and which are the private ones  
- [ ] Add more comments
- [ ] Merge `PrivatePage` and `PublicPage` components in `HomePage` by doing something like:
  ```javascript
    return(
        <> 
            { loggedIn ? <private/> : <public/> }
        </>
    )
  ```
- [ ] Merge `PrivateMeme` and `PublicMeme` components
- [ ] _Alert_ instead of a _Modal_ in case of empty text fields
- [ ] `Error 501 page not found` page to redirect wrong URLs. The page should have a Doge in the middle 