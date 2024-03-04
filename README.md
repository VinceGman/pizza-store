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


Project Overview

This project is designed to be an add-on to a fully functioning pizza store application. It uses two specific endpoints meant to be accessed only by owners or chefs, respectively. It's designed to be uncluttered and intuitive, gracefully disallowing actions by reverting data back to its original state when an unintended action is taken.

Users will be greeted with an upper panel where they can add a topping or recipe, depending on the endpoint. Below that, the toppings/recipes populate and form small cards that allow for editing and deleting with individual buttons. Since each topping/recipe is on a separate panel, it's clear to the user what each button will do and to which topping/recipe it applies.

Each resource is on a separate panel because they each serve different purposes. Separating them allows users to easily see each resource and know what actions they can take with each.

Both endpoints work identically, except that the recipes needed a set of toppings to be added to each recipe name. To ensure users wouldn't be confused by the input, the panels populate with checkboxes corresponding only to available toppings. When a recipe has a topping that is no longer available, it will simply show a red icon beside it so that it can be resolved or edited. Upon editing, the unavailable toppings are removed automatically, ensuring the user is able to take appropriate action to rectify the issue.

The application only allows the user to perform actions within the set restrictions and doesn't leave much room for error, ensuring a user-friendly experience.