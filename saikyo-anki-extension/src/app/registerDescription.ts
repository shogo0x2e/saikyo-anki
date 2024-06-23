type Result = {
    message: string;
};

export const registerDescription = async (userEmail: string, registeredWordId: string) => {
const API_URL = 'https://saikyo-anki.vercel.app/api/v1/highlight';
const BEARER = 'MErGQyaEMr7cm16/Uoi0edgj/xO8Wg2+lEc25V/LQLQ=';
const email = userEmail;
const wordId = registeredWordId;

console.log(email, wordId);

const url = API_URL ;
const res = await fetch(url, {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Authorization': `Bearer ${BEARER}`
  },
  body: JSON.stringify({ email, wordId })
});
};