import { generateDescription } from '../app/generateDescription';
import { getBucket } from '@extend-chrome/storage';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import { MantineProvider } from '@mantine/core';

interface UserDataBucket {
  email: string;
}

const bucket = getBucket<UserDataBucket>('user_bucket', 'sync');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translation',
    title: '選択したテキストの解説を生成',
    contexts: ['selection'],
  });
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if(tab !== undefined) {
    switch(info.menuItemId) {
      case 'translation': {
        const selectedText = info.selectionText !== undefined ? info.selectionText : '';
        const value = await bucket.get();
        const useremail = value.email;
        const searchedData = await generateDescription(selectedText, useremail);

        let rtnPromise = chrome.tabs.sendMessage(tab.id as number, {
          type: 'SHOW',
          data: {
            lang: useremail,
            searchedData: searchedData,
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
    const useremail = value.email;
    const searchedData = await generateDescription(selectedText, useremail);

    let rtnPromise = chrome.tabs.sendMessage(sender.tab?.id as number, {
      type: 'SHOW',
      data: {
        lang: useremail,
            searchedData: searchedData,
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