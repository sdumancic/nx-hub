import {Request, Response} from 'express';
import { AppDataSource } from "./data-source";


export async function dbInfo(request: Request, response: Response) {
  const res = await AppDataSource.manager.query("select current_user,session_user, current_catalog, inet_server_port(), version()");
  response.status(200).send(`<pre>${JSON.stringify(res)}</pre>`)
}
