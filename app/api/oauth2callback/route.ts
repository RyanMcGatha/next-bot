import { authenticate } from "../../../bot/googleCalenderServiece"; // Adjust the path to where your `authenticate` function is located

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  const { code } = await req.json();

  if (!code) {
    return new Response(
      JSON.stringify({ error: "Missing authorization code" }),
      { status: 400 }
    );
  }

  try {
    await authenticate(code);
    return new Response(
      "Authentication successful! You can close this window and return to Discord.",
      { status: 200 }
    );
  } catch (error) {
    console.error("Error authenticating with Google Calendar:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred during authentication" }),
      { status: 500 }
    );
  }
}
