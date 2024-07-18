# Directory of People App

This React appliation written in Typescript calls an API and displays a directory of people from the result data given.


## Description

The project itself contains a framework, a caching fetch library, and a web application.

The framework is complete. It contains:
* A server
* A client runtime
* An MSW mock server, to allow you to run this project without a network connection.

## Required
* [Nodejs v20.x](https://nodejs.org/en)
* [npm v10.5.x](https://www.npmjs.com/package/npm)
* [nvmv0.39.x](https://github.com/nvm-sh/nvm)

## Get started
* Install the above requirements based on your OS: [Mac, Windows or Linux](https://nodejs.org/en/download/package-manager).
* Pull down [repo](https://github.com/rvansant2/react-people-directory-app) using the following command `git clone git@github.com:rvansant2/react-people-directory-app.git`.
* Change into repo directory with the following command `cd react-people-directory-app`.
* Run the following commands to install pacakge dependencies and to run the application on your computer:
```bash
npm i
npm start
```
* Visit [http://localhost:3000](http://localhost:3000) to see the app running. You should see a welcome page with 2 links to other pages. Click on the links and you should see a list of the people directory from the API.

# Issues
* Need to set up hot reloading
    - Changes are not reflected when updates are saved. A restart of the server is required.
* Need layout formatting on pages.
* Need Jest tests.



