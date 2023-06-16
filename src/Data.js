// Data.js file contains helper functions for loading data from backend and processing it

// This variable caches in memory the data loaded from backend server
var backendData;

// Should be called once to load the data and cache it in memory
export async function loadData() {
  var data = [];
  // Handle the backend failures in case server is down
  try {
    const response = await fetch(
      'https://dev-backend.rydecarpool.com/coding-challenge/signups?target=dev'
    );
    data = await response.json();
  } catch (error) {
    console.log(
      'Failed to read backend - use hardcoded data sample as a fallback'
    );
    data = [
      { count: 6, date: '2022-10-01T00:00:00.000Z' },
      { count: 10, date: '2022-10-02T00:00:00.000Z' },
      { count: 23, date: '2022-10-03T00:00:00.000Z' },
      { count: 16, date: '2022-10-04T00:00:00.000Z' },
      { count: 15, date: '2022-10-05T00:00:00.000Z' },
      { count: 10, date: '2022-10-06T00:00:00.000Z' },
      { count: 7, date: '2022-10-07T00:00:00.000Z' },
    ];
  }

  // Convert the original data using the Date type - we will need it for filtering
  backendData = Array.from(data).map((record) => {
    return {
      total: +record['count'],
      date: new Date(record['date']),
    };
  });
}

// Get data in display format aggregated by day
// Optionally we filter the data by startDate and endDate if specified in parameters
// By default we return the whole data range
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
        displayDate: row.date.toLocaleDateString(),
      };
    });
}

// Helper method to get the week of the year
// We need this for data aggregation by week
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

// Get data in display format aggregated by week
// Optionally we filter the data by startDate and endDate if specified in parameters
// By default we return the whole data range
export function getWeekData(startDate, endDate) {
  // Week data
  const weekGroups = backendData
    .filter(
      (record) =>
        (!startDate || startDate <= record.date) &&
        (!endDate || endDate >= record.date)
    )
    .reduce((groups, record) => {
      const weekYear = `${getWeek(record.date)}/${record.date.getFullYear()}`;
      if (!groups[weekYear]) {
        groups[weekYear] = [];
      }
      groups[weekYear].push(record);
      return groups;
    }, {});
  // Ex. weekGroups = {'1/2023': [{total:3,Date:'1/1/23'},{}...{}], ...}
  return Object.keys(weekGroups).map((weekYear) => {
    return {
      displayDate: weekYear,
      total: weekGroups[weekYear].reduce(
        (total, record) => total + record.total,
        0
      ),
    };
  });
}

// Get data in display format aggregated by week
// Optionally we filter the data by startDate and endDate if specified in parameters
// By default we return the whole data range
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
      displayDate: monthYear,
      total: groups[monthYear].reduce((a, b) => a + b.total, 0),
    };
  });
}
