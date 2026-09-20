export const httpCompression = {
  html(request: Request, response: Response): Response {
    if (
      request.method !== "GET" ||
      request.headers.has("authorization") ||
      request.headers.has("cookie") ||
      response.status !== 200 ||
      !response.body ||
      !response.headers.get("content-type")?.startsWith("text/html") ||
      response.headers.has("content-encoding") ||
      response.headers.has("set-cookie") ||
      /\bno-transform\b/i.test(response.headers.get("cache-control") ?? "")
    ) {
      return response;
    }

    const headers = new Headers(response.headers);
    const vary = headers.get("vary") ?? "";
    if (
      !vary
        .split(",")
        .some((value) => /^(accept-encoding|\*)$/i.test(value.trim()))
    ) {
      headers.set(
        "vary",
        vary ? `${vary}, Accept-Encoding` : "Accept-Encoding",
      );
    }
    const acceptsGzip = (request.headers.get("accept-encoding") ?? "")
      .split(",")
      .some((value) => {
        const [encoding, ...parameters] = value.trim().toLowerCase().split(";");
        const quality = parameters.find((parameter) =>
          parameter.trim().startsWith("q="),
        );
        return (
          encoding === "gzip" &&
          (quality === undefined || Number(quality.trim().slice(2)) > 0)
        );
      });
    if (!acceptsGzip) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    headers.set("content-encoding", "gzip");
    headers.delete("content-length");
    const etag = headers.get("etag");
    if (etag && !etag.startsWith("W/")) headers.set("etag", `W/${etag}`);
    return new Response(
      response.body.pipeThrough(new CompressionStream("gzip")),
      {
        status: response.status,
        statusText: response.statusText,
        headers,
      },
    );
  },
};
