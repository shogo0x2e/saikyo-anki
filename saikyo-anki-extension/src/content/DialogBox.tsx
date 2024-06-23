import { ActionIcon, Avatar, Box, Button, Divider, Flex, Group, Select, Stack, Text, Tooltip } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useState } from 'react';
import { useRef } from 'react';
import { MdDone, MdOutlineEditNote, MdVolumeUp } from 'react-icons/md';
import { GiNotebook } from "react-icons/gi";
import { registerDescription } from '../app/registerDescription';
import { getBucket } from '@extend-chrome/storage';
import { SessionStorageController}   from './sessionStorageController';
import React from 'react';

interface UserDataBucket {
    email: string;
  }
  const bucket = getBucket<UserDataBucket>('user_bucket', 'sync');


export interface DialogBoxProps {
  searchedDatas: string[];
  registered: boolean;
  email: string;
}


export const DialogBox = (props: DialogBoxProps) => {
  const [opened, setOpened] = useState(true);
  const dialog = useRef<HTMLDivElement | null>(null);
  const [searchedDatas, setSearchedDatas] = useState(props.searchedDatas);
  const [registered, setRegistered] = useState(props.registered);
  const [email, setEmail] = useState(props.email);
  
  const handleClickOutside = () => {
    setOpened(false);
    const rootLength = document.getElementsByTagName('my-extension-root').length;
    if(rootLength === 0) return;
    for (let i = 0; i < rootLength; i++) {
      document.getElementsByTagName('my-extension-root')[0].remove();
    }
    SessionStorageController.removeTmpText('searchedDatas');
    SessionStorageController.removeTmpText('registered');
    SessionStorageController.removeTmpText('rect');
  }
  const replaseRegistered = (index: number, newData: boolean) => {
    SessionStorageController.replaceTmpText('registered', index, newData);
    const newRegistered = [...registered];
    newRegistered[index] = newData;
    setRegistered(newRegistered);
  }

  useClickOutside(() => handleClickOutside(), null, [dialog]);

  const IconUrl = chrome.runtime.getURL('images/saikyo_anki_icon_128.png');
  // const handleRegister = async (explanationTexts: string, explanationTexts: string) => {
  //   const result = await registerDescription(explanationTexts, explanationTexts);
  //   console.log(result);
  // }
  const repeatText = Array(searchedDatas.length).fill(null).map((_, index) => (
    <React.Fragment key={index}>
    <Flex pb="xs" gap="xs" justify="flex-start" align="center">
      <Avatar src={IconUrl} />
         <Text size="md" c="dark">
          解説：{searchedDatas[index].content}
        </Text> 
    </Flex>

    <Divider />

    <Stack pt="sm" spacing="xs" style={{ textAlign: 'left' }}>
      <Text size="sm" c="dark">
        {searchedDatas[index].aiExplanation}
      </Text>
      <Group position="right" spacing="xs">
        <Tooltip label={registered[index] ? '単語帳に追加しました' : '単語帳に追加する'} withArrow>
          <ActionIcon onClick={() => { 
              if(registered[index]) return;
              registerDescription(email, searchedDatas[index].id);
              replaseRegistered(index, true);
            }}>
            {registered[index] ? <MdDone /> : <GiNotebook />}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Stack>
  </React.Fragment>
  ));
  const errorText = Array(searchedDatas.length).fill(null).map((_, index) => (
    <React.Fragment key={index}>
    <Flex pb="xs" gap="xs" justify="flex-start" align="center">
      <Avatar src={IconUrl} />
         <Text size="md" c="dark">
          Email 認証エラー
        </Text> 
    </Flex>

    <Divider />

    <Stack pt="sm" spacing="xs" style={{ textAlign: 'left' }}>
      <Text size="sm" c="dark">
        {searchedDatas[index].aiExplanation}
      </Text>
      <Group position="right" spacing="xs">
      <Button color="red" onClick={() => alert('拡張機能のアイコンをクリックして、設定を確認してください。')}>
              登録済のEmailアドレスを設定してください
            </Button>
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
      {searchedDatas[0].id == undefined?errorText:repeatText}
    </Box>
    </div>
  ): (
    <></>
  );
};