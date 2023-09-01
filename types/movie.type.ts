import { Moment } from "moment";

export default interface Movie {
  title: string;
  description: string | undefined;
  location: string | undefined;
  schedules: Moment[];
  url: string | undefined;
  image: string | undefined;
}
