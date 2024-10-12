import pool from "../../../bot/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest, res: NextResponse) {
  const { username, password } = await req.json();

  // Validate input
  if (!username || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    // Check if the user exists in the database
    const user = await pool.query("SELECT * FROM Users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    // Compare the submitted password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    // Authentication successful
    return NextResponse.json(
      { message: "Signin successful", user: user.rows[0] },
      { status: 200 }
    );

    // Optionally, you can generate a JWT token here for session management
    // const token = generateToken(user.rows[0]);
    // res.json({ message: "Signin successful", token });
  } catch (err) {
    console.error("Error during signin:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
