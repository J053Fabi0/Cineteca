import { Moment } from "moment";

export default interface Movie {
  title: string | undefined;
  description: string | undefined;
  location: string | undefined;
  schedules: Moment[];
  url: string | undefined;
  image: string | undefined;
}
