import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../themes.js";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getTaskPriorityCounts } from "../../services/tasksService.js";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await getTaskPriorityCounts();
    const { lowPriorityCount, mediumPriorityCount, highPriorityCount } =
      response.numberOfLowMediumAndHighPriorityTasks;

    // Format data for Nivo Bar Chart
    const formattedData = [
      { priority: "Low", LowPriority: lowPriorityCount },
      { priority: "Medium", MediumPriority: mediumPriorityCount },
      { priority: "High", HighPriority: highPriorityCount },
    ];
    setData(formattedData);
  };

  useEffect(() => {
    getData();
  }, []);

  const barColors = [
    colors.redAccent[600], // Color for Low
    colors.blueAccent[600], // Color for Medium
    colors.greenAccent[600], // Color for High
  ];

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["LowPriority", "MediumPriority", "HighPriority"]} // Adjusted to match the formatted data
      indexBy="priority" // The category for grouping (i.e., "Task Priorities")
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={barColors}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Priority Levels",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Number of Tasks",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      ariaLabel="Task Priority Bar Chart"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " tasks for " + e.indexValue
      }
    />
  );
};

export default BarChart;
