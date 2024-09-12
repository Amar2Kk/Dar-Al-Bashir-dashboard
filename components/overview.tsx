"use client";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";

interface overviewProps {
    data: any;
}

const Overview: React.FC<overviewProps> = ({ data }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsDarkMode(document.body.classList.contains("dark"));
    }, []);

    const axisStrokeColor = isDarkMode ? "#ccc" : "#888888";
    const tooltipBackgroundColor = isDarkMode ? "#333" : "#f5f5f5";
    const tooltipTextColor = isDarkMode ? "#fff" : "#666";
    const barFillColor = "url(#colorTotal)";
    const gridStrokeColor = isDarkMode ? "#555" : "#ddd";

    return (
        <ResponsiveContainer width="100%" height={550}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                <XAxis
                    dataKey="name"
                    stroke={axisStrokeColor}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(tick) => tick.toUpperCase()}
                />
                <YAxis
                    stroke={axisStrokeColor}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `EGP${value}`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: tooltipBackgroundColor,
                        border: "none",
                        color: tooltipTextColor,
                    }}
                    labelStyle={{ color: tooltipTextColor }}
                    formatter={(value) => `EGP ${value}`}
                />
                <Legend />
                <Bar
                    dataKey="Total"
                    fill={barFillColor}
                    radius={[4, 4, 0, 0]}
                    animationDuration={500}
                />
                <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="25%"
                            stopColor={isDarkMode ? "#07f49e" : "#07f49e"}
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor={isDarkMode ? "#07f49e" : "#07f49e"}
                            stopOpacity={0.2}
                        />
                    </linearGradient>
                </defs>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Overview;
