type Result = {
        id: string;
        content: string;
        aiExplanation: string;
        createdAt: string;
        updatedAt: string;
  };
  
  export const generateDescription = async (selectedText: string, useremail: string) => {
    const API_URL = 'https://saikyo-anki.vercel.app/api/v1/word';
    const BEARER = 'MErGQyaEMr7cm16/Uoi0edgj/xO8Wg2+lEc25V/LQLQ=';
    const word = selectedText;
    const email = useremail;
    
    const url = API_URL ;
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${BEARER}`
      },
      body: JSON.stringify({email ,word })
    });
    const json: Result = await res.json();
    return {
      id: json.id,
      content: json.content,
      aiExplanation: json.aiExplanation
    };
  };