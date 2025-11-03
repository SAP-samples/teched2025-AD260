# Exercise 4 - Creating the Extension

Now, we are changing the perspective. In the previous exercises, you have activated key user extensibility. In the current and following exercises, we turn our single-tenant application into a multi-tenant application.
A customer can then create an extension for their tenant, which does not affect other customers (tenants).

## Prerequisites

- Completion of [Exercise 3](../ex3/README.md)
- Base application running on `http://localhost:4004`

## Learning Objectives

After completing this exercise, you will be able to:
- Enabling multi-tenancy in a CAP application
- Create a CAP extension project
- Configure the extension to extend a base application
- Pull the base model from the host application
- Push extensions to the base application

## Steps

### Step 1: Enable MTX Support in Base Application

First, we need to enable multitenancy (MTX) support in the base application to allow extensions.

1. Stop the currently running server with `CTRL` + `C`

2. Navigate to the base-app directory:
   ```bash
   cd base-app
   ```

3. Add MTX support:
   ```bash
   cds add mtx
   ```

4. Add a dependency to @sap/cds-oyster (the code extensibility we will used in exercise 6):
   ```bash
   npm add @sap/cds-oyster
   ```

5. In `base-app/package.json` add the following under `cds` > `requires`:
   ```json
   "requires": {
      "code-extensibility": true,
      ...
      }
   ```
6. In `base-app/mtx/sidecar/package.json` add the following under `dependencies`:

  ```json 
  ... ,
  "@sap/cds-oyster": "^0.2.1",
  "predefined-ext-fields-plugin": "file:./../../predefined-ext-fields-plugin"
  ```

  as well as under `cds` > `requires`     
   ```json
   ...,
   "requires": {
      "code-extensibility": true
      }
   ```
### Step 2: Start the server using multi-tenancy

You can test the setup using three distinct terminal windows. In VS Code we suggest using the split window feature to have all terminals visible simultaneously
- **Terminal 1**  
  Here, you should still be in the **base-app** folder. Run 
  ```sh
  npm install
  cds watch --with-mtx
  ``` 
  on project root level. It should report running on port **4004**.
  > [!NOTE]
  > Even when multi-tenancy (mtx) is active, we allow testing the application as single tenant app for simplicity in testing. So for testing in a multi-tenant mode, we add the `with-mtx` profile.

- **Terminal 2**  
  Split the terminal by clicking into the first terminal and pressing `CTRL` + `Shift` + `5`.
  Is needed to install sidecar dependencies and run the MTX sidecar using 
  ```sh
  cd mtx/sidecar
  cds watch --with-mtx
  ```
  This should report for port **4005**. Please keep these two terminals running while testing the setup.
- **Terminal 3**  
  Split the terminal by clicking into the **second** terminal and pressing `CTRL` + `Shift` + `5`.
  You can subscribe a new tenant t1 using 
  ```sh
  cds subscribe t1 --to http://localhost:4005 -u yves:
  ```
  and test it by using the link in `Terminal 1` or go directly to http://localhost:4004/incidents/webapp/index.html
  
  If you get a login screen, enter the user `alice` and leave the password field empty.


  Our application is now a **multitenant application**, where different **tenants (customers) have their own data**.
  Let's test it:
  
  Create a new incident in the application.

  Then, on the right terminal (Terminal 3) enter:
    ```sh
  cds subscribe t2 --to http://localhost:4005 -u yves:
  ```
  Open an incognito window in the browser (as in our regular browser we are already logged on as alice, who is assigned to tenant t1).
  Then, navigate to http://localhost:4004/incidents/webapp/index.html and log on as `erin`, again leaving the password field empty.
  Erin is assigned to t2 in our test user configuration. In t2 the newly created incident of t1 is not visible.

  Tenants can also be extended individually, which is what we will do in the next step.

### Step 3: Create the Extension Project

Create a new folder `myExtension` on the root level of the project (same level as base-app).
> [!NOTE]
> An **Extension Project** is a normal CAP project and can be run locally just like any other CAP application. The only difference is that such projects do not have their own data model, but pull a `base model` from the host application in order to extend it.

1. Using **terminal 3**, navigate to your new folder (if you are in base-app this means `cd ..` and `cd myExtension`) and run:
   ```bash
   cds init
   ```

2. Modify the `package.json` to reflect this:
   ```json
   {
     "name": "myExtension",
     "extends": "@capire/incidents",
     "version": "1.0.0",
     "dependencies": {
       "@sap/cds": "^9",
       "@sap/cds-oyster": "^0.2.0",
       "express": "^4"
     },
     "engines": {
       "node": ">=20"
     },
     "devDependencies": {
       "@cap-js/sqlite": "^2"
     },
     "cds": {
       "server" : {
        "port" : 4006
       },
       "requires": {
         "code-extensibility": true
         }
     },
     "scripts": {
       "start": "cds-serve"
     },
     "workspaces": [
       ".base"
     ]
   }
   ```

Note the important parts:
- A workspace pointing to `.base`
- The `extends` clause providing a resolvable name for the target application
- The CDS-OYSTER plugin as dependency
- Code-extensibility turned on for local testing and debugging

### Step 4: Pull the Base Model

1. Pull the base model from the running application:
   ```bash
   cds pull --from http://localhost:4005 -u bob:
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

This moves the base model from `.base` to a folder in `node_modules` according to the name given in the `extends` clause of `package.json`.

### Step 5: Create the Extension

1. In the `db` folder of the extension project, create a file `extension.cds` with the following content:
   ```cds
   using { sap.capire.incidents as my } from '@capire/incidents';

   extend my.Customers with {
     status: String(8) @title: 'Customer Status' default 'Silver';
   };
   ```
> [!NOTE]
> Adding new fields to an entity will require a database deployment. The previously shown predefined extension fields already exist on the database and are repurposed later - without the need to redeploy.

### Step 6: Test the Extension

1. Push this extension to the base application:
   ```bash
   cds push --to localhost:4005 -u bob:
   ```

2. Test it by exploring the AdminService endpoints at `http://localhost:4004`.

### Step 7: Test the changes
In your browser (**not!** in the incognito window), request the customer data
http://localhost:4004/odata/v4/admin/Customers
and select the "pretty print" checkbox.

You should see `status : Silver` as an element on each customer.

This extension has been pushed to tenant1, if you run the same test in tenant2, you will not see this field.
The user `bob` is assigned as cds.ExtensionDeveloper in tenant1, so `cds push` pushed the extension there.

In the next exercieses we will also add this new field to the UI as well as create actions to promote customers and incidents.

## Summary

You have successfully created an extension project that:
- Extends the base incidents application
- Adds a new `status` field to the `Customers` entity
- Can be pushed to and pulled from the base application
- Includes testing capabilities for development

Continue to - [Exercise 5 - Extending the Model](../ex5/README.md)
