type Result = {
    message: string;
};

export const registerDescription = async (searchText: string, description: string) => {
const API_URL = 'https://saikyo-anki.vercel.app/api/explanation';
const BEARER = 'MErGQyaEMr7cm16/Uoi0edgj/xO8Wg2+lEc25V/LQLQ=';
const word = description;

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
return json.message;
};