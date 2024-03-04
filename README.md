# pizza-store
 A full-stack application designed for a pizza store, providing functionalities to show, add, delete, and update toppings and recipes.


download node -> [https://nodejs.org/en](https://nodejs.org/en)

open terminal, type `node -v` to verify installation


download project -> [https://github.com/VinceGman/pizza-store](https://github.com/VinceGman/pizza-store)

If you need extra help, see this resource -> [https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)


type `npm install` to install necessary project packages


To make the testing experience smooth, I have included a service-account.json file with the necessary Google Firestore credentials. You will find this file attached to the email that provided you with the link to this project. Please place that file in the root of this project. Otherwise, the project will prompt you how to get this resource for yourself.


then: 

- to run, type `npm start`

- to run as dev, type `npm run dev`

- to run test suites, type `npm run test`


This project focuses on delivering the user story requirements at 2 particular endpoints:

- /owner/toppings
- /chef/recipes

So if you're using the cloud app, you'll want to access:

- [https://pizza-store-data-manager-0978c5d42219.herokuapp.com/owner/toppings](https://pizza-store-data-manager-0978c5d42219.herokuapp.com/owner/toppings)
- [https://pizza-store-data-manager-0978c5d42219.herokuapp.com/chef/recipes](https://pizza-store-data-manager-0978c5d42219.herokuapp.com/chef/recipes)

If you're using the local app, you'll want to access: 

- [http://localhost:5500/owner/toppings](http://localhost:5500/owner/toppings)
- [http://localhost:5500/chef/recipes](http://localhost:5500/chef/recipes)