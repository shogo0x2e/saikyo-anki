type Result = {
        id: string;
        content: string;
        aiExplanation: string;
        createdAt: string;
        updatedAt: string;
  };
  
  export const generateDescription = async (selectedText: string, userTargetLang: string) => {
    const API_URL = 'https://saikyo-anki.vercel.app/api/v1/word';
    const BEARER = 'MErGQyaEMr7cm16/Uoi0edgj/xO8Wg2+lEc25V/LQLQ=';
    const word = selectedText;

    const url = API_URL ;
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${BEARER}`
      },
      body: JSON.stringify({word })
    });
    const json: Result = await res.json();
    return json.aiExplanation;
  };