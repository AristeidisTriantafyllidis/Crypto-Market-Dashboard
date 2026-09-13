import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainPage from "./pages/MainPage";
import ErrorBoundary from "./components/ErrorBoundary";
import DetailPage from "./pages/DetailPage";
import Watchlist from "./pages/Watchlist";
import SkeletonPlaceholder from "./components/skeletons/SkeletonMain";
import DetailSkeletonPlaceholder from "./components/skeletons/SkeletonDetail";
import App from "./App";
import * as api from "./services/api";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("./components/Chart", () => ({
  LineGraph: () => <div>Chart</div>,
}));
jest.mock("./components/Chart", () => ({
  LineGraph: () => <div>Chart</div>,
  LineGraphForDetailPage: () => <div>Detail Chart</div>,
}));

describe("fetchData", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns cryptocurrencies when API responds with 200", async () => {
    const mockData = [
      {
        id: "bitcoin",
        name: "Bitcoin",
      },
    ];

    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await api.fetchData();

    expect(result).toEqual(mockData);
  });

  test("throws an error when API responds with an error", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(api.fetchData()).rejects.toThrow("Response status: 500");
  });
});

describe("MainPage", () => {
  test("displays a cryptocurrency", () => {
    const props = {
      coins: [
        {
          id: "bitcoin",
          name: "Bitcoin",
          current_price: 65000,
          price_change_percentage_24h: 2.5,
          image: "bitcoin.png",
          sparkline_in_7d: {
            price: [60000, 62000, 65000],
          },
        },
      ],

      trendingCoins: [],

      allCoins: [],
    };

    render(<MainPage {...props} />);

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  });
});

test("renders the error page when a child component throws an error", () => {
  const BrokenComponent = () => {
    throw new Error("Something went wrong");
  };

  render(
    <ErrorBoundary fallback={<h1>something went wrong</h1>}>
      <BrokenComponent />
    </ErrorBoundary>,
  );

  expect(screen.getByText("something went wrong")).toBeInTheDocument();
});

test("navigates to the detail page when a user clicks a cryptocurrency", () => {
  const props = {
    coins: [
      {
        id: "bitcoin",
        name: "Bitcoin",
        current_price: 65000,
        price_change_percentage_24h: 2.5,
        image: "bitcoin.png",
        sparkline_in_7d: {
          price: [60000, 62000, 65000],
        },
      },
    ],

    trendingCoins: [],

    allCoins: [],

    findId: jest.fn(),
  };

  render(<MainPage {...props} />);

  const bitcoin = screen.getByText("Bitcoin");

  userEvent.click(bitcoin);

  expect(mockNavigate).toHaveBeenCalledWith("/coins/bitcoin");
});

test("adds the coin to the watchlist when the user clicks Add this coin to watchlist", () => {
  const handleAddtoWatchlist = jest.fn();

  const props = {
    specificCoin: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "btc",
      image: {
        small: "bitcoin.png",
      },
      market_cap_rank: 1,

      market_data: {
        current_price: {
          usd: 65000,
        },

        market_cap_change_percentage_24h: 2.5,

        market_cap: {
          usd: 1200000000000,
        },

        total_volume: {
          usd: 30000000000,
        },

        circulating_supply: 19000000,

        ath: {
          usd: 73000,
        },

        atl: {
          usd: 67,
        },

        ath_date: {
          usd: "2024-03-14T00:00:00.000Z",
        },

        atl_date: {
          usd: "2013-07-06T00:00:00.000Z",
        },
      },

      description: {
        en: "Bitcoin is a cryptocurrency.",
      },
    },

    chartData: {
      prices: [
        [1, 60000],
        [2, 65000],
      ],
    },

    allCoins: [],

    detailError: null,
    chartError: null,

    daysForChart: 1,

    setDaysForChart: jest.fn(),

    handleAddtoWatchlist,

    findId: jest.fn(),
  };

  render(<DetailPage {...props} />);

  const button = screen.getByRole("button", {
    name: "Add this coin to watchlist",
  });

  userEvent.click(button);

  expect(handleAddtoWatchlist).toHaveBeenCalledWith({
    id: "bitcoin",
    name: "Bitcoin",
    image: "bitcoin.png",
    price: 65000,
    percentage24h: 2.5,
  });
});

test("removes a coin from the watchlist when the user clicks Delete", () => {
  const TestWrapper = () => {
    const [watchlistData, setWatchlistData] = React.useState([
      {
        id: "bitcoin",
        name: "Bitcoin",
        image: "bitcoin.jpg",
        price: 50000,
        percentage24h: 2,
      },
      {
        id: "ethereum",
        name: "Ethereum",
        image: "ethereum.jpg",
        price: 3000,
        percentage24h: 3,
      },
    ]);

    return (
      <Watchlist
        watchlistData={watchlistData}
        setWatchlistData={setWatchlistData}
        allCoins={[]}
        findId={jest.fn()}
        setBackgroundColor={jest.fn()}
      />
    );
  };

  render(<TestWrapper />);

  expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  expect(screen.getByText("Ethereum")).toBeInTheDocument();

  const ethereum = screen.getByText("Ethereum");
  const ethereumCard = ethereum.parentElement;
  const deleteButton = ethereumCard.querySelector("button");

  fireEvent.click(deleteButton);

  expect(screen.queryByText("Ethereum")).not.toBeInTheDocument();

  expect(screen.getByText("Bitcoin")).toBeInTheDocument();
});
