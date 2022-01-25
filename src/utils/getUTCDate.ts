import moment from "moment";

function getUTCDate(): string {
  return moment.utc().format("YYYY-MM-DD HH:mm:ss");
}

export default getUTCDate;
