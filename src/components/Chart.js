import React, { useEffect, useRef } from "react";
import { createChart, AreaSeries } from "lightweight-charts";

const POSITIVE = {
  line: "#16a34a",
  top: "rgba(22, 163, 74, 0.28)",
  bottom: "rgba(22, 163, 74, 0.02)",
};

const NEGATIVE = {
  line: "#dc2626",
  top: "rgba(220, 38, 38, 0.28)",
  bottom: "rgba(220, 38, 38, 0.02)",
};

function getTrendColors(priceArray) {
  const isUp = priceArray[priceArray.length - 1] >= priceArray[0];
  return isUp ? POSITIVE : NEGATIVE;
}

export const LineGraph = ({ priceArray, width = 120, height = 40 }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || !priceArray?.length) return;

    const { line, top, bottom } = getTrendColors(priceArray);

    const chart = createChart(chartContainerRef.current, {
      width,
      height,

      layout: {
        background: {
          color: "transparent",
        },
        attributionLogo: false,
      },

      grid: {
        vertLines: {
          visible: false,
        },

        horzLines: {
          visible: false,
        },
      },

      leftPriceScale: {
        visible: false,
      },

      rightPriceScale: {
        visible: false,
      },

      timeScale: {
        visible: false,
      },

      handleScroll: false,
      handleScale: false,
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: line,
      topColor: top,
      bottomColor: bottom,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const totalPoints = priceArray.length;

    const formattedData = priceArray.map((price, index) => {
      const progress = totalPoints === 1 ? 0 : index / (totalPoints - 1);

      const timestamp =
        startDate.getTime() +
        progress * (endDate.getTime() - startDate.getTime());

      return {
        time: Math.floor(timestamp / 1000),
        value: price,
      };
    });

    areaSeries.setData(formattedData);

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [priceArray, width, height]);

  return (
    <div ref={chartContainerRef} style={{ width, height }} aria-hidden="true" />
  );
};

export const LineGraphForDetailPage = ({ priceArray, days }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || !priceArray?.length || !days) {
      return;
    }

    const container = chartContainerRef.current;
    const { line, top, bottom } = getTrendColors(priceArray);

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 320,

      layout: {
        background: {
          color: "transparent",
        },
        textColor: "#8a8f98",
        attributionLogo: false,
      },

      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },

      leftPriceScale: {
        visible: true,
        borderVisible: false,
      },

      rightPriceScale: {
        visible: false,
      },

      timeScale: {
        visible: true,
        borderVisible: false,

        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);

          if (days === 1) {
            return date.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }

          if (days === 7) {
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }

          if (days === 30) {
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }

          if (days === 365) {
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
          }

          return "";
        },

        fixLeftEdge: true,
        fixRightEdge: true,
      },

      handleScroll: false,
      handleScale: false,
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      priceScaleId: "left",
      lineColor: line,
      topColor: top,
      bottomColor: bottom,
      lineWidth: 2,
    });

    const now = Date.now();

    const periodMilliseconds = days * 24 * 60 * 60 * 1000;

    const totalPoints = priceArray.length;

    const formattedData = priceArray.map((price, index) => {
      const timestamp =
        now -
        periodMilliseconds +
        (index / (totalPoints - 1)) * periodMilliseconds;

      return {
        time: Math.floor(timestamp / 1000),
        value: price,
      };
    });

    areaSeries.setData(formattedData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [priceArray, days]);

  return <div ref={chartContainerRef} className="w-full" />;
};
