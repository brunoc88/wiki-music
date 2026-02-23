import { ZodTypeAny, infer as zInfer } from "zod"
import { NextResponse } from "next/server"

export const validateRequest = async <S extends ZodTypeAny>(
  req: Request,
  schema: S
): Promise<
  | { success: true; data: zInfer<S>; file: File | null }
  | { success: false; response: NextResponse }
> => {

  const contentType = req.headers.get("content-type") ?? ""
  let rawData: unknown
  let file: File | null = null
  let formData: FormData | null = null

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData()

    const raw: Record<string, any> = {}

    for (const key of formData.keys()) {
      const values = formData.getAll(key)

      raw[key] = values.length > 1 ? values : values[0]
    }

    rawData = raw
    file = formData.get("file") as File | null
  }
  else {
    rawData = await req.json()
  }

  const parsed = schema.safeParse(rawData)


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
    data: parsed.data,
    file
  }
}
