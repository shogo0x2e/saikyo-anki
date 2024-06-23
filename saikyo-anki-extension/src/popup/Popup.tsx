import { getBucket } from '@extend-chrome/storage';
import { Container, TextInput, Text, Anchor } from '@mantine/core';
import { useEffect, useState } from 'react';

interface UserDataBucket {
  email: string | null;
}

const bucket = getBucket<UserDataBucket>('user_bucket', 'sync');


const Popup = () => {
  document.body.style.width = '20rem';
  document.body.style.height = '20rem';

  const [email, setEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { email } = await bucket.get();
      if (email) {
        setEmail(email);
      }
    })();
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const saveEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.currentTarget.value;
    if (!validateEmail(newEmail)) {
      setEmailError('有効なEメールアドレスを入力してください。');
    } else {
      setEmailError('');
      bucket.set({ email: newEmail });
    }
    setEmail(newEmail);
  };

  return (
    <Container p="xl">
      <TextInput
        label="登録済のEmailアドレスを入力"
        value={email}
        onChange={saveEmail}
        placeholder="your-email@example.com"
        clearable
        error={emailError}
      />
      <Text align="center" mt="md">
        <Anchor href="https://saikyo-anki.vercel.app/auth/sign-in?callbackUrl=https%3A%2F%2Fsaikyo-anki.vercel.app%2F" target="_blank">新規登録</Anchor>
      </Text>
    </Container>
  );
};

export default Popup;
