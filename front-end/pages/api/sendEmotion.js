export default async function emotion_data_handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST 메서드만 허용됩니다.' });
  }

  const userEmotionData = req.body; // 예시 : [0.12, 0.14, 0.35, 0. 65, 0.75, 0.00]

  console.log("@# userEmotionData =>", userEmotionData);

  // TensorFlow.js 서버로 예측 요청
  const tfResponse = await fetch('http://localhost:4000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userEmotionData),
  });

  const tfResult = await tfResponse.json(); // 예: { act: 5, music : 1 book : 4 }

  console.log("@# tfResult =>", tfResult);

  const requestData = {
    tfResult: tfResult,
    userEmotionData: userEmotionData
  };

  const springResponse = await fetch('http://localhost:8485/api/emotion-result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });

  console.log("@#@#@#@#@#@#@userEmotionData => " + userEmotionData);

  if (!springResponse.ok) {
    const text = await springResponse.text(); // JSON 아님. 텍스트 출력해보기
    console.error('Spring server response error:', springResponse.status, text);
    return res.status(500).json({ error: 'Spring server error', details: text });
  }

  const springResult = await springResponse.json();
  console.log("@# 결과값 =>",springResult);
  res.status(200).json(springResult);
}
