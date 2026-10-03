import reducer, {
  toggleCategory,
} from "@/store/slices/preferencesSlice";

import type { UserPreferences } from "@/types/preferences";

test("toggles a preference category", () => {
  const initial: UserPreferences = {
    categories: ["technology", "entertainment"],
  };

  const removed = reducer(
    initial,
    toggleCategory("technology")
  );

  expect(removed.categories).not.toContain("technology");

  const added = reducer(
    removed,
    toggleCategory("technology")
  );

  expect(added.categories).toContain("technology");
});