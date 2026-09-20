import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { httpCompression } from "~/shared/lib/http-compression";

export default createServerEntry({
  async fetch(...args) {
    const response = await handler.fetch(...args);
    return httpCompression.html(args[0], response);
  },
});
