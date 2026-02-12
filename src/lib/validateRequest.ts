import { ZodTypeAny, infer as zInfer } from "zod"
import { NextResponse } from "next/server"

export const validateRequest = async <S extends ZodTypeAny>(
  req: Request,
  schema: S
): Promise<
  | { success: true; data: zInfer<S> }
  | { success: false; response: NextResponse }
> => {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
  }

  return {
    success: true,
    data: parsed.data
  }
}
