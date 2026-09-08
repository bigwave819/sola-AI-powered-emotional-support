import { useMutation } from '@tanstack/react-query';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { tokenStorage } from '@/src/auth/tokenStorage';

export function useExportData() {
  return useMutation({
    mutationFn: async () => {
      const accessToken = await tokenStorage.getAccessToken();
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/privacy/export`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.text();

      const file = new File(Paths.document, 'sola-export.json');
      file.write(json);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      }
      return file.uri;
    },
  });
}