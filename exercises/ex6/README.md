# Exercise 6 - Bound Actions

In this exercise, you will implement a bound action using CDS-Oyster event handlers.

## Prerequisites

- Completion of [Exercise 5](../ex5/README.md)
- Extension project with extended data model
- Base application running with your extensions

## Learning Objectives

After completing this exercise, you will be able to:
- Create bound action event handlers using CDS-Oyster
- Understand the CDS-Oyster event handler API and limitations
- Use `req.subject` for targeted entity updates
- Debug CDS-Oyster event handlers in VS Code
- Follow proper file naming conventions for event handlers

## Steps

### Step 1: Implementing the action

In an existing extension project, code extensions can be created within the `srv` folder following a strict naming convention, with the service name as top level folder and service entity name as second level folder. The filename must follow the format of `WHEN-dash-WHAT.js`.

In our case, we need to create an empty file with the name `on-promoteIncident.js` in the folder `srv/ProcessorService/Incidents`.

The entire content of the file will be this:

```javascript
module.exports = async function (req) {
    await UPDATE.entity(req.subject).with({ urgency_code: 'H' })
}
```

**What are we doing here?**

Just like in a normal CAP application, CDS-Oyster provides the typical API (with limitations) for standard CAP Events:

- subject: req.subject,
- data: req.data,
- target: req.target,
- results: req.results,
- errors: req.errors,
- messages: req.messages

In addition, a subset of the CDS QL is supported, as well as calling existing actions and emitting events.

This event handler is using `req.subject` (which represents a valid CQN snippet to identify a single entity instance) to update precisely one entry in the Incidents table. This is a nice convenience to avoid constructing where clauses using `req.data.Incidents_ID` and is less error prone.

Notice the general nature of CDS-Oyster event handlers:

- Each file needs to export a single **asynchronous** function
- Depending on the event, the function will be called with `req` or `req, res` (e.g. after read handlers)
- All code needs to be synchronous, `await` statements are forbidden
- Exceptions are the CDS QL callbacks, which **require** asynchronous calls

### Step 2: Adding another action

Let's create a second file with the name `on-promoteCustomer.js` in the folder `srv/ProcesorService/Incidents`.

It should look like this:
```js
module.exports = async function (req) {

    await this.update('CustomersProjection').with({ status: 'Gold' }).where({ ID: req.data.Customer_ID })

    await this.update('Incidents').with({ urgency_code: 'H' }).where({ 
        customer_ID: req.data.Customer_ID,
        and : { not: { status_code: 'C' } }
    })

}
```

### Step 3: Test the Action

Please use `cds watch` to test whether the action implementation works. By selecting one or more incidents, the `promote Incident` button should now change the urgency to `high`.

### Step 4: Deploy the Extension

Now it's time to deploy the composed extension, including the custom code handlers, to the main application.  
Before doing so, stop the locally running extension project to avoid **port conflicts**.

We will start the **Incidents** app locally in multi-tenancy mode.
For this, you'll need **three separate terminal windows**.  
In Visual Studio Code, we recommend using the **split terminal** feature to keep all windows visible simultaneously.

1. **Terminal 1**  
   Run `cds watch` at the root level of the project. It should report the service running on port `4004`.

2. **Terminal 2**  
   Run the MTX sidecar with:
   ```bash
   cds watch mtx/sidecar
   ```
   This should report running on port `4005`.  
   Keep Terminals 1 and 2 running during the entire testing process.

3. **Terminal 3**  
   Should be in the root of the extension project. Push the extension for tenant `t1` and user `alice` using the following command:
   ```bash
   cds push --to http://localhost:4005 -u alice
   ```

You can now test the deployment by opening the link from Terminal 1, or navigating directly to:  
[http://localhost:4004/incidents/webapp/index.html](http://localhost:4004/incidents/webapp/index.html)

At this point, you should see:
- The additional **Customer Status** field introduced by the extension
- The two **UI buttons** for the defined actions, just like in the preview mode of the extension project

You can now interact with the UI: create and update incidents, and verify that the logic behaves as expected.

### Step 5: Troubleshooting

If this does not work as expected, please check the following:

- CDS-Oyster is installed in node_modules
- Sandbox is enabled in `package.json`
- Extension project runs with the data model changes visible
- Folder names for event handlers are correct
- File name has no typo

## Summary

You have successfully implemented a bound action using CDS-Oyster event handlers. You learned:
- How to create event handlers with proper file naming conventions
- How to use the CDS-Oyster API for entity updates
- How to debug event handlers using VS Code
- The differences between CDS-Oyster and standard CAP event handlers

Continue to - [Exercise 7 - Summary](../ex7/README.md)
