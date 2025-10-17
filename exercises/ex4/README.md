# Exercise 4 - Creating the Extension

In this exercise, you will create an extension project that extends the base incidents application.

## Prerequisites

- Completion of [Exercise 3](../ex3/README.md)
- Base application running on `http://localhost:4004`

## Learning Objectives

After completing this exercise, you will be able to:
- Create a CAP extension project
- Configure the extension to extend a base application
- Pull the base model from the host application
- Push extensions to the base application

## Steps

### Step 1: Create the Extension Project

Create a new folder `myExtension` in the location of your choice.

> **Note**: An **Extension Project** is a normal CAP project and can be run locally just like any other CAP application. The only difference is that such projects do not have their own data model, but pull a `base model` from the host application in order to extend it.

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
       "@sap/cds-oyster": "^0.1.0",
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
         "code-extensibility": {
           "runtime": "debug",
           "maxTime": 1000,
           "maxMemory": 4
         },
         "auth": {
           "[development]": {
             "users": {
               "alice": {
                 "tenant": "t1",
                 "roles": [
                   "support",
                   "admin",
                   "cds.ExtensionDeveloper",
                   "cds.Subscriber"
                 ]
               },
               "bob": {
                 "roles": [
                   "support"
                 ]
               }
             }
           }
         }
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

### Step 2: Pull the Base Model

1. Pull the base model from the running application:
   ```bash
   cds pull --from http://localhost:4004 -u alice:
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

This moves the base model from `.base` to a folder in `node_modules` according to the name given in the `extends` clause of `package.json`.

### Step 3: Create the Extension

1. In the `db` folder of the extension project, create a file `extension.cds` with the following content:
   ```cds
   using { sap.capire.incidents as my } from '@capire/incidents';

   extend my.Customers with {
     status: String(8) @title: 'Customer Status' default 'Silver';
   };
   ```

### Step 4: Test the Extension

1. Push this extension to the base application:
   ```bash
   cds push --to localhost:4004 -u alice:
   ```

2. Test it by exploring the AdminService endpoints at `http://localhost:4004`.

### Step 5: Add Testing Convenience

To make testing simpler, you can use `cds add http` to create useful testing requests:

```bash
cds add http
```

This creates files in the `test/http` folder. If you're using VS Code, the `REST Client` extension allows you to run the requests directly from the editor.

> **Tip**: For testing changes on the data model, the AdminService tests are more convenient since there's no draft support enabled there.

## Summary

You have successfully created an extension project that:
- Extends the base incidents application
- Adds a new `status` field to the `Customers` entity
- Can be pushed to and pulled from the base application
- Includes testing capabilities for development

Continue to - [Exercise 5 - Extending the Model](../ex5/README.md)