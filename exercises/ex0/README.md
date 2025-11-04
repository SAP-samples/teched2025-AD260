# Exercise 0 - Setup

In this exercise, you will clone the repository and set up your development environment.

## Prerequisites

Make sure you have the following installed:
- Git
- Visual Studio Code

## Steps

1. Open Visual Studio Code

2. Go to `View` > `Explorer`. In the explorer view, click on **Clone Git Repository**.

   Close the `CHAT` pane on the right side of VSCode

3. Enter the repository URL:
   ```
   https://github.com/SAP-samples/teched2025-AD260.git
   ```

4. Select a folder location to clone the repository

5. When prompted, click **Open** to open the cloned repository in VS Code

6. Open a terminal in VS Code (Terminal > New Terminal)

7. Install the latest `@sap/cds-dk` version

   ```bash
   npm i -g @sap/cds-dk --prefix "C:\software\CLI\CDS"
   ```

   > The --prefix option is only needed due to the setup of the TechEd machines. If you are running this tutorial on your own machine, omit it.

8. Navigate to the base-app directory and install dependencies:
   ```bash
   cd base-app
   npm install
   ```

## Summary

You have successfully cloned the repository, installed the dependencies, and opened it in VS Code. You're now ready to start working with the CAP application.

Continue to - [Exercise 1 - Explore and run the app](../ex1/README.md)
