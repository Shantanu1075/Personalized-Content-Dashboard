import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { store } from "@/store/store";
import PreferencesPanel from "@/components/settings/PreferencesPanel";

test("renders preferences", () => {
  render(<Provider store={store}><PreferencesPanel /></Provider>);
  expect(screen.getByText(/favorite categories/i)).toBeInTheDocument();
});