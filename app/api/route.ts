export async function GET() {
  const resp = await fetch(`${process.env.API_HOST_AKATSUKI}`);
  const data = await resp.json();
  return Response.json(data, { status: resp.status });
}
