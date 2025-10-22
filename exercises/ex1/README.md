# Exercise 1 - A Quick Look at the Base Application and Running the Application

As the basis for our exercise, we use the Incident Management application. Let's have a quick look at it!

## Prerequisites

Make sure you have the following installed:
- Node.js (version 20 or higher)
- npm
- SAP Cloud Application Programming Model CLI: `npm install -g @sap/cds-dk`

## 1.1 Have a quick look at the base app


#### The domain model
Open `base-app/db/schema.cds`. Here we find the domain model of the application.

The `Incidents` entity represents incidents created by customers, with fields for customer, title, urgency, status, and a composition of many conversations. Each conversation has an ID, timestamp, author, and message.

`Customers` can create support incidents. This entity contains fields for ID, first name, last name, e-mail, phone, credit card number, and a composition of many `Addresses`. The name field is calculated from the firstName and lastName fields. Elements can be specified with a calculation expression, in which you can refer to other elements of the same entity.

The Status and Urgency entities represent the status and urgency of incidents. Both are of type CodeList making it easy to use them as value helps.

The aspects `cuid` and `managed` from `@sap/cds/common` are used, which provided commonly needed fields with some underlying functionality. The `cuid` feature provides a unique identifier for an entity, while managed adds common administrative fields such as `createdAt` and `createdBy`.

#### Services
Open `base-app/srv/processor-service.cds`. Here we find one of the services of our application.

We define, what parts of the domain model should be exposed to the outside world, by default via OData. It's a great place to expose a service model, that actually fits our use case, with only the fields and entities needed for the specific use case. And to define who can create, update or delete the service entities.
Here, our incident processors only have direct access to the `Incidents`, but they can also reach e.g. `Customers`, as there is an association and the `@autoexpose` feature is activated.

There is another service in `base-app/srv/admin-service.cds`. Admins are allowed to create, update or delete the customers entity. A role `admin` is required to access this service.

#### Applications
The very simple domain and service model is enough to provide a full running CAP application including the database and the server. On top of this, we have defined a `Fiori Elements UI`. This can be found in `base-app/app/incidents`. In `base-app/app/incidents/annotations.cds` you will find the annotations needed to define the application.


#### Predefined extension fields
The predefined extension fields are provided through a plugin, which you can find in `./predefined-ext-fields-plugin`. The implementation is in the `cds-plugin.js` file.
It looks for `entities` in the CAP data model, which have an annotation `@extensible` and adds a set of predefined fields to them.
As we annotated the entity `Incidents` in `base-app/db/schema.cds` with `@extensible`:
```cds
entity Incidents @(extensible) : cuid, managed {
  customer       : Association to Customers;
  title          : String @title: 'Title';
...
}
```
and added the plugin as a dependency in our `package.json`:
```json
 "dependencies": {
    ...
    "predefined-ext-fields-plugin": "file:./predefined-ext-fields-plugin"
  },
```
the fields are included.

## 1.2 Running the Application

Now let's run the application and explore its functionality:

1. **Start the application**: Open a terminal in the project root directory and execute:
   ```shell
   cds watch base-app
   ```
   This will start your application locally and automatically open your browser to `http://localhost:4004`.

2. **Explore the Incidents application**:
   - In the **Web Applications** section, click on `/incidents/webapp`
   - You should see a list of incidents in a table format
   - Click on one of the incidents to view its details
   - Click **Edit** to modify the incident, make a change, and **Save** it

3. **View the extension fields**:
   - Navigate back to the Welcome page at `http://localhost:4004`
   - In the **Service Endpoints** section, under `/odata/v4/admin`, click on **Customers**
   - You'll see the predefined extension fields (`predef_field_1`, `predef_field_2`, `predef_field_3`) listed for each customer

With just a simple data model and service definition, we have a fully functional CAP application!

## Summary

You've now added fields, by making them available in advance as a predefined extension field. Adding a field this way has the advantage of being able to update content without a redeployment to the database or even a restart of the CAP application, as the underlying data structure and CAP domain and service model do not change.

Continue to - [Flexibility Personalization and Key User Functionality](../ex2/README.md)
