import * as React from 'react';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import * as Data from './Data';
import { DateRangePicker } from 'rsuite';

export function ChartPage() {
  // Store state for the day/week/month selection used by ToggleButtonGroup
  const [timeGroup, setTimeGroup] = React.useState('day');

  // Store the data range selection used by DateRangePicker
  const [dateRange, setDateRange] = React.useState(null);

  // Represent filtered backend data used by LineChart
  const [displayData, setDisplayData] = React.useState([]);

  // This method is called once when component is loaded to fetch the backend data
  React.useEffect(() => {
    Data.loadData().then(() => setDisplayData(Data.getDayData()));
  }, []);

  // Updates the line chart:
  // where filter is 'day', 'week', or 'month'
  // optionally filter by start and end date
  function updateDisplayData(filter, startDate, endDate) {
    if (filter === 'day') setDisplayData(Data.getDayData(startDate, endDate));
    else if (filter === 'week')
      setDisplayData(Data.getWeekData(startDate, endDate));
    else if (filter === 'month')
      setDisplayData(Data.getMonthData(startDate, endDate));
  }

  // Called when day/week/month selection changes
  const handleTimeGroupChange = (event, newValue) => {
    if (newValue !== null) {
      setTimeGroup(newValue);

      var startDate = dateRange == null ? undefined : dateRange[0];
      var endDate = dateRange == null ? undefined : dateRange[1];

      // Fetch the data aggregated by day, week or month
      updateDisplayData(newValue, startDate, endDate);
    }
  };

  // For DateRangePicker we can define custom ranges
  // TODO: Need to define useful ranges - these are examples only
  const predefinedBottomRanges = [
    {
      label: 'Today',
      value: [new Date(), new Date()],
    },
    {
      label: 'Thanksgiving',
      value: [new Date('2022-11-24'), new Date('2022-11-27')],
    },
    {
      label: 'Christmas',
      value: [new Date('2022-12-25'), new Date('2022-12-26')],
    },
  ];

  // Called when DateRangePicker selection changes
  function handleDateRangePickerChange(value) {
    setDateRange(value);
    var startDate;
    var endDate;
    // value is null when no date range is selected
    if (value != null) {
      startDate = value[0];
      endDate = value[1];
    }
    updateDisplayData(timeGroup, startDate, endDate);
  }

  return (
    <Grid container spacing={2} justify="flex-end">
      <Grid item xs={4}>
        <b style={{ marginLeft: 20, whiteSpace: 'nowrap', lineHeight: '4' }}>
          New Users
        </b>
      </Grid>

      <Grid item xs={4}>
        <DateRangePicker
          style={{ marginTop: 10 }}
          value={dateRange}
          ranges={predefinedBottomRanges}
          placeholder="Date Range"
          onChange={handleDateRangePickerChange}
        />
      </Grid>

      <Grid item xs={4}>
        <ToggleButtonGroup
          style={{ height: 20, margin: 15 }}
          value={timeGroup}
          exclusive={true}
          onChange={handleTimeGroupChange}
        >
          <ToggleButton value="day">DAY</ToggleButton>
          <ToggleButton value="week">WEEK</ToggleButton>
          <ToggleButton value="month">MONTH</ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid item xs={12}>
        <ResponsiveContainer width="100%" minHeight={300}>
          <LineChart
            data={displayData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayDate" />
            <YAxis />
            <Tooltip />
            <Legend formatter={() => `total per ${timeGroup}`} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#40A0FF"
              dot={false}
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
}
