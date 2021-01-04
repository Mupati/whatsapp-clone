import { render, screen } from "@testing-library/vue";
import NoSelectedMessage from "@/components/NoSelectedMessage.vue";

describe("NoSelectedMessage.vue", () => {
  it("renders no message feedback", () => {
    render(NoSelectedMessage);
    screen.getByText(/Keep/i);
  });
});
