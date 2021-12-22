import { APIGatewayProxyHandler } from "aws-lambda";
import dayjs from "dayjs";
import { v4 as uuidV4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface ICreateToDo {
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  
  const { id: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateToDo;

  const id = uuidV4();

  await document.put({
    TableName: "todos",
    Item: {
      id,
      user_id,
      title,
      done: false,
      deadline: dayjs(deadline).format("DD/MM/YYYY"),
      created_at: dayjs().format("DD/MM/YYYY")
    }
  }).promise();
  
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "To do created!",
      todo_id: `${id}`
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}