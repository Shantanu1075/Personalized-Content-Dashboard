import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { store } from "@/store/store";
import SearchBar from "@/components/search/SearchBar";

test("renders search input", () => {
  render(<Provider store={store}><SearchBar /></Provider>);
  expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument();
});

