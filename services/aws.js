process.env.AWS_PROFILE = "personal-account";
const AWS = require("aws-sdk"),
  region = "us-west-1";

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
  region: region
});

module.exports = client;

// Will probly end up using other AWS Services
// but for now this is just a big empty file
