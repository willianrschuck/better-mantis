import moment from "moment";

const DateUtil = {
  format: (stringDate) => {
    let date = moment(stringDate, "YYYY-MM-DD HH:mm");
    if (date.isSame(new Date(), 'week')) {
      return date.fromNow();
    }
    return date.format("DD/MM/YYYY HH:mm");
  }
}

export { DateUtil };