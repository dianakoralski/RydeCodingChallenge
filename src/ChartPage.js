import * as React from "react";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import * as Data from "./Data";
import { DateRangePicker } from "rsuite";


export function ChartPage() {
  const [timeGroup, setTimeGroup] = React.useState("day");
  const [dateRange, setDateRange] = React.useState(null);
  const [displayData, setDisplayData] = React.useState([]);

  const handleTimeGroupChange = (
    event,
    newValue
  ) => {
    if (newValue !== null) {
      setTimeGroup(newValue);

      var startDate = dateRange == null ? undefined : dateRange[0];
      var endDate = dateRange == null ? undefined : dateRange[1];
      if (newValue === "day")
        setDisplayData(
          Data.getDayData(startDate, endDate)
        );
      else if (newValue === "week") setDisplayData(Data.getWeekData(startDate, endDate));
      else if (newValue === "month") setDisplayData(Data.getMonthData(startDate, endDate));
    }
  };

  React.useEffect(() => {
    // Runs once to load the data
    Data.loadData().then(() => setDisplayData(Data.getDayData()));
  }, []);

  const predefinedBottomRanges = [
    {
      label: "Today",
      value: [new Date(), new Date()]
    },
    {
      label: "Thanksgiving",
      value: [new Date("2022-11-24"), new Date("2022-11-27")]
    },
    {
      label: "Christmas",
      value: [new Date("2022-12-25"), new Date("2022-12-26")]
    }
  ];

  function handleDateRangePickerChange(value) {
    setDateRange(value);
    var newData;
    if (timeGroup == "day")
        newData = value == null ? Data.getDayData():
        Data.getDayData(value[0], value[1]);
    else if (timeGroup == "week")
        newData = value == null ? Data.getWeekData():
        Data.getWeekData(value[0], value[1]);
    else if (timeGroup == "month") 
        newData = value == null ? Data.getMonthData():
        Data.getMonthData(value[0], value[1]);
    setDisplayData(newData);
  }

  return (
    <Stack direction="column">
      <Stack direction="row">
        <ToggleButtonGroup
          value={timeGroup}
          exclusive={true}
          onChange={handleTimeGroupChange}
        >
          <ToggleButton value="day">DAY</ToggleButton>
          <ToggleButton value="week">WEEK</ToggleButton>
          <ToggleButton value="month">MONTH</ToggleButton>
        </ToggleButtonGroup>

        <DateRangePicker
          value={dateRange}
          ranges={predefinedBottomRanges}
          placeholder="Select Date Range"
          onChange={handleDateRangePickerChange}
        />
      </Stack>

      <LineChart
        width={600}
        height={300}
        data={displayData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="displayDate" />
        <YAxis />
        <Tooltip />
        <Legend formatter={()=>(`total per ${timeGroup}`)} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#40A0FF"
          dot={false}
          activeDot={{ r: 3 }}
        />
      </LineChart>
    </Stack>
  );
}
