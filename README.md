<a name="readme-top"></a>

<div align="center">
<h1 align="center">Tucanos</h1>
  <a href="https://tucanos.azurewebsites.net/">
    <img src="asp/ClientApp/src/images/logo.png" alt="Logo" width="200" height="200">
  </a>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li>
      <a href="#project-setup">Project Setup</a>
      <ul>
        <li><a href="#requirments-(step-1)">Requirments (Step 1)</a></li>
        <li><a href="#database-set-up-(step-2)">Database Set Up (Step 2)</a></li>
        <li><a href="#configure-port-(step-4)">Configure Port (Step 3)</a></li>
        <li><a href="#run-the-app-(step-4)">Run The App (Step 4)</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#extra-features">Extra Features</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Tucanos is a fictitous web app that iv'e created from scratch in order
to Hone in my web development skills. It is constructed in a Decoupled and
Extensible architecture and provide a couple of features that comes alongside
it.

The Technologies/Libraries included are:

- ASP.NET Core
- PostgreSQL
- React
- Azure
- Redux
- Bootstrap 4

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project Setup

If you wish to run the application on your own machine please follow the following steps.
<br/>

<ins><strong>Side Note:</strong></ins> Since we aren't really dealing with sensitive data iv'e decided
for simplicity sake and for your comfort to leave a couple of api security keys in the config file
(Which obviously in a not fictitous app this would be a big no-no),this way you can exprience the full
features provided by the app

### Requirments (Step 1)

Make sure you meet these two requiremnts:

- .NET Core 3.1
- PostgreSQL 13 (And the "psql" tool that comes along with it)

### Database Set Up (Step 2)

Grab the .sql file from <a href="https://github.com/Davidwfs83/Tucanos/tree/master/Database_p">here</a>
and run the following psql command.

```sh
   psql --dbname=postgresql://postgres:admin1@127.0.0.1:5432/postgres -f "<.sql file path>"
```

This will clone the tucanos database into your local machine, Just make sure to replace
the <.sql file path> with the proper path to the .sql file you just downloaded.

### Configure Port (Step 3)

This is a small one, Go to the appsettings.json file inside the asp project and adjust
the "Port" property of the "MainDbInfo" property to the port in which your postgres
server is running.

### Run The App (Step 4)

Now you should be good to go, Mount the code into your coding enviroment of choice (Altough I am biased
I recommend Visual Studio) And exprience wonders :)

<!-- CONTACT -->

## Contact

David Waismann - dwaismannd@gmail.com

Linkedin - https://www.linkedin.com/in/david-waismann-743047244/

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Extra Features -->

## Extra Features

* Testing DLL - A DLL dedicated to continuously test the communication between the Server and Database.

* Main admin Developer Panel - A UI panel that provides the main admin the ability to manipulate
all the entities presented in the app and to generate dummy data.

* Worker Threads - Each of those threads wakes up every predetermined interval and perform some
  sort of maintenance job. Examples: Running the Testing DLL, Removing Old Tickets and Flights, Generating
  New Dummy Data.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
