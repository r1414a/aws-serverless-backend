// export const handler = async (event) => {
//   console.log(event,event.methodArn)
//   // TODO implement

//   const eventInJSON = JSON.stringify(event);
//   const token = event.Authorization;

//   if(!token){
//     return {
//       statusCode: 401,
//       error: "You are not authorize to access this endpoint, how did you get this endpoint",
//     }
//   }

//   if(token !== "iamtoken"){
//     return generatePolicy("Deny");
//   }

//   return generatePolicy("Allow");
  
// };


// function generatePolicy(effect,resource){
//   return {
//     "policyDocument": {
//         "Version": "2012-10-17",
//         "Statement" : [
//           {
//             "Action": "execute-api:Invoke",
//             "Effect": effect,
//             // "Resource":"arn:aws:execute-api:ap-south-1:826754917477:sidwtphttc/dev/*"
//             "Resource":"arn:aws:execute-api:ap-south-1:826754917477:u21dsgtgv8/*/$connect"
//           }
//         ]
//       }
//   }
// }


   // A simple REQUEST authorizer example to demonstrate how to use request 
   // parameters to allow or deny a request. In this example, a request is  
   // authorized if the client-supplied HeaderAuth1 header and QueryString1 query parameter
   // in the request context match the specified values of
   // of 'headerValue1' and 'queryValue1' respectively.
            export const handler = function(event, context, callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));

   // Retrieve request parameters from the Lambda function input:
   var headers = event.headers;
   var queryStringParameters = event.queryStringParameters;
   var stageVariables = event.stageVariables;
   var requestContext = event.requestContext;
       
   // Parse the input for the parameter values
   var tmp = event.methodArn.split(':');
   var apiGatewayArnTmp = tmp[5].split('/');
   var awsAccountId = tmp[4];
   var region = tmp[3];
   var ApiId = apiGatewayArnTmp[0];
   var stage = apiGatewayArnTmp[1];
   var route = apiGatewayArnTmp[2];
       
   // Perform authorization to return the Allow policy for correct parameters and 
   // the 'Unauthorized' error, otherwise.
   var authResponse = {};
   var condition = {};
    condition.IpAddress = {};
    
   if (headers.HeaderAuth1 === "headerValue1"
       && queryStringParameters.QueryString1 === "queryValue1") {
        callback(null, generateAllow('me', event.methodArn));
    }  else {
        callback(null, generateDeny('me', event.methodArn)); 
    }
}
    
// Helper function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
   // Required output:
   var authResponse = {};
    authResponse.principalId = principalId;
   if (effect && resource) {
       var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
       policyDocument.Statement = [];
       var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
       statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
   // Optional output with custom properties of the String, Number or Boolean type.
   authResponse.context = {
       "stringKey": "stringval",
       "numberKey": 123,
       "booleanKey": true
    };
   return authResponse;
}
    
var generateAllow = function(principalId, resource) {
   return generatePolicy(principalId, 'Allow', resource);
}
    
var generateDeny = function(principalId, resource) {
   return generatePolicy(principalId, 'Deny', resource);
}