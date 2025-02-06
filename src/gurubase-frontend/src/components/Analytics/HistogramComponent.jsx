"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistogramComponent({
  data = [],
  interval,
  isLoading = false,
  onBarClick
}) {
  const [tooltip, setTooltip] = useState(null);

  const isHourly = interval === "today" || interval === "yesterday";

  const formatXAxisTick = (value) => {
    if (!value) return "";

    // Check if the data point has date ranges or single point
    const hasDateRanges = data.some((item) => "date_start" in item);

    // For date ranges, value will be date_start
    const date = new Date(value);

    if (isHourly) {
      return date.toLocaleTimeString([], { hour: "2-digit", hour12: true });
    }

    // Format as "DD MMM"
    return date.toLocaleString([], {
      day: "numeric",
      month: "short"
    });
  };

  // Keep the original tooltip date formatting
  const formatTooltipDate = (dataPoint) => {
    if (!dataPoint) return "";

    if ("date_point" in dataPoint) {
      const date = new Date(dataPoint.date_point);
      return date.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: isHourly ? "2-digit" : undefined,
        minute: isHourly ? "2-digit" : undefined,
        hour12: true
      });
    } else {
      const startDate = new Date(dataPoint.date_start);
      const endDate = new Date(dataPoint.date_end);
      return `${startDate.toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric"
      })} - ${endDate.toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}`;
    }
  };

  const calculateTickInterval = () => {
    if (isHourly) return 3;
    return Math.max(1, Math.floor(data.length / 6));
  };

  const calculateEndTime = (clickedData, interval) => {
    console.log("Will calculate end time. Clicked data:", clickedData);
    if (clickedData.date_point) {
      let secondsToAdd = 0;
      switch (interval) {
        case "today":
          secondsToAdd = 3600;
          break;
        case "yesterday":
          secondsToAdd = -3600;
          break;
        case "7d":
          secondsToAdd = 3600 * 24;
          break;
        case "30d":
          secondsToAdd = 3600 * 24;
          break;
        default:
          secondsToAdd = 0;
      }
      return new Date(
        new Date(clickedData.date_point).getTime() + secondsToAdd * 1000
      ).toISOString();
    } else if (clickedData.date_end) {
      // For range data use the end date
      return clickedData.date_end;
    }
  };

  const chartConfig = {
    questions: {
      label: "Question",
      color: "#CCE2FF"
    }
  };

  return (
    <div
      className="rounded-xl border border-[#E2E2E2]"
      onClick={(e) => e.stopPropagation()}>
      <div className="w-full relative">
        {isLoading ? (
          <div className="aspect-[3/1] p-8">
            <div className="h-full w-full flex flex-col justify-between">
              <Skeleton className="w-full h-[80%]" />
              <div className="flex justify-between w-full">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="w-12 h-4" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <style jsx global>{`
              .recharts-bar-rectangle {
              }
            `}</style>
            {tooltip && (
              <div
                className="absolute bg-white shadow-lg rounded-lg p-4 border z-50 pointer-events-none min-w-[140px]"
                style={{
                  left: tooltip.x,
                  top: Math.max(40, tooltip.y),
                  transform: "translate(-50%, -100%)",
                  marginTop: "-10px"
                }}>
                <div className="text-sm text-[#6D6D6D]">
                  {formatTooltipDate(tooltip.data)}
                </div>
                <Separator className="my-2" />
                <div className="flex items-end justify-between">
                  <span className="text-sm text-muted-foreground">Count:</span>
                  <span className="text-sm font-medium">{tooltip.value}</span>
                </div>
              </div>
            )}
            <ChartContainer config={chartConfig} className="aspect-[3/1]">
              <BarChart
                data={data.map((item) => ({
                  ...item,
                  date: item.date_point || item.date_start
                }))}
                margin={{
                  top: 30,
                  right: 10,
                  left: -10,
                  bottom: 5
                }}>
                <CartesianGrid
                  horizontal={true}
                  vertical={false}
                  stroke="#E2E2E2"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#000000" }}
                  interval={calculateTickInterval()}
                  tickFormatter={formatXAxisTick}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#000000" }}
                  tickCount={6}
                />
                <Bar
                  dataKey="value"
                  fill="#CCE2FF"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  cursor="pointer"
                  style={{
                    transition: "fill 0.2s ease"
                  }}
                  onClick={(data) => {
                    onBarClick &&
                      onBarClick({
                        startTime: data.date_point || data.date_start,
                        endTime: calculateEndTime(data, interval)
                      });
                  }}
                  onMouseOver={(data, index, event) => {
                    const rect = event.target.getBoundingClientRect();
                    const chartRect = event.target
                      .closest("svg")
                      .getBoundingClientRect();

                    const x = rect.left + rect.width / 2 - chartRect.left;
                    const y = rect.top - chartRect.top;

                    event.target.style.fill = "#2563EB";
                    setTooltip({
                      x,
                      y,
                      data,
                      value: data.value
                    });
                  }}
                  onMouseLeave={(data, index, event) => {
                    event.target.style.fill = "#CCE2FF";
                    setTooltip(null);
                  }}
                />
              </BarChart>
            </ChartContainer>
          </>
        )}
      </div>
    </div>
  );
}
