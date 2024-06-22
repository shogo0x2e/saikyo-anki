export class SessionStorageController{
    static addTmpText(itemName: string, addText: string) {
        // sessionStorage から既存の translatedText 配列を取得
        const existingTexts = sessionStorage.getItem(itemName);
        const translatedTexts = existingTexts ? JSON.parse(existingTexts) : [];
      
        // 新しいテキストを配列に追加
        translatedTexts.push(addText);
      
        // 配列を JSON 文字列に変換して保存
        sessionStorage.setItem(itemName, JSON.stringify(translatedTexts));
      }
      
      static replaceTmpText(itemName: string,index: int, newText: string) {
        // sessionStorage から既存の translatedTexts 配列を取得
        const existingTexts = sessionStorage.getItem(itemName);
        let translatedTexts = existingTexts ? JSON.parse(existingTexts) : [];
      
        // 指定されたインデックスが配列の範囲内にある場合にのみ置き換えを行う
        if (index >= 0 && index < translatedTexts.length) {
          translatedTexts[index] = newText;
          // 更新された配列を JSON 文字列に変換して保存
          sessionStorage.setItem(itemName, JSON.stringify(translatedTexts));
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

