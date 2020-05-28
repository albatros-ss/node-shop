import { Request } from "express-serve-static-core";

export interface Req extends Request {
  user: any;
  session: any;
  csrfToken: any;
  file: any;
}
