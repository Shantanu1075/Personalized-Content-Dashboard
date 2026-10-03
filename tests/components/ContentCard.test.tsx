import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { store } from "@/store/store";
import ContentCard from "@/components/content/ContentCard";

test("renders a content card", () => {
  render(
    <Provider store={store}>
      <ContentCard item={{ id: "1", type: "news", title: "Hello", description: "World", source: "Test", category: "technology" }} />
    </Provider>
  );
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
