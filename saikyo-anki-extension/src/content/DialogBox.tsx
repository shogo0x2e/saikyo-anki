import { ActionIcon, Avatar, Box, CopyButton, Divider, Flex, Group, Select, Stack, Text, Tooltip } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useState } from 'react';
import { useRef } from 'react';
import { MdDone, MdOutlineEditNote, MdVolumeUp } from 'react-icons/md';
import { GiNotebook } from "react-icons/gi";
import { registerDescription } from '../app/registerDescription';
import { getBucket } from '@extend-chrome/storage';
import { SessionStorageController}   from './sessionStorageController';
import React from 'react';

interface MyBucket {
    targetLang: string;
  }
  const bucket = getBucket<MyBucket>('my_bucket', 'sync');


export interface DialogBoxProps {
  translatedText: string;
  originalText: string;
}


export const DialogBox = (props: DialogBoxProps) => {
  const [opened, setOpened] = useState(true);
  const dialog = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState(props.translatedText);
  const [searchText, setSearchText] = useState(props.originalText);

  const deleteExtensionRoot = () => {
    const rootLength = document.getElementsByTagName('my-extension-root').length;
    if(rootLength === 0) return;
    for (let i = 0; i < rootLength; i++) {
      document.getElementsByTagName('my-extension-root')[0].remove();
    }
    SessionStorageController.removeTmpText('translatedText');
    SessionStorageController.removeTmpText('originalText');
    SessionStorageController.removeTmpText('rect');
  }
  const deleteExistingDialog = () => {
    const existingDialogs = document.getElementsByClassName('my-dialog-box');
    while (existingDialogs.length > 0) {
      existingDialogs[0].parentNode.removeChild(existingDialogs[0]);
    }
  }
  const handleClickOutside = () => {
    deleteExistingDialog();
    deleteExtensionRoot();
  }

  useClickOutside(() => handleClickOutside(), null, [dialog]);

  deleteExistingDialog();
  const IconUrl = chrome.runtime.getURL('images/extension_128.png');
  const handleRegister = async (searchText: string, text: string) => {
    const result = await registerDescription(searchText, text);
    console.log(result);
  }
  const repeatText = Array(text.length).fill(null).map((_, index) => (
    <React.Fragment key={index}>
    <Flex pb="xs" gap="xs" justify="flex-start" align="center">
      <Avatar src={IconUrl} />
         <Text size="md" c="dark">
          解説：{searchText[index]}
        </Text> 
    </Flex>
      <Divider />
    <Stack pt="sm" spacing="xs" style={{ textAlign: 'left' }}>
      <Text size="sm" c="dark">
        {text[index]}
      </Text>
        <Group position="right" spacing="xs">
          {/* 3. */}
          <Tooltip label="音声読み上げ" withArrow>
            <ActionIcon>
              <MdVolumeUp />
            </ActionIcon>
          </Tooltip>
          {/* 4. */}
          <CopyButton value={text[index]}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? '単語帳に追加しました' : '単語帳に追加する'} withArrow>
                <ActionIcon onClick={() => { copy(); handleRegister(searchText[index], text[index]); }}>
                  {copied ? <MdDone /> : <GiNotebook />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
    </Stack>
  </React.Fragment>
  ));

  return opened ? (
    <div className="my-dialog-box">
    <Box
      sx={(theme) => ({
        textAlign: 'left',
        padding: theme.spacing.md,
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: theme.radius.md,
        boxShadow: '0px 0px 10px rgba(0,0,0,.3)',
        zIndex: 2147483550,
      })}
      component="div"
      ref={dialog}
    >
      {repeatText}
    </Box>
    </div>
  ) : (
    <></>
  );
};