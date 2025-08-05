export const handler = async (event) => {
  console.log(event,event.methodArn)
  // TODO implement

  const eventInJSON = JSON.stringify(event);
  const token = event.authorizationToken;

  if(!token){
    return {
      statusCode: 401,
      error: "You are not authorize to access this endpoint, how did you get this endpoint",
    }
  }

  if(token !== "iamtoken"){
    return generatePolicy("Deny");
  }

  return generatePolicy("Allow");
  
};


function generatePolicy(effect,resource){
  return {
    "policyDocument": {
        "Version": "2012-10-17",
        "Statement" : [
          {
            "Action": "execute-api:Invoke",
            "Effect": effect,
            "Resource":"arn:aws:execute-api:ap-south-1:826754917477:sidwtphttc/dev/*"
          }
        ]
      }
  }
}