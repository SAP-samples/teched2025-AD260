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

1. Navigate to the base-app directory:
   ```bash
   cd base-app
   ```

2. Add MTX support:
   ```bash
   cds add mtx
   ```
### Step 2: Start the server using multi-tenancy

You can test the setup using three distinct terminal windows. In VS Code we suggest using the split window feature to have all terminals visible simultaneously
- **Terminal 1**  
  Run 
  ```sh
  cds watch base-app --profile with-mtx
  ``` 
  on project root level. It should report running on port **4004**.

- **Terminal 2**  
  Is needed to install sidecar dependencies and run the MTX sidecar using 
  ```sh
  cd base-app/mtx/sidecar
  npm install
  cds watch
  ```
  This should report for port **4005**. Please keep these two terminals running while testing the setup.
- In **Terminal 3**  
  You can subscribe a new tenant t1 for alice using 
  ```sh
  cds subscribe t1 --to http://localhost:4005 -u yves:
  ```
  and test it by using the link in `Terminal 1` or go directly to http://localhost:4004/incidents/webapp/index.html


### Step 3: Create the Extension Project

Create a new folder `myExtension` in the location of your choice.
> [!NOTE]
> An **Extension Project** is a normal CAP project and can be run locally just like any other CAP application. The only difference is that such projects do not have their own data model, but pull a `base model` from the host application in order to extend it.

1. Using a terminal, navigate to your new folder and run:
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
   cds pull --from http://localhost:4004 -u alice:
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
   cds push --to localhost:4004 -u alice:
   ```

2. Test it by exploring the AdminService endpoints at `http://localhost:4004`.

### Step 7: Add Testing Convenience

To make testing simpler, you can use `cds add http` to create useful testing requests:

```bash
cds add http
```

This creates files in the `test/http` folder. If you're using VS Code, the `REST Client` extension allows you to run the requests directly from the editor.

> [!TIP]
> For testing changes on the data model, the AdminService tests are more convenient since there's no draft support enabled there.

## Summary

You have successfully created an extension project that:
- Extends the base incidents application
- Adds a new `status` field to the `Customers` entity
- Can be pushed to and pulled from the base application
- Includes testing capabilities for development

Continue to - [Exercise 5 - Extending the Model](../ex5/README.md)
