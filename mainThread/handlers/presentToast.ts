type Props = {
  message: string;
  timeout?: number;
  error?: boolean;
};

export default function presentToast({ message, error, timeout }: Props) {
  figma.notify(message, {
    timeout: timeout ?? 10000,
    error,
  });
}
