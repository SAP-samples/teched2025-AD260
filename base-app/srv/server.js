// The things in here are for demo purposes only.
// They are not required in real projects.

const cds = require('@sap/cds')
if (cds.env.profiles.includes('development')) {

  // Add support role to mock users
  const { alice, bob } = cds.requires.auth.users
  alice.roles = ['admin','support']
  bob.roles = ['support']
}
