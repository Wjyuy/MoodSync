import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POST 메서드만 허용됩니다." })
  }

  const userData = req.body

  try {
    // churnAnalize.js의 로직을 여기서 사용
    const tfResponse = await fetch("http://localhost:4000/predict-churn-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (!tfResponse.ok) {
      const errorText = await tfResponse.text()
      return res.status(tfResponse.status).json({ message: "TensorFlow 서버 오류", detail: errorText })
    }

    const tfResult = await tfResponse.json()

    res.status(200).json({
      tfResult,
      userData,
    })
  } catch (error) {
    console.error("통신 오류:", error)
    res.status(500).json({ message: "서버 통신 중 오류가 발생했습니다." })
  }
}
