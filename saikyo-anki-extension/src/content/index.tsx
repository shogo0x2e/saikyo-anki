import React from 'react';
import { createRoot } from 'react-dom/client';
import Content from './Content';
import { MantineProvider } from '@mantine/core';
import { ActionIcon, Image, Tooltip } from '@mantine/core';
import { SessionStorageController}   from './sessionStorageController';


chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.type === 'SHOW') {
    const selection = window.getSelection();
    if (selection !== undefined && selection !== null && selection.toString() !== undefined) {
      console.log("create dialog");
      const oRange = selection.getRangeAt(0);
      const oRect = oRange.getBoundingClientRect();
      if (selection.toString().length === 0) {
        return;
      }

      const extentionRootLength = document.getElementsByTagName('my-extension-root').length;
      SessionStorageController.addTmpText('translatedText', message.data.translatedText.toString());
      SessionStorageController.addTmpText('originalText', message.data.originalText.toString());
      if(extentionRootLength === 0) {
        SessionStorageController.removeTmpText('rect');
        SessionStorageController.addTmpText('rect', rectToJson(oRect));
      }

      const container = document.createElement('my-extension-root');
      document.body.after(container);
      createRoot(container).render(
        
          <MantineProvider>
            <Content
              orect={jsonToRects(SessionStorageController.getTmpTexts('rect'))}
              translatedText={SessionStorageController.getTmpTexts('translatedText')}
              originalText={SessionStorageController.getTmpTexts('originalText')}
            />
          </MantineProvider>
        
      );
    }
  }
});

document.addEventListener('mouseup', () => {
  const selection = window.getSelection();

  if (selection === undefined || selection === null) {
    return;
  }
  // remove icon when no text is selected
  if(selection.toString().length === 0) {
    for (let i = 0; i < document.getElementsByTagName('my-extension-root-icon').length; i++) {
      document.getElementsByTagName('my-extension-root-icon')[i].remove();
    }
    return;
  }
  if (selection.toString().length > 0) {
    const oRange = selection.getRangeAt(0);
    const oRect = oRange.getBoundingClientRect();
    let container;
    let root;

    if (document.getElementsByTagName('my-extension-root-icon').length > 0) {
      container = document.getElementsByTagName('my-extension-root-icon')[0];
      root = container._reactRootContainer;
    }else{  // create new icon
      container = document.createElement('my-extension-root-icon');
      document.body.after(container);
      root = createRoot(container);
      container._reactRootContainer = root;
    }
    // rerender icon
    root.render(<Icon selectedText={selection.toString()} orect={oRect} />);
  }
});

//when the page is reloaded, remove the temporary data
window.addEventListener('beforeunload', function(){
  SessionStorageController.removeTmpText('translatedText');
    SessionStorageController.removeTmpText('originalText');
    SessionStorageController.removeTmpText('rect');
});

const Icon = ({ selectedText, orect }: { selectedText: string; orect: DOMRect }) => {
  const handleClick = async () => {
    for (let i = 0; i < document.getElementsByTagName('my-extension-root-icon').length; i++) {
      document.getElementsByTagName('my-extension-root-icon')[i].remove();
    }
    let rtnPromise = chrome.runtime.sendMessage({
      type: 'TRANSLATE',
      data: {
        selectionText: selectedText,
      },
    });
    rtnPromise.then(() => {
      //console.log('Message sent successfully');
    }).catch((error) => {
      console.error('Error sending message:', error);
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        left: '0px',
        top: '0px',
        zIndex: 2147483551,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: window.scrollX + orect.right,
          top: window.scrollY + orect.bottom,
          zIndex: 2147483551,
        }}
        onClick={handleClick}
      >
        <Tooltip label="選択したテキストを翻訳" withArrow>
          <ActionIcon
            radius="xl"
            variant="default"
            size="lg"
            sx={{
              boxShadow: '0 0 10px rgba(0,0,0,.3);',
              zIndex: 2147483551,
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                zIndex: 2147483551,
              }}
            >
              <Image src={chrome.runtime.getURL('images/extension_128.png')} />
            </div>
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
};

function rectToJson(domRect:DOMRect): string {
  const rectObj = {
      x: domRect.x,
      y: domRect.y,
      width: domRect.width,
      height: domRect.height,
      top: domRect.top,
      right: domRect.right,
      bottom: domRect.bottom,
      left: domRect.left
  };

  const json = JSON.stringify(rectObj);
  return json;
}

function jsonToRects(jsonArray: string[]): { x: number, y: number, width: number, height: number, top: number, right: number, bottom: number, left: number }[] {
  return jsonArray.map(json => {
    const rectObj = JSON.parse(json);
    return {
      x: rectObj.x,
      y: rectObj.y,
      width: rectObj.width,
      height: rectObj.height,
      top: rectObj.top,
      right: rectObj.right,
      bottom: rectObj.bottom,
      left: rectObj.left
    };
  });
}