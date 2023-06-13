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
  const [displayData, setDisplayData] = React.useState([]);

  const handleTimeGroupChange = (
    event,
    newValue
  ) => {
    if (newValue !== null) {
      setTimeGroup(newValue);
      console.log(newValue);
      if (newValue === "day")
        setDisplayData(
          Data.getDayData() //new Date("2022-11-01"), new Date("2022-12-01"))
        );
      else if (newValue === "week") setDisplayData(Data.getWeekData());
      else if (newValue === "month") setDisplayData(Data.getMonthData());
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
    console.log(value);
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
