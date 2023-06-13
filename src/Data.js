//  {
//     total: number;
//     date: Date;
//     displayDate: string;
//   }
  
  // Cache in memory the data loaded from backend
  var backendData;
  
  export async function loadData() {
    console.log("Start backend fetch");
    var data = [];
    try {
      const response = await fetch(
        "https://dev-backend.rydecarpool.com/coding-challenge/signups?target=dev"
      );
      data = await response.json();
    } catch (error) {
      console.log("Failed to read backend - use hardcoded data sample");
      data = [
        { count: 6, date: "2022-10-01T00:00:00.000Z" },
        { count: 10, date: "2022-10-02T00:00:00.000Z" },
        { count: 23, date: "2022-10-03T00:00:00.000Z" },
        { count: 16, date: "2022-10-04T00:00:00.000Z" },
        { count: 15, date: "2022-10-05T00:00:00.000Z" },
        { count: 10, date: "2022-10-06T00:00:00.000Z" },
        { count: 7, date: "2022-10-07T00:00:00.000Z" }
      ];
    }
  
    // Original data using the Date type
    backendData = Array.from(data).map((row) => {
      return {
        total: +row["count"],
        date: new Date(row["date"]),
        displayDate: row.date
      };
    });
  }
  
  export function getDayData(startDate, endDate) {
    return Array.from(backendData)
      .filter(
        (record) =>
          (!startDate || startDate <= record.date) &&
          (!endDate || endDate >= record.date)
      )
      .map((row) => {
        return {
          total: row.total,
          date: row.date,
          displayDate: row.date.toLocaleDateString()
        };
      });
  }
  
  // Helper method to get the week  og the year
  // Found on internet
  function getWeek(inputDate) {
    var date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }
  
  export function getWeekData(startDate, endDate) {
    // Week data
    const weekGroups = backendData
    .filter(
        (record) =>
          (!startDate || startDate <= record.date) &&
          (!endDate || endDate >= record.date)
      )
    .reduce((groups, record) => {
      const monthYear = `${getWeek(record.date)}/${record.date.getFullYear()}`;
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(record);
      return groups;
    }, {});
    return Object.keys(weekGroups).map((monthYear) => {
      return {
        date: weekGroups[0]?.date,
        displayDate: monthYear,
        total: weekGroups[monthYear].reduce((a, b) => a + b.total, 0)
      };
    });
  }
  
  export function getMonthData(startDate, endDate) {
    // Month data
    const groups = backendData
    .filter(
        (record) =>
          (!startDate || startDate <= record.date) &&
          (!endDate || endDate >= record.date)
      )
    .reduce((groups, record) => {
      const monthYear = `${
        record.date.getMonth() + 1
      }/${record.date.getFullYear()}`;
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(record);
      return groups;
    }, {});
    return Object.keys(groups).map((monthYear) => {
      return {
        date: groups[0]?.date,
        displayDate: monthYear,
        total: groups[monthYear].reduce((a, b) => a + b.total, 0)
      };
    });
  }
  