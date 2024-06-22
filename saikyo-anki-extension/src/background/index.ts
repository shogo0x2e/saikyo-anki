import { generateDescription } from '../app/generateDescription';

import { getBucket } from '@extend-chrome/storage';

interface MyBucket {
  targetLang: string;
}

const bucket = getBucket<MyBucket>('my_bucket', 'sync');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translation',
    title: '選択したテキストを翻訳',
    contexts: ['selection'],
  });
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if(tab !== undefined) {
    switch(info.menuItemId) {
      case 'translation': {
        const selectedText = info.selectionText !== undefined ? info.selectionText : '';
        const value = await bucket.get();
        const userTargetLang = value.targetLang ?? 'JA';
        const translatedText = await generateDescription(selectedText, userTargetLang);
        
        console.log("result:"+translatedText);
        let rtnPromise = chrome.tabs.sendMessage(tab.id as number, {
          type: 'SHOW',
          data: {
            lang: userTargetLang,
            translatedText: translatedText,
            originalText: selectedText,
          },
        });
        rtnPromise.then(() => {
          //console.log('Message sent successfully');
        }).catch((error) => {
          console.error('Error sending message:', error);
        });
        break;
      }
    }
  }
});

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.type === 'TRANSLATE') {
    const selectedText = message.data.selectionText ?? '';
    const value = await bucket.get();
    const userTargetLang = value.targetLang ?? 'JA';
    const translatedText = await generateDescription(selectedText, userTargetLang);
    
    let rtnPromise = chrome.tabs.sendMessage(sender.tab?.id as number, {
      type: 'SHOW',
      data: {
        lang: userTargetLang,
        translatedText: translatedText,
        originalText: selectedText,
      },
    });
    rtnPromise.then(() => {
      //console.log('Message sent successfully');
    }).catch((error) => {
      console.error('Error sending message:', error);
    });
  }
});
export {};