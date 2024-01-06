const superSo = "https://rweth.super.site";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Proxy the request to our notion super.so
  const upstreamUrl = request.url.replace(url.origin, superSo);
  console.log(`[WEB] proxying ${request.url} to ${upstreamUrl}`);

  // Proxy the request to super.so
  const res = await fetch(upstreamUrl, {
    method: request.method,
    headers: {
      ...request.headers,
      Host: "rweth.super.site",
    },
  });

  const resBody = await res.blob();
  console.log(`[WEB] got ${res.status} ${res.statusText}, ${resBody.size}b`);

  const headers = new Headers();
  for (const [key, value] of res.headers.entries()) {
    if (key === "content-encoding") continue;
    if (key.startsWith("x-")) continue;
    headers.set(key, value);
  }

  return new Response(resBody, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
