import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  
  const { id } = event.pathParameters;

  const response = await document
    .scan({
      TableName: "todos",
      FilterExpression: "user_id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    }).promise();

    const toDos = response.Items;

    if(!toDos[0]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "User id is invalid or no have tasks!",
        }),
      };
    }
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      toDos: toDos
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}