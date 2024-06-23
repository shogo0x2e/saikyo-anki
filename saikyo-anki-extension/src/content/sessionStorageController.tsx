export class SessionStorageController{
    static addTmpText(itemName: string, addData) {
        const existingTexts = sessionStorage.getItem(itemName);
        const explanationTexts = existingTexts ? JSON.parse(existingTexts) : [];
      
        explanationTexts.push(addData);
        sessionStorage.setItem(itemName, JSON.stringify(explanationTexts));
      }
      
      static replaceTmpText(itemName: string,index: int, newData) {
        const existingTexts = sessionStorage.getItem(itemName);
        let explanationTexts = existingTexts ? JSON.parse(existingTexts) : [];

        if (index >= 0 && index < explanationTexts.length) {
          explanationTexts[index] = newData;
          sessionStorage.setItem(itemName, JSON.stringify(explanationTexts));
        } else {
          console.error('Invalid index for replacement');
        }
      }
      
      static getTmpTexts(itemName: string) {
        const existingTexts = sessionStorage.getItem(itemName);
        return existingTexts ? JSON.parse(existingTexts) : [];
      }
      
      static removeTmpText(itemName: string) {
        sessionStorage.removeItem(itemName);
      }
}

