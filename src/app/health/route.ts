import { NextResponse } from "next/server";

export async function GET() {
  try {
    // You could add database connectivity checks here if needed
    // const status = await checkDatabase(); 
    
    return NextResponse.json(
      { 
        status: "up",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        uptime: process.uptime()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "down", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Ensure this route is not cached
export const dynamic = "force-dynamic";
