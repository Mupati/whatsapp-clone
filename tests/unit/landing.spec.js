import { render, screen } from "@testing-library/vue";
import NoSelectedMessage from "@/components/NoSelectedMessage.vue";

describe("NoSelectedMessage.vue", () => {
  it("renders props.msg when passed", () => {
    render(NoSelectedMessage);
    screen.getByText(/Keep/i);
  });
});
