# Exercise 1 - Exercise 1 Description

In this exercise, we will use key user extensibility in order to add an already existing field to the Fiori Elements UI.

## Exercise 1.1 Key User Enablement


## Exercise 1.2 Run the application

### Have a quick look at the base app

As the basis for our exercise, we use the Incident Management application. Let's have a quick look at it!

#### The domain model
Open `base-app/db/schema.cds`. Here we find the domain model of the application.

The `Incidents` entity represents incidents created by customers, with fields for customer, title, urgency, status, and a composition of many conversations. Each conversation has an ID, timestamp, author, and message.

`Customers` can create support incidents. It includes fields for ID, first name, last name, e-mail, phone, credit card number, and a composition of many `Addresses`. The name field is calculated from the firstName and lastName fields. Elements can be specified with a calculation expression, in which you can refer to other elements of the same entity.

The Status and Urgency entities represent the status and urgency of incidents. Both are of type CodeList making it easy to use them as value helps.

The aspects `cuid` and `managed` from `@sap/cds/common` are used, which provided commonly needed fields with some underlying functionality. The `cuid` feature provides a unique identifier for an entity, while managed adds common administrative fields such as `createdAt` and `createdBy`.


#### Services
Open `base-app/srv/processor-service.cds`. Here we find one of the services of our application.

We define, what parts of the domain model should be exposed to the outside world, by default via OData. It's a great place to expose a service model, that actually fits our use case, with only the fields and entities needed for the specific use case. And to define who can create, update or delete the service entities.
Here, our incident processors only have direct access to the `Incidents`, but they can also reach e.g. `Customers`, as there is an association and the `@autoexpose` feature is activated.

There is another service in `base-app/srv/admin-service.cds`. Admins are allowed to create, update or delete the customers entity. A role `admin` is required to access this service.

#### Applications
The very simple domain and service model is enough to provide a full running CAP application including the database and the server. On top of this, we have defined a `Fiori Elements UI`. This can be found in `base-app/app/incidents`. In `base-app/app/incidents/annotations.cds` you will find the annotations needed to define the application.

So let's go ahead and try the application:


In a terminal window, execute the cds watch command. This will start your application locally.

```shell
cds watch base-app
```

## Exercise 1.3 Enter the Adapt UI mode


## Exercise 1.4 Add & rename the field

## Exercise 1.4 Test the application


## Summary

You've now added a field, which was made available in advance as a predefined extension field. Adding a field this way has the advantage of being able to update content without a redeployment to the database or even a restart of the CAP application, as the underlying data structure and CAP domain and service model do not change

Continue to - [Exercise 2 - Exercise 2 Description](../ex2/README.md)

