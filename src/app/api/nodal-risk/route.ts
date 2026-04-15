import { NextResponse } from "next/server"

import { predict } from "@/features/nodal-calculator/model/predict"
import { calculatorSchema } from "@/features/nodal-calculator/model/schema"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = calculatorSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid calculator input" },
      { status: 400 }
    )
  }

  return NextResponse.json(predict(parsed.data))
}
